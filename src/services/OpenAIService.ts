
/**
 * Consolidated OpenAI Service
 * 
 * This service combines multiple OpenAI API functionalities:
 * 1. Speech-to-text transcription (Whisper API)
 * 2. Text generation for AI interviewer responses (GPT API)
 * 3. Text-to-speech for AI interviewer voice (TTS API)
 * 
 * All these functions use a single OpenAI API key for authentication.
 */

// ADD YOUR API KEY HERE - IMPORTANT: Replace with your actual API key to make the interview work
const OPENAI_API_KEY = ""; // REPLACE THIS WITH YOUR ACTUAL API KEY

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
 * Mock implementation to use when no API key is provided
 */
class MockOpenAIService {
  async transcribe(): Promise<TranscriptionResult> {
    console.log("Using mock transcription service");
    return { 
      text: "This is a mock transcription. Please add your OpenAI API key in src/services/OpenAIService.ts"
    };
  }

  async transcribeRealTime(): Promise<TranscriptionResult> {
    return this.transcribe();
  }

  async generateResponse(transcript: string): Promise<string> {
    console.log("Using mock AI response service");
    return "I'm a mock AI interviewer. To get real responses, please add your OpenAI API key in src/services/OpenAIService.ts";
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
 * Consolidated service for OpenAI API interactions
 */
export class OpenAIService {
  private apiKey: string;
  private mockService: MockOpenAIService | null = null;
  
  // API endpoints
  private endpoints = {
    transcription: "https://api.openai.com/v1/audio/transcriptions",
    chat: "https://api.openai.com/v1/chat/completions",
    tts: "https://api.openai.com/v1/audio/speech"
  };

  /**
   * Constructor for the OpenAIService
   * @param apiKey - OpenAI API key for authentication
   */
  constructor(apiKey: string = OPENAI_API_KEY) {
    this.apiKey = apiKey;
    
    // Create mock service if no API key is provided
    if (!this.apiKey) {
      console.warn("No OpenAI API key provided. Using mock service.");
      this.mockService = new MockOpenAIService();
    }
  }

  /**
   * Transcribe audio content using Whisper API
   * @param audioBlob - Audio/video blob to transcribe
   * @param options - Configuration options
   * @returns Promise with transcription result
   */
  async transcribe(audioBlob: Blob, options: TranscriptionOptions = {}): Promise<TranscriptionResult> {
    // Use mock service if no API key
    if (this.mockService) return this.mockService.transcribe();
    
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
      
      // Always use a lower temperature for more accurate transcriptions
      formData.append('temperature', options.temperature?.toString() || '0.2');
      
      formData.append('response_format', options.responseFormat || 'json');

      // Send request to OpenAI Whisper API
      const response = await fetch(this.endpoints.transcription, {
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
      return await response.json();
    } catch (error) {
      console.error("Transcription error:", error);
      throw error;
    }
  }

  /**
   * Performs real-time transcription of audio chunks
   * @param audioBlob - Latest audio chunk for transcription
   * @param options - Optional configuration for transcription
   * @returns Promise with transcription result
   */
  async transcribeRealTime(audioBlob: Blob, options: TranscriptionOptions = {}): Promise<TranscriptionResult> {
    // Use mock service if no API key
    if (this.mockService) return this.mockService.transcribeRealTime();
    
    // For real-time transcription, use enhanced prompting and settings
    return this.transcribe(audioBlob, {
      temperature: 0.2, // Lower temperature for more accurate transcription
      prompt: options.prompt || "This is part of an ongoing job interview conversation. The speaker is answering interview questions clearly and professionally.",
      language: "en", // Explicitly set to English for better results
      ...options
    });
  }

  /**
   * Process a transcript to generate an AI interviewer response
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
    // Use mock service if no API key
    if (this.mockService) return this.mockService.generateResponse(transcript);
    
    try {
      // Default system prompt for interview context
      const systemPrompt = options.systemPrompt || 
        `You are an AI interviewer conducting a job interview. 
        Your goal is to ask thoughtful follow-up questions and provide natural, conversational responses.
        Keep your responses brief and focused. Don't mention that you're an AI.
        You're currently asking: "${currentQuestion}"`;
      
      // Send request to OpenAI Chat API with exponential backoff retry
      let retries = 3;
      let delay = 1000;
      
      while (retries > 0) {
        try {
          const response = await fetch(this.endpoints.chat, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: options.model || "gpt-4o-mini", // Using default model
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: transcript }
              ],
              temperature: options.temperature !== undefined ? options.temperature : 0.7,
              max_tokens: options.maxTokens || 250  // Keep responses concise
            })
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'OpenAI API request failed');
          }
    
          const data = await response.json();
          return data.choices[0].message.content;
        } catch (error) {
          retries--;
          if (retries === 0) throw error;
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        }
      }
      
      throw new Error("Failed after multiple retry attempts");
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw error;
    }
  }

  /**
   * Convert text to speech using OpenAI's text-to-speech API
   * @param text - Text to convert to speech
   * @param options - Configuration options
   * @returns Promise with audio blob
   */
  async textToSpeech(text: string, options: TextToSpeechOptions = {}): Promise<Blob> {
    // Use mock service if no API key
    if (this.mockService) return this.mockService.textToSpeech();
    
    try {
      // Send request to OpenAI TTS API
      const response = await fetch(this.endpoints.tts, {
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
    // Use mock service if no API key
    if (this.mockService) return this.mockService.playAudio();
    
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
