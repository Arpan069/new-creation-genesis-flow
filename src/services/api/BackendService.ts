
/**
 * Service for communicating with the Flask backend
 * This service handles all API calls to the backend server
 */

import { BACKEND_CONFIG } from "@/config/backendConfig";
import { RequestHelper } from './RequestHelper';
import { BackendError } from './BackendError';

/**
 * Service for making requests to the Flask backend
 */
export class BackendService {
  private requestHelper: RequestHelper;
  
  constructor(config = BACKEND_CONFIG) {
    this.requestHelper = new RequestHelper(
      config.baseUrl,
      config.debug,
      config.retry
    );
  }

  /**
   * Check if the backend is accessible
   * @returns Promise resolving to true if backend is available, false otherwise
   */
  async isBackendAvailable(): Promise<boolean> {
    try {
      await this.requestHelper.makeRequest<{status: string}>('health');
      return true;
    } catch (error) {
      this.requestHelper.log('Backend health check failed:', error);
      return false;
    }
  }
  
  /**
   * Transcribe audio using the backend
   * @param audioBlob - Audio blob to transcribe
   * @param options - Transcription options
   * @returns Promise with transcription result
   */
  async transcribe(audioBlob: Blob, options: any = {}): Promise<{ text: string }> {
    // Convert blob to base64
    const base64Data = await this.requestHelper.blobToBase64(audioBlob);
    
    return this.requestHelper.makeRequest<{ text: string }>("transcribe", "POST", {
      audio_data: base64Data,
      mime_type: audioBlob.type,
      options
    });
  }
  
  /**
   * Generate AI response through the backend
   * @param transcript - User transcript
   * @param currentQuestion - Current interview question
   * @param options - Generation options
   * @returns Promise with AI response text
   */
  async generateResponse(
    transcript: string,
    currentQuestion: string,
    options: any = {}
  ): Promise<string> {
    const response = await this.requestHelper.makeRequest<{ response: string }>(
      "generate-response", 
      "POST", 
      { transcript, currentQuestion, options }
    );
    
    return response.response;
  }
  
  /**
   * Convert text to speech through the backend
   * @param text - Text to convert to speech
   * @param options - TTS options
   * @returns Promise with audio URL
   */
  async textToSpeech(text: string, options: any = {}): Promise<Blob> {
    const response = await this.requestHelper.makeRequest<{ audio_data: string }>(
      "text-to-speech", 
      "POST", 
      { text, options }
    );
    
    // Convert base64 back to blob
    return this.requestHelper.base64ToBlob(response.audio_data, "audio/mp3");
  }
}

// Export singleton instance for use throughout the app
export const backendService = new BackendService();
