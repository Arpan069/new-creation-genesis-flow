
import { RequestHelper } from './RequestHelper';
import { BackendError } from './BackendError';
import type { TranscriptionOptions, TranscriptionResult, TextToSpeechOptions, ConversationOptions } from '../OpenAIServiceTypes';
import type { UserCredentials, UserProfile, OTPVerificationResult } from '@/types/auth'; // Now this should be found
import type { InterviewDetail } from '@/types/interview';

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
    this.requestHelper = new RequestHelper(API_BASE_URL, import.meta.env.DEV); // Pass base URL and debug flag
  }

  /**
   * Check if the backend is available and if API keys are configured
   */
  async healthCheck(): Promise<{ status: string; api_key_configured?: boolean }> {
    try {
      // Use the get method from requestHelper
      const response = await this.requestHelper.get<{ status: string; api_key_configured?: boolean }>('/health');
      return response;
    } catch (error) {
      console.error("Health check failed:", error);
      if (error instanceof BackendError && error.status === 404) {
        return { status: "error", api_key_configured: false };
      }
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
    const response = await this.requestHelper.post<{ access_token: string; refresh_token: string; user: UserProfile }>('/auth/login', credentials);
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token);
    }
    if (response.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    return response;
  }
  
  public async verifyOTP(email: string, otp: string): Promise<OTPVerificationResult> {
    return this.requestHelper.post<OTPVerificationResult>('/auth/verify-otp', { email, otp });
  }

  public async getUserProfile(): Promise<UserProfile> {
    return this.requestHelper.get<UserProfile>('/auth/profile', {}, true); 
  }

  public async updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    return this.requestHelper.put<UserProfile>('/auth/profile', profileData, true);
  }

  /**
   * Transcribe audio content
   */
  async transcribe(audioBlob: Blob, options: TranscriptionOptions = {}): Promise<TranscriptionResult> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm'); // Ensure filename is appropriate
    formData.append('prompt', options.prompt || '');
    formData.append('language', options.language || 'en');
    
    return this.requestHelper.post<TranscriptionResult>('/transcribe', formData, true, true); 
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
    // Corrected: responseType should be 'blob'
    return this.requestHelper.post<Blob>('/text-to-speech', payload, true, false, 'blob'); 
  }

  /**
   * Save completed interview details (video URL, transcript, trigger analysis)
   */
  async saveCompletedInterview(payload: CompleteInterviewPayload): Promise<InterviewDetail> {
    return this.requestHelper.post<InterviewDetail>('/interviews/complete', payload, true);
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

  public async logout(): Promise<void> {
    // Inform the backend if necessary (e.g., to invalidate tokens)
    // For now, just clear local storage
    try {
        await this.requestHelper.post<void>('/auth/logout', {}, true);
    } catch (error) {
        console.warn("Failed to notify backend of logout, or no logout endpoint configured:", error);
    } finally {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Optionally, redirect or update UI state
    }
  }
}

export const backendService = new BackendService();
