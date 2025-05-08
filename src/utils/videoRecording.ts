import { toast } from "@/hooks/use-toast";
import { OpenAIService } from "@/services/OpenAIService";

// Configuration for video recording
// EDIT THIS SECTION TO CHANGE THE STORAGE LOCATION
const VIDEO_STORAGE_CONFIG = {
  // Change this path to your preferred storage location
  // For web apps, this would typically use IndexedDB or localStorage references
  // In a production environment, you might want to use a server endpoint
  storagePath: "interview_recordings", // <-- EDIT THIS PATH to change the storage location
};

// Create a singleton instance of OpenAIService
const openAIService = new OpenAIService();

interface RecordingOptions {
  fileName?: string;
  mimeType?: string;
  // Configuration for real-time transcription
  enableRealTimeTranscription?: boolean;
  transcriptionCallback?: (text: string) => void;
}

export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private isRecording = false;
  private transcriptionInterval: ReturnType<typeof setInterval> | null = null;
  private audioChunksForTranscription: Blob[] = [];
  
  /**
   * Start recording from a given media stream
   * @param stream The media stream to record from
   * @param options Recording options including transcription settings
   * @returns Promise that resolves when recording starts
   */
  startRecording(stream: MediaStream, options: RecordingOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Check if already recording
        if (this.isRecording) {
          reject(new Error("Already recording"));
          return;
        }

        this.stream = stream;
        this.recordedChunks = [];
        this.audioChunksForTranscription = [];
        
        // Determine the best supported mime type
        const mimeType = options.mimeType || 'video/webm;codecs=vp9';
        
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          console.warn(`${mimeType} is not supported, falling back to default`);
        }

        // Initialize the media recorder with audio emphasis
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : 'video/webm',
          audioBitsPerSecond: 128000, // Prioritize audio quality
        });

        // Collect data chunks as they become available
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
            
            // If real-time transcription is enabled, collect audio for transcription
            if (options.enableRealTimeTranscription) {
              this.audioChunksForTranscription.push(event.data);
            }
          }
        };

        // Handle recording start event
        this.mediaRecorder.onstart = () => {
          this.isRecording = true;
          console.log("Recording started successfully");
          
          // Set up real-time transcription if enabled
          if (options.enableRealTimeTranscription && options.transcriptionCallback) {
            this.setupRealTimeTranscription(options.transcriptionCallback);
          }
          
          resolve();
        };

        // Handle recording errors
        this.mediaRecorder.onerror = (event) => {
          console.error("Recording error:", event);
          reject(new Error("Error during recording"));
        };

        // Start recording in small chunks for more frequent processing
        this.mediaRecorder.start(500); // Capture in half-second chunks for more responsive transcription
      } catch (error) {
        console.error("Failed to start recording:", error);
        reject(error);
      }
    });
  }

  /**
   * Set up real-time transcription at regular intervals
   * @param callback Function to call with transcription text
   */
  private setupRealTimeTranscription(callback: (text: string) => void): void {
    // Clear any existing transcription interval
    if (this.transcriptionInterval) {
      clearInterval(this.transcriptionInterval);
    }
    
    // Set up new interval for transcription (every 3 seconds - more frequent)
    this.transcriptionInterval = setInterval(async () => {
      if (this.audioChunksForTranscription.length > 0) {
        try {
          // Create a blob from the collected audio chunks
          const audioBlob = new Blob(this.audioChunksForTranscription, { type: 'audio/webm' });
          
          // Keep some recent audio for context (don't clear completely)
          // This helps maintain context between processing intervals
          const maxChunks = 4; // Keep last 4 chunks for context
          if (this.audioChunksForTranscription.length > maxChunks) {
            this.audioChunksForTranscription = this.audioChunksForTranscription.slice(-maxChunks);
          }
          
          console.log(`Processing audio chunk: ${audioBlob.size} bytes`);
          
          // Send to OpenAI API for transcription
          const result = await openAIService.transcribeRealTime(audioBlob, {
            prompt: "This is part of a job interview conversation. The speaker is answering interview questions."
          });
          
          // Call the callback with the transcribed text
          if (result.text && result.text.trim()) {
            console.log("Transcription result:", result.text);
            callback(result.text);
          } else {
            console.log("Empty transcription received");
          }
        } catch (error) {
          console.error("Real-time transcription error:", error);
          // Don't add toast here to avoid spamming the UI
        }
      } else {
        console.log("No audio chunks for transcription");
      }
    }, 3000); // Process every 3 seconds
  }

  /**
   * Stop the current recording
   * @returns Promise with the recording blob
   */
  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      // Check if recording is active
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error("Not recording"));
        return;
      }

      // Clear transcription interval if it exists
      if (this.transcriptionInterval) {
        clearInterval(this.transcriptionInterval);
        this.transcriptionInterval = null;
      }

      // Handle recording stop event
      this.mediaRecorder.onstop = () => {
        this.isRecording = false;
        
        // Check if we have recorded data
        if (this.recordedChunks.length === 0) {
          reject(new Error("No data recorded"));
          return;
        }

        // Create blob from recorded chunks
        const recordedBlob = new Blob(this.recordedChunks, { type: this.recordedChunks[0].type });
        resolve(recordedBlob);
      };

      // Stop the recording
      this.mediaRecorder.stop();
    });
  }

  /**
   * Save the recording to the configured storage location
   * @param blob The recorded video blob
   * @param fileName The name to save the file as (default: generates timestamp-based name)
   * @returns The URL to the saved recording
   */
  async saveRecording(blob: Blob, fileName?: string): Promise<string> {
    try {
      // Generate a filename if not provided
      const name = fileName || `interview-${new Date().toISOString().replace(/[:.]/g, "-")}`;
      const fullPath = `${VIDEO_STORAGE_CONFIG.storagePath}/${name}.webm`;
      
      // For web browsers, we can use IndexedDB or save to a downloadable file
      // This is a simple implementation that creates a downloadable file
      const url = URL.createObjectURL(blob);
      
      // Create a download link and trigger it
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fullPath;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Recording saved",
        description: `Interview recording saved to ${fullPath}`,
      });
      
      return url;
    } catch (error) {
      console.error("Failed to save recording:", error);
      toast({
        title: "Save failed",
        description: "Failed to save interview recording",
        variant: "destructive",
      });
      throw error;
    }
  }

  /**
   * Checks if recording is currently in progress
   */
  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    // Stop media recorder if active
    if (this.mediaRecorder) {
      if (this.isRecording) {
        this.mediaRecorder.stop();
      }
      this.mediaRecorder = null;
    }
    
    // Stop and clean up media stream
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    // Clear transcription interval
    if (this.transcriptionInterval) {
      clearInterval(this.transcriptionInterval);
      this.transcriptionInterval = null;
    }
    
    // Reset recording state
    this.isRecording = false;
    this.recordedChunks = [];
    this.audioChunksForTranscription = [];
  }
}

// Export a singleton instance for use throughout the app
export const videoRecorder = new VideoRecorder();
