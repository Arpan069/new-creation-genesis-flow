/**
 * Consolidated OpenAI Service
 * 
 * This service combines multiple OpenAI API functionalities:
 * 1. Speech-to-text transcription (Whisper API)
 * 2. Text generation for AI interviewer responses (GPT API)
 * 3. Text-to-speech for AI interviewer voice (TTS API)
 * 
 * All API calls are now routed through the Flask backend for security
 */

import { backendService } from "./BackendService";

/**
 * Options for transcription requests
 */
interface TranscriptionOptions {
  language?: string;     // Specify a language (optional, Whisper can auto-detect)
  prompt?: string;       // Optional prompt to guide the transcription
  temperature?: number;  // Controls randomness (0-1)
  responseFormat?: string; // Format of the response (json, text, srt, etc.)
}

/**
 * Options for AI conversation generation
 */
interface ConversationOptions {
  model?: string;       // GPT model to use
  temperature?: number; // Creativity level (0-1)
  systemPrompt?: string; // System instructions for the AI
  maxTokens?: number;   // Maximum tokens in the response
}

/**
 * Options for text-to-speech conversion
 */
interface TextToSpeechOptions {
  voice?: string;      // Voice to use (alloy, echo, fable, onyx, nova, shimmer)
  speed?: number;      // Speed of speech (0.25-4.0)
  format?: string;     // Audio format (mp3, opus, aac, flac)
}

/**
 * Results from a transcription request
 */
interface TranscriptionResult {
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
 * Mock implementation to use when backend connection fails
 */
class MockOpenAIService {
  async transcribe(): Promise<TranscriptionResult> {
    console.log("Using mock transcription service");
    return { 
      text: "This is a mock transcription. Please check your Flask backend connection."
    };
  }

  async transcribeRealTime(): Promise<TranscriptionResult> {
    return this.transcribe();
  }

  async generateResponse(transcript: string): Promise<string> {
    console.log("Using mock AI response service");
    return "I'm a mock AI interviewer. To get real responses, please check your Flask backend connection.";
  }

  async textToSpeech(): Promise<Blob> {
    console.log("Using mock TTS service");
    // Create an empty audio blob
    return new Blob([], { type: "audio/mp3" });
  }

  async playAudio(): Promise<void> {
    console.log("Mock audio playback");
    // Wait a simulated time for "audio playback"
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

/**
 * Consolidated service for OpenAI API interactions via backend
 */
export class OpenAIService {
  private mockService: MockOpenAIService | null = null;
  private backendConnected: boolean = true;
  
  constructor() {
    // Check if backend is accessible
    this.checkBackendConnection();
  }
  
  /**
   * Check if the backend service is accessible
   */
  private async checkBackendConnection(): Promise<void> {
    try {
      // Make a simple health check request to the backend
      await fetch(`${backendService["baseUrl"]}/health`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.warn("Could not connect to Flask backend. Using mock service instead.");
      this.backendConnected = false;
      this.mockService = new MockOpenAIService();
    }
  }

  /**
   * Transcribe audio content using backend service
   * @param audioBlob - Audio/video blob to transcribe
   * @param options - Configuration options
   * @returns Promise with transcription result
   */
  async transcribe(audioBlob: Blob, options: TranscriptionOptions = {}): Promise<TranscriptionResult> {
    // Use mock service if backend is not connected
    if (!this.backendConnected && this.mockService) return this.mockService.transcribe();
    
    try {
      // Convert video to audio if necessary
      let contentBlob = audioBlob;
      if (audioBlob.type.startsWith('video/')) {
        contentBlob = await this.extractAudioFromVideo(audioBlob);
      }

      // Send to backend for transcription
      return await backendService.transcribe(contentBlob, options);
    } catch (error) {
      console.error("Transcription error:", error);
      throw error;
    }
  }

  /**
   * Performs real-time transcription of audio chunks through backend
   * @param audioBlob - Latest audio chunk for transcription
   * @param options - Optional configuration for transcription
   * @returns Promise with transcription result
   */
  async transcribeRealTime(audioBlob: Blob, options: TranscriptionOptions = {}): Promise<TranscriptionResult> {
    // Use mock service if backend is not connected
    if (!this.backendConnected && this.mockService) return this.mockService.transcribeRealTime();
    
    // For real-time transcription, use enhanced prompting and settings
    return this.transcribe(audioBlob, {
      temperature: 0.2,
      prompt: options.prompt || "This is part of an ongoing job interview conversation. The speaker is answering interview questions clearly and professionally.",
      language: "en",
      ...options
    });
  }

  /**
   * Process a transcript to generate an AI interviewer response via backend
   * @param transcript - The candidate's transcript text
   * @param currentQuestion - The current interview question
   * @param options - Configuration options for the API request
   * @returns Promise with the AI's response text
   */
  async generateResponse(
    transcript: string, 
    currentQuestion: string, 
    options: ConversationOptions = {}
  ): Promise<string> {
    // Use mock service if backend is not connected
    if (!this.backendConnected && this.mockService) return this.mockService.generateResponse(transcript);
    
    try {
      // Send to backend for processing
      return await backendService.generateResponse(transcript, currentQuestion, options);
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw error;
    }
  }

  /**
   * Convert text to speech using backend service
   * @param text - Text to convert to speech
   * @param options - Configuration options
   * @returns Promise with audio blob
   */
  async textToSpeech(text: string, options: TextToSpeechOptions = {}): Promise<Blob> {
    // Use mock service if backend is not connected
    if (!this.backendConnected && this.mockService) return this.mockService.textToSpeech();
    
    try {
      // Send to backend for TTS processing
      return await backendService.textToSpeech(text, options);
    } catch (error) {
      console.error("Error converting text to speech:", error);
      throw error;
    }
  }

  /**
   * Play audio from a blob using the browser's audio capabilities
   * @param audioBlob - The audio blob to play
   * @returns Promise that resolves when audio playback starts
   */
  async playAudio(audioBlob: Blob): Promise<void> {
    // Use mock service if backend is not connected
    if (!this.backendConnected && this.mockService) return this.mockService.playAudio();
    
    try {
      // Create an audio URL from the blob
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create and configure audio element
      const audioElement = new Audio(audioUrl);
      
      // Play the audio
      await audioElement.play();
      
      // Clean up URL when playback ends
      audioElement.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error("Error playing audio:", error);
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
              mimeType: 'audio/webm' // Format compatible with OpenAI API
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
}

// Export a default instance for easy imports
export const openAIService = new OpenAIService();
