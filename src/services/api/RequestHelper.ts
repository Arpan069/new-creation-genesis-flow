
import { BackendError } from './BackendError'; // Assuming BackendError is in the same directory

// Define a retry configuration interface
interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

export class RequestHelper {
  private baseUrl: string;
  private debug: boolean;
  private retryConfig: RetryConfig = {
    maxAttempts: 3,
    initialDelay: 1000, // 1 second
    maxDelay: 10000, // 10 seconds
    backoffFactor: 2,
  };

  constructor(baseUrl: string, debug: boolean = false) {
    let absoluteBaseUrl = baseUrl;
    // Ensure baseUrl is absolute
    if (typeof window !== 'undefined' && baseUrl.startsWith('/') && !baseUrl.startsWith('//')) {
      absoluteBaseUrl = `${window.location.origin}${baseUrl}`;
    }
    // Remove trailing slash if present
    this.baseUrl = absoluteBaseUrl.endsWith('/') ? absoluteBaseUrl.slice(0, -1) : absoluteBaseUrl;
    this.debug = debug;
  }

  private log(...args: any[]): void {
    if (this.debug) {
      console.log('[RequestHelper]', ...args);
    }
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private async refreshToken(): Promise<string | null> {
    // Placeholder for actual refresh token logic
    // This should call your backend's refresh token endpoint
    this.log('Attempting to refresh token...');
    try {
      // Example: const response = await fetch(`${this.baseUrl}/auth/refresh`, { method: 'POST', body: JSON.stringify({ refresh_token: localStorage.getItem('refresh_token') }), headers: {'Content-Type': 'application/json'} });
      // const data = await response.json();
      // if (response.ok && data.access_token) {
      //   localStorage.setItem('access_token', data.access_token);
      //   return data.access_token;
      // }
      // For now, assume refresh fails or is not implemented client-side directly here
      console.warn('Token refresh logic not fully implemented in RequestHelper.');
      return null;
    } catch (error) {
      this.log('Token refresh failed:', error);
      return null;
    }
  }

  async fetchWithRetry(
    url: string,
    options: RequestInit,
    authenticate: boolean = false,
    isFormData: boolean = false,
    responseType: 'json' | 'blob' = 'json'
  ): Promise<any> {
    let attempt = 1;
    let delay = this.retryConfig.initialDelay;

    // Initialize headers if not present
    options.headers = options.headers || {};

    const attemptRequest = async (isRetry: boolean = false): Promise<any> => {
      if (authenticate) {
        let token = this.getAuthToken();
        if (isRetry && !token) { // If it's a retry for auth error, try refreshing token
          token = await this.refreshToken();
        }
        if (token) {
          (options.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        } else if (authenticate) { // If authentication is required and no token, fail fast for subsequent retries post-refresh attempt.
          throw new BackendError('No authentication token available.', 401, attempt);
        }
      }
      
      if (!isFormData && options.body) {
        (options.headers as Record<string, string>)['Content-Type'] = 'application/json';
      } else if (isFormData) {
        // For FormData, browser sets Content-Type automatically with boundary
        delete (options.headers as Record<string,string>)['Content-Type'];
      }


      this.log(`Attempt ${attempt}/${this.retryConfig.maxAttempts}: ${options.method} ${url}`);
      if (options.body && !isFormData) this.log('Request body:', options.body);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
      options.signal = controller.signal;

      try {
        const response = await fetch(url, options);
        clearTimeout(timeoutId);

        if (response.status === 401 && authenticate && attempt < this.retryConfig.maxAttempts) {
          this.log('Received 401, attempting to refresh token and retry.');
          const newToken = await this.refreshToken();
          if (newToken) {
            attempt++; // Count this as an attempt as we are retrying with a new token
            return attemptRequest(true); // Retry with new token
          } else {
            // If token refresh fails, proceed to throw error
             const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
             throw new BackendError(errorData.error || errorData.message || `Request failed with status ${response.status}`, response.status, attempt);
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
          throw new BackendError(errorData.error || errorData.message || `Request failed with status ${response.status}`, response.status, attempt);
        }
        
        if (responseType === 'blob') {
          return response.blob();
        }
        // Check if response is empty before trying to parse JSON
        const responseText = await response.text();
        if (!responseText) {
          return undefined; 
        }
        return JSON.parse(responseText);

      } catch (error) {
        clearTimeout(timeoutId);
        this.log(`Attempt ${attempt} failed for ${url}:`, error);
        if (error instanceof BackendError && (error.status === 401 || error.status === 403 || error.status === 404)) {
          // Don't retry for these specific auth/not found errors after initial handling
          throw error;
        }
        if (attempt >= this.retryConfig.maxAttempts) {
          if (error instanceof DOMException && error.name === 'AbortError') {
            throw new BackendError(`Request timeout for ${url}`, 408, attempt);
          }
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * this.retryConfig.backoffFactor, this.retryConfig.maxDelay);
        attempt++;
        return attemptRequest(error instanceof BackendError && error.status === 401); // Pass true if it was an auth error to trigger refresh logic
      }
    };
    return attemptRequest();
  }

  private constructFullUrl(endpoint: string): string {
    // Ensure endpoint starts with a slash if it doesn't already,
    // and that there's no double slash between baseUrl and endpoint.
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${normalizedEndpoint}`;
  }

  async get<T>(endpoint: string, params?: Record<string, string | number>, authenticate: boolean = false): Promise<T> {
    let requestUrl = this.constructFullUrl(endpoint);
    if (params) {
      const queryParams = new URLSearchParams(params as Record<string, string>).toString();
      requestUrl = `${requestUrl}?${queryParams}`;
    }
    return this.fetchWithRetry(requestUrl, { method: 'GET' }, authenticate) as Promise<T>;
  }

  async post<T>(endpoint: string, data: any, authenticate: boolean = false, isFormData: boolean = false, responseType: 'json' | 'blob' = 'json'): Promise<T> {
    const requestUrl = this.constructFullUrl(endpoint);
    return this.fetchWithRetry(
      requestUrl,
      {
        method: 'POST',
        body: isFormData ? data : JSON.stringify(data),
      },
      authenticate,
      isFormData,
      responseType
    ) as Promise<T>;
  }

  async put<T>(endpoint: string, data: any, authenticate: boolean = false): Promise<T> {
    const requestUrl = this.constructFullUrl(endpoint);
    return this.fetchWithRetry(requestUrl, { method: 'PUT', body: JSON.stringify(data) }, authenticate) as Promise<T>;
  }

  async delete<T>(endpoint: string, authenticate: boolean = false): Promise<T> {
    const requestUrl = this.constructFullUrl(endpoint);
    return this.fetchWithRetry(requestUrl, { method: 'DELETE' }, authenticate) as Promise<T>;
  }
}

