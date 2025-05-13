
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
    if (!key || key.trim().length === 0) {
      console.error("Invalid API key provided");
      return false;
    }
    
    this.apiKey = key;
    // Save to localStorage for persistence
    localStorage.setItem("heygen_api_key", key);
    console.log("Heygen API key configured successfully");
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
    const key = this.getApiKey();
    return !!key && key.trim().length > 0;
  }
  
  /**
   * Generate a video with AI avatar speaking the provided text
   */
  async generateVideo(text: string, options: Partial<HeygenVideoOptions> = {}): Promise<string> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      console.error("Heygen API key not configured");
      throw new Error("Heygen API key not configured");
    }
    
    try {
      console.log("Generating video with Heygen API:", text.substring(0, 50) + "...");
      
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
      
      console.log("Sending request to Heygen API...");
      
      // Call the Heygen API to generate video
      const response = await fetch(`${this.baseUrl}/videos.generate`, requestOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Unknown error";
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || response.statusText;
        } catch (e) {
          errorMessage = errorText || response.statusText;
        }
        
        console.error(`Heygen API error (${response.status}):`, errorMessage);
        throw new Error(`Heygen API error: ${errorMessage}`);
      }
      
      const data = await response.json();
      console.log("Heygen API response:", data);
      
      if (!data.data || !data.data.video_url) {
        console.error("Heygen API returned invalid response:", data);
        throw new Error("Invalid response from Heygen API");
      }
      
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
