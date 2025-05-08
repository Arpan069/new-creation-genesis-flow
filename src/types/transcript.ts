
/**
 * Interface for transcript items in the interview
 */
export interface Transcript {
  speaker: string;   // Who is speaking (AI or candidate)
  text: string;      // The content of the speech
  timestamp: Date;   // When the speech occurred
}
