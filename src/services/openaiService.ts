
/**
 * OpenAI Service for AI-powered interview functionality
 * This service handles communication with OpenAI APIs for:
 * 1. Processing interview transcripts with GPT
 * 2. Converting AI responses to speech using OpenAI TTS
 */

// ADD YOUR API KEY HERE
const OPENAI_API_KEY = "your-api-key-here"; // REPLACE THIS WITH YOUR ACTUAL API KEY

/**
 * Options for transcript processing with OpenAI
 */
interface ProcessTranscriptOptions {
  model?: string;      // GPT model to use
  temperature?: number; // Creativity level (0-1)
  systemPrompt?: string; // System instructions for the AI
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
 * Service to handle OpenAI API integrations
 */
export class OpenAIService {
  private apiKey: string;
  private baseUrlChat = "https://api.openai.com/v1/chat/completions";
  private baseUrlTTS = "https://api.openai.com/v1/audio/speech";

  /**
   * Constructor for OpenAIService
   * @param apiKey - OpenAI API key for authentication
   */
  constructor(apiKey: string = OPENAI_API_KEY) {
    this.apiKey = apiKey;
  }

  /**
   * Process a transcript to generate an AI interviewer response
   * @param transcript - The candidate's transcript text
   * @param currentQuestion - The current interview question
   * @param options - Configuration options for the API request
   * @returns Promise with the AI's response text
   */
  async processTranscript(
    transcript: string, 
    currentQuestion: string, 
    options: ProcessTranscriptOptions = {}
  ): Promise<string> {
    try {
      // Default system prompt for interview context
      const systemPrompt = options.systemPrompt || 
        `You are an AI interviewer conducting a job interview. 
        Your goal is to ask thoughtful follow-up questions and provide natural, conversational responses.
        Keep your responses brief and focused. Don't mention that you're an AI.
        You're currently asking: "${currentQuestion}"`;
      
      // Send request to OpenAI Chat API
      const response = await fetch(this.baseUrlChat, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: options.model || "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: transcript }
          ],
          temperature: options.temperature !== undefined ? options.temperature : 0.7,
          max_tokens: 250  // Keep responses concise
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'OpenAI API request failed');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error processing transcript with OpenAI:", error);
      throw error;
    }
  }

  /**
   * Convert text to speech using OpenAI's text-to-speech API
   * @param text - Text to convert to speech
   * @param options - Configuration options for the API request
   * @returns Promise with audio blob
   */
  async textToSpeech(text: string, options: TextToSpeechOptions = {}): Promise<Blob> {
    try {
      // Send request to OpenAI TTS API
      const response = await fetch(this.baseUrlTTS, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "tts-1",
          input: text,
          voice: options.voice || "nova", // Default to nova voice
          speed: options.speed || 1.0,
          response_format: options.format || "mp3"
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI TTS API request failed: ${errorText}`);
      }

      // Return the audio blob
      return await response.blob();
    } catch (error) {
      console.error("Error converting text to speech with OpenAI:", error);
      throw error;
    }
  }

  /**
   * Play audio from a blob using the browser's audio capabilities
   * @param audioBlob - The audio blob to play
   * @returns Promise that resolves when audio playback starts
   */
  async playAudio(audioBlob: Blob): Promise<void> {
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
}

// Export a default instance
export const openaiService = new OpenAIService();
