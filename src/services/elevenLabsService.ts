
// ElevenLabs API Service for speech-to-text transcription

// ADD YOUR API KEY HERE
const ELEVEN_LABS_API_KEY = "your-api-key-here"; // REPLACE THIS WITH YOUR ACTUAL API KEY

interface TranscriptionResult {
  text: string;
  confidence?: number;
  speaker_labels?: string[];
  words?: Array<{
    word: string;
    start: number;
    end: number;
    confidence: number;
  }>;
}

export interface TranscriptionOptions {
  language?: string;
  model?: string;
}

/**
 * Service to handle ElevenLabs API integration for speech-to-text transcription
 */
export class ElevenLabsService {
  private apiKey: string;
  private baseUrl = "https://api.elevenlabs.io/v1";

  constructor(apiKey: string = ELEVEN_LABS_API_KEY) {
    this.apiKey = apiKey;
  }

  /**
   * Transcribe audio or video content
   * @param audioBlob Audio or video blob to transcribe
   * @param options Transcription options
   * @returns Promise with transcription result
   */
  async transcribe(audioBlob: Blob, options: TranscriptionOptions = {}): Promise<TranscriptionResult> {
    try {
      // Convert video to audio if necessary
      let contentBlob = audioBlob;
      if (audioBlob.type.startsWith('video/')) {
        contentBlob = await this.extractAudioFromVideo(audioBlob);
      }

      // Create form data
      const formData = new FormData();
      formData.append('audio', contentBlob);
      
      if (options.language) {
        formData.append('language', options.language);
      }
      
      if (options.model) {
        formData.append('model_id', options.model);
      }

      // Send request to ElevenLabs API
      const response = await fetch(`${this.baseUrl}/speech-to-text`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Transcription failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Transcription error:", error);
      throw error;
    }
  }

  /**
   * Extract audio track from video blob
   * @param videoBlob Video blob to extract audio from
   * @returns Audio blob
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
            const mediaStream = (video as any).captureStream(); // This may need special permissions
            const mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);
            const mediaRecorder = new MediaRecorder(mediaStream, { 
              mimeType: 'audio/webm' 
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
            
            // Process 30 seconds or full video duration
            setTimeout(() => {
              mediaRecorder.stop();
              video.pause();
            }, Math.min(30000, video.duration * 1000 || 30000));
          } catch (err) {
            // Fallback for browsers without captureStream
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
}

// Export a default instance
export const elevenLabsService = new ElevenLabsService();
