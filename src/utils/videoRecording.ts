
import { toast } from "@/hooks/use-toast";

// Configuration for video recording
// EDIT THIS SECTION TO CHANGE THE STORAGE LOCATION
const VIDEO_STORAGE_CONFIG = {
  // Change this path to your preferred storage location
  // For web apps, this would typically use IndexedDB or localStorage references
  // In a production environment, you might want to use a server endpoint
  storagePath: "interview_recordings",
};

interface RecordingOptions {
  fileName?: string;
  mimeType?: string;
}

export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private isRecording = false;

  /**
   * Start recording from a given media stream
   * @param stream The media stream to record from
   * @param options Recording options
   * @returns Promise that resolves when recording starts
   */
  startRecording(stream: MediaStream, options: RecordingOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.isRecording) {
          reject(new Error("Already recording"));
          return;
        }

        this.stream = stream;
        this.recordedChunks = [];
        
        const mimeType = options.mimeType || 'video/webm;codecs=vp9';
        
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          console.warn(`${mimeType} is not supported, falling back to default`);
        }

        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : 'video/webm'
        });

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };

        this.mediaRecorder.onstart = () => {
          this.isRecording = true;
          resolve();
        };

        this.mediaRecorder.onerror = (event) => {
          console.error("Recording error:", event);
          reject(new Error("Error during recording"));
        };

        this.mediaRecorder.start(1000); // Capture in 1-second chunks
      } catch (error) {
        console.error("Failed to start recording:", error);
        reject(error);
      }
    });
  }

  /**
   * Stop the current recording
   * @returns Promise with the recording blob
   */
  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error("Not recording"));
        return;
      }

      this.mediaRecorder.onstop = () => {
        this.isRecording = false;
        
        if (this.recordedChunks.length === 0) {
          reject(new Error("No data recorded"));
          return;
        }

        const recordedBlob = new Blob(this.recordedChunks, { type: this.recordedChunks[0].type });
        resolve(recordedBlob);
      };

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
    if (this.mediaRecorder) {
      if (this.isRecording) {
        this.mediaRecorder.stop();
      }
      this.mediaRecorder = null;
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    this.isRecording = false;
    this.recordedChunks = [];
  }
}

export const videoRecorder = new VideoRecorder();
