
/**
 * OpenAI Whisper API Service for speech-to-text transcription
 * This service handles the communication with OpenAI's Whisper API to transcribe audio recordings
 */

// ADD YOUR API KEY HERE
const OPENAI_API_KEY = "your-api-key-here"; // REPLACE THIS WITH YOUR ACTUAL API KEY

/**
 * Transcription results interface returned from the Whisper API
 */
interface WhisperTranscriptionResult {
  text: string;          // The transcribed text
  language?: string;     // Language detected in the audio (if applicable)
  segments?: Array<{     // Individual segments of the transcription with timestamps
    id: number;
    text: string;
    start: number;
    end: number;
  }>;
}

/**
 * Options for configuring the transcription request
 */
export interface TranscriptionOptions {
  language?: string;     // Specify a language (optional, Whisper can auto-detect)
  prompt?: string;       // Optional prompt to guide the transcription
  temperature?: number;  // Controls randomness (0-1)
  responseFormat?: string; // Format of the response (json, text, srt, etc.)
}

/**
 * Service to handle OpenAI Whisper API integration for speech-to-text transcription
 */
export class WhisperService {
  private apiKey: string;
  private baseUrl = "https://api.openai.com/v1/audio/transcriptions";

  /**
   * Constructor for the WhisperService
   * @param apiKey - OpenAI API key for authentication
   */
  constructor(apiKey: string = OPENAI_API_KEY) {
    this.apiKey = apiKey;
  }

  /**
   * Transcribe audio content using Whisper API
   * @param audioBlob - Audio blob to transcribe
   * @param options - Optional configuration for transcription
   * @returns Promise with transcription result
   */
  async transcribe(audioBlob: Blob, options: TranscriptionOptions = {}): Promise<WhisperTranscriptionResult> {
    try {
      // Convert video to audio if necessary
      let contentBlob = audioBlob;
      if (audioBlob.type.startsWith('video/')) {
        contentBlob = await this.extractAudioFromVideo(audioBlob);
      }

      // Create form data for the API request
      const formData = new FormData();
      formData.append('file', contentBlob, 'audio.webm');
      formData.append('model', 'whisper-1'); // Using Whisper model

      // Add optional parameters if provided
      if (options.language) {
        formData.append('language', options.language);
      }
      
      if (options.prompt) {
        formData.append('prompt', options.prompt);
      }
      
      if (options.temperature !== undefined) {
        formData.append('temperature', options.temperature.toString());
      }
      
      formData.append('response_format', options.responseFormat || 'json');

      // Send request to OpenAI Whisper API
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Transcription failed');
      }

      // Parse and return the response
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Whisper transcription error:", error);
      throw error;
    }
  }

  /**
   * Extract audio track from video blob
   * @param videoBlob - Video blob to extract audio from
   * @returns Audio blob suitable for transcription
   */
  private async extractAudioFromVideo(videoBlob: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        const video = document.createElement('video');
        const audioContext = new AudioContext();
        const videoObjectUrl = URL.createObjectURL(videoBlob);
        
        video.src = videoObjectUrl;
        video.addEventListener('loadedmetadata', async () => {
          try {
            // Extract audio from video using MediaStream API
            const mediaStream = (video as any).captureStream(); // This may need special permissions
            const mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);
            const mediaRecorder = new MediaRecorder(mediaStream, { 
              mimeType: 'audio/webm' // Format compatible with Whisper API
            });
            
            const audioChunks: Blob[] = [];
            mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                audioChunks.push(event.data);
              }
            };
            
            mediaRecorder.onstop = () => {
              const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
              URL.revokeObjectURL(videoObjectUrl);
              resolve(audioBlob);
            };
            
            mediaRecorder.start();
            video.play();
            
            // Process audio for 30 seconds or duration of video
            setTimeout(() => {
              mediaRecorder.stop();
              video.pause();
            }, Math.min(30000, video.duration * 1000 || 30000));
          } catch (err) {
            // Fallback if browser doesn't support captureStream
            console.warn("Could not extract audio track, returning video blob:", err);
            resolve(videoBlob);
          }
        });
        
        video.addEventListener('error', (err) => {
          reject(new Error(`Failed to load video: ${err}`));
        });
        
        // Mute to prevent playback sound
        video.muted = true;
      } catch (error) {
        console.error("Error extracting audio:", error);
        reject(error);
      }
    });
  }

  /**
   * Performs real-time transcription of audio chunks
   * @param audioBlob - Latest audio chunk for transcription
   * @param options - Optional configuration for transcription
   * @returns Promise with transcription result
   */
  async transcribeRealTime(audioBlob: Blob, options: TranscriptionOptions = {}): Promise<WhisperTranscriptionResult> {
    // For real-time transcription, we use the same method but with potentially smaller audio chunks
    return this.transcribe(audioBlob, {
      ...options,
      // You might want to use a prompt that helps with continuity of transcription
      prompt: options.prompt || "This is part of an ongoing interview conversation."
    });
  }
}

// Export a default instance
export const whisperService = new WhisperService();
