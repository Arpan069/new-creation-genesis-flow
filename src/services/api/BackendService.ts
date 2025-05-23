import { RequestHelper } from './RequestHelper';
import { BackendError } from './BackendError';
import type { TranscriptionOptions, TranscriptionResult, TextToSpeechOptions, ConversationOptions } from '../OpenAIServiceTypes'; // Assuming these types are correctly defined
import type { UserCredentials, UserProfile, OTPVerificationResult } from '@/types/auth'; // Assuming User types
import type { InterviewDetail, TranscriptItem } from '@/types/interview'; // For return type, if needed

// Base URL for the backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface CompleteInterviewPayload {
  video_url: string;
  transcript_text: string;
  title?: string;
}

export class BackendService {
  private requestHelper: RequestHelper;

  constructor() {
    this.requestHelper = new RequestHelper(API_BASE_URL);
  }

  /**
   * Check if the backend is available and if API keys are configured
   */
  async healthCheck(): Promise<{ status: string; api_key_configured?: boolean }> {
    try {
      const response = await this.requestHelper.get<{ status: string; api_key_configured?: boolean }>('/health');
      return response;
    } catch (error) {
      console.error("Health check failed:", error);
      if (error instanceof BackendError && error.status === 404) {
        // Treat 404 as backend not available
        return { status: "error", api_key_configured: false };
      }
      // For other errors, rethrow or handle as "error"
      return { status: "error", api_key_configured: false };
    }
  }
  
  async isBackendAvailable(): Promise<boolean> {
    try {
      const health = await this.healthCheck();
      return health.status === "ok";
    } catch {
      return false;
    }
  }

  public async register(credentials: UserCredentials): Promise<UserProfile> {
    return this.requestHelper.post<UserProfile>('/auth/register', credentials);
  }

  public async login(credentials: UserCredentials): Promise<{ access_token: string; refresh_token: string; user: UserProfile }> {
    return this.requestHelper.post<{ access_token: string; refresh_token: string; user: UserProfile }>('/auth/login', credentials);
  }
  
  public async verifyOTP(email: string, otp: string): Promise<OTPVerificationResult> {
    return this.requestHelper.post<OTPVerificationResult>('/auth/verify-otp', { email, otp });
  }

  public async getUserProfile(): Promise<UserProfile> {
    return this.requestHelper.get<UserProfile>('/auth/profile', {}, true); // Assuming requires auth
  }

  public async updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    return this.requestHelper.put<UserProfile>('/auth/profile', profileData, true); // Assuming requires auth
  }


  /**
   * Transcribe audio content
   */
  async transcribe(audioBlob: Blob, options: TranscriptionOptions = {}): Promise<TranscriptionResult> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('prompt', options.prompt || '');
    formData.append('language', options.language || 'en');
    // Add other options as needed
    
    return this.requestHelper.post<TranscriptionResult>('/transcribe', formData, true, true); // True for auth, true for FormData
  }

  /**
   * Generate AI response
   */
  async generateResponse(transcript: string, currentQuestion: string, options: ConversationOptions = {}): Promise<string> {
     const payload = { 
      transcript, 
      current_question: currentQuestion, 
      ...options 
    };
    const response = await this.requestHelper.post<{ response: string }>('/generate-response', payload, true);
    return response.response;
  }

  /**
   * Convert text to speech
   */
  async textToSpeech(text: string, options: TextToSpeechOptions = {}): Promise<Blob> {
    const payload = { text, ...options };
    return this.requestHelper.post<Blob>('/text-to-speech', payload, true, false, 'blob'); // True for auth, false for FormData, 'blob' for responseType
  }

  /**
   * Save completed interview details (video URL, transcript, trigger analysis)
   */
  async saveCompletedInterview(payload: CompleteInterviewPayload): Promise<InterviewDetail> { // Assuming InterviewDetail is the expected return type
    return this.requestHelper.post<InterviewDetail>('/interviews/complete', payload, true); // Requires auth
  }
  
   /**
   * Update Heygen API key
   */
  async updateHeygenApiKey(apiKey: string): Promise<{ message: string }> {
    try {
      return await this.requestHelper.post<{ message: string }>('/config/heygen-api-key', { api_key: apiKey }, true);
    } catch (error) {
      console.error("Failed to update Heygen API key:", error);
      throw error;
    }
  }
}

export const backendService = new BackendService();
