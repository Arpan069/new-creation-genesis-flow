
import { BackendError } from './BackendError';
import { BACKEND_CONFIG } from '@/config/backendConfig';

export class RequestHelper {
  private baseUrl: string;
  private debug: boolean;
  private maxAttempts: number;
  private initialDelay: number;
  private maxDelay: number;
  private backoffFactor: number;

  constructor(baseUrl: string, debug: boolean = false) {
    this.baseUrl = baseUrl;
    this.debug = debug;
    this.maxAttempts = BACKEND_CONFIG.retry?.maxAttempts || 3;
    this.initialDelay = BACKEND_CONFIG.retry?.initialDelay || 1000;
    this.maxDelay = BACKEND_CONFIG.retry?.maxDelay || 5000;
    this.backoffFactor = BACKEND_CONFIG.retry?.backoffFactor || 2;
  }

  private log(...args: any[]): void {
    if (this.debug) {
      console.log('[RequestHelper]', ...args);
    }
  }

  /**
   * Fetch with exponential backoff retry
   */
  async fetchWithRetry(
    url: string,
    options: RequestInit,
    attempt: number = 1
  ): Promise<Response> {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok && response.status >= 500 && attempt < this.maxAttempts) {
        const delay = Math.min(
          this.initialDelay * Math.pow(this.backoffFactor, attempt - 1),
          this.maxDelay
        );
        
        if (this.debug) {
          console.info(`[RequestHelper] Request to ${url} failed with status ${response.status}. Retrying in ${delay}ms. Attempt ${attempt}/${this.maxAttempts}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchWithRetry(url, options, attempt + 1);
      }
      
      return response;
    } catch (error) {
      if (this.debug) {
        console.info(`[RequestHelper] Attempt ${attempt} failed for ${options.method || 'GET'} ${url}:`, error);
      }
      
      if (attempt < this.maxAttempts) {
        const delay = Math.min(
          this.initialDelay * Math.pow(this.backoffFactor, attempt - 1),
          this.maxDelay
        );
        
        if (this.debug) {
          console.info(`[RequestHelper] Retrying in ${delay}ms. Attempt ${attempt + 1}/${this.maxAttempts}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchWithRetry(url, options, attempt + 1);
      }
      
      throw new BackendError(
        `Failed after ${attempt} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined, // status code not directly available here from a network error
        attempt
      );
    }
  }

  private async _handleResponse<T>(response: Response, responseType: 'json' | 'blob' | 'text' = 'json'): Promise<T> {
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      throw new BackendError(errorData.msg || errorData.message || `HTTP error! status: ${response.status}`, response.status);
    }

    if (responseType === 'blob') {
      return response.blob() as Promise<T>;
    }
    if (responseType === 'text') {
      return response.text() as Promise<T>;
    }
    // Default to JSON
    // Handle cases where response might be empty for 204 No Content etc.
    const text = await response.text();
    if (!text) {
        return undefined as T; // Or handle as appropriate for your app, e.g. {} as T for some scenarios
    }
    try {
        return JSON.parse(text) as T;
    } catch (e) {
        console.error("Failed to parse JSON response:", text);
        throw new BackendError("Failed to parse JSON response", response.status);
    }
  }
  
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async get<T>(endpoint: string, params?: Record<string, string>, requiresAuth: boolean = false, responseType: 'json' | 'blob' | 'text' = 'json'): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (requiresAuth) {
      Object.assign(headers, this.getAuthHeaders());
    }

    this.log(`GET ${url.toString()}`);
    const response = await this.fetchWithRetry(url.toString(), { method: 'GET', headers });
    return this._handleResponse<T>(response, responseType);
  }

  async post<T>(endpoint: string, data: any, requiresAuth: boolean = false, isFormData: boolean = false, responseType: 'json' | 'blob' | 'text' = 'json'): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {};

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
     if (requiresAuth) {
      Object.assign(headers, this.getAuthHeaders());
    }

    const body = isFormData ? (data as FormData) : JSON.stringify(data);
    
    this.log(`POST ${url} with data:`, isFormData ? '[FormData]' : data);
    const response = await this.fetchWithRetry(url, { method: 'POST', headers, body });
    return this._handleResponse<T>(response, responseType);
  }

  async put<T>(endpoint: string, data: any, requiresAuth: boolean = false, isFormData: boolean = false, responseType: 'json' | 'blob' | 'text' = 'json'): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {};

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
     if (requiresAuth) {
      Object.assign(headers, this.getAuthHeaders());
    }

    const body = isFormData ? (data as FormData) : JSON.stringify(data);

    this.log(`PUT ${url} with data:`, data);
    const response = await this.fetchWithRetry(url, { method: 'PUT', headers, body });
    return this._handleResponse<T>(response, responseType);
  }

  async delete<T>(endpoint: string, requiresAuth: boolean = false, responseType: 'json' | 'blob' | 'text' = 'json'): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (requiresAuth) {
      Object.assign(headers, this.getAuthHeaders());
    }
    
    this.log(`DELETE ${url}`);
    const response = await this.fetchWithRetry(url, { method: 'DELETE', headers });
    return this._handleResponse<T>(response, responseType);
  }
}
