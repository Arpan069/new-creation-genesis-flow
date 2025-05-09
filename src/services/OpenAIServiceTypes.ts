
/**
 * Type definitions for OpenAI service interfaces
 */

/**
 * Options for transcription requests
 */
export interface TranscriptionOptions {
  language?: string;     // Specify a language (optional, Whisper can auto-detect)
  prompt?: string;       // Optional prompt to guide the transcription
  temperature?: number;  // Controls randomness (0-1)
  responseFormat?: string; // Format of the response (json, text, srt, etc.)
}

/**
 * Options for AI conversation generation
 */
export interface ConversationOptions {
  model?: string;       // GPT model to use
  temperature?: number; // Creativity level (0-1)
  systemPrompt?: string; // System instructions for the AI
  maxTokens?: number;   // Maximum tokens in the response
}

/**
 * Options for text-to-speech conversion
 */
export interface TextToSpeechOptions {
  voice?: string;      // Voice to use (alloy, echo, fable, onyx, nova, shimmer)
  speed?: number;      // Speed of speech (0.25-4.0)
  format?: string;     // Audio format (mp3, opus, aac, flac)
}

/**
 * Results from a transcription request
 */
export interface TranscriptionResult {
  text: string;          // The transcribed text
  language?: string;     // Language detected in the audio (if applicable)
  segments?: Array<{     // Individual segments of the transcription with timestamps
    id: number;
    text: string;
    start: number;
    end: number;
  }>;
}
