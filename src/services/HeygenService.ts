
/**
 * Heygen API Service
 * This service handles interactions with the Heygen API for creating AI avatar videos
 */

type HeygenVideoOptions = {
  voice_id?: string;
  input_text: string;
  avatar_id?: string;
  voice_type?: string;
  quality?: "low" | "medium" | "high";
  speaking_speed?: number;
};

export class HeygenService {
  private apiKey: string | null = null;
  private baseUrl = "https://api.heygen.com/v1";
  
  /**
   * Set the API key for Heygen
   */
  setApiKey(key: string) {
    this.apiKey = key;
    // Save to localStorage for persistence
    localStorage.setItem("heygen_api_key", key);
    return true;
  }
  
  /**
   * Get the stored API key
   */
  getApiKey(): string | null {
    // Try to get from instance, then from localStorage
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem("heygen_api_key");
    }
    return this.apiKey;
  }
  
  /**
   * Check if API key is configured
   */
  isApiKeyConfigured(): boolean {
    return !!this.getApiKey();
  }
  
  /**
   * Generate a video with AI avatar speaking the provided text
   */
  async generateVideo(text: string, options: Partial<HeygenVideoOptions> = {}): Promise<string> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      throw new Error("Heygen API key not configured");
    }
    
    try {
      // Use a default avatar if not specified
      const defaultOptions: HeygenVideoOptions = {
        input_text: text,
        voice_id: options.voice_id || "male-en-US-1",  
        avatar_id: options.avatar_id || "Daisy-inshirt-2", // Default avatar
        voice_type: options.voice_type || "text",
        quality: options.quality || "medium",
        speaking_speed: options.speaking_speed || 1.0
      };
      
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey
        },
        body: JSON.stringify({
          video_inputs: [
            {
              character: {
                avatar_id: defaultOptions.avatar_id
              },
              audio: {
                voice_id: defaultOptions.voice_id,
                voice_type: defaultOptions.voice_type,
                input_text: defaultOptions.input_text,
                speaking_speed: defaultOptions.speaking_speed
              },
              background: {
                type: "transparent"
              }
            }
          ],
          video_parameters: {
            quality: defaultOptions.quality
          }
        })
      };
      
      // Call the Heygen API to generate video
      const response = await fetch(`${this.baseUrl}/videos.generate`, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Heygen API error: ${errorData.message || response.statusText}`);
      }
      
      const data = await response.json();
      
      // Return the video URL
      return data.data.video_url;
    } catch (error) {
      console.error("Error generating Heygen video:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export const heygenService = new HeygenService();
