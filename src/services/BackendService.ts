
/**
 * Service for communicating with the Flask backend
 * This service handles all API calls to the backend server
 */

interface BackendConfig {
  baseUrl: string;
}

// Backend configuration - replace with your Flask server URL
const BACKEND_CONFIG: BackendConfig = {
  baseUrl: "http://localhost:5000/api", // Default Flask development server
};

/**
 * Service for making requests to the Flask backend
 */
export class BackendService {
  private baseUrl: string;
  
  constructor(config: BackendConfig = BACKEND_CONFIG) {
    this.baseUrl = config.baseUrl;
  }

  /**
   * Make a request to the backend API
   * @param endpoint - API endpoint to call
   * @param method - HTTP method
   * @param data - Optional request data
   * @returns Promise with response data
   */
  private async makeRequest<T>(
    endpoint: string, 
    method: string = "GET", 
    data?: any
  ): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      
      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json() as T;
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      throw error;
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
    const base64Data = await this.blobToBase64(audioBlob);
    
    return this.makeRequest<{ text: string }>("transcribe", "POST", {
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
    const response = await this.makeRequest<{ response: string }>(
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
    const response = await this.makeRequest<{ audio_data: string }>(
      "text-to-speech", 
      "POST", 
      { text, options }
    );
    
    // Convert base64 back to blob
    return this.base64ToBlob(response.audio_data, "audio/mp3");
  }
  
  /**
   * Helper to convert blob to base64
   */
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:audio/webm;base64,")
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  
  /**
   * Helper to convert base64 to blob
   */
  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    return new Blob(byteArrays, { type: mimeType });
  }
}

// Export singleton instance for use throughout the app
export const backendService = new BackendService();
