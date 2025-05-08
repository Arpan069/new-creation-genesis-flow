
import { OpenAIService } from "@/services/OpenAIService";

const openAIService = new OpenAIService();

/**
 * Speak text using OpenAI TTS
 * @param text Text to speak
 * @param options Options for speech synthesis
 */
export const speakText = async (
  text: string, 
  isSystemAudioOn: boolean,
  options = { voice: "nova", speed: 1.0 }
): Promise<void> => {
  if (!isSystemAudioOn) return;
  
  try {
    // Generate speech using OpenAI TTS API
    const audioBlob = await openAIService.textToSpeech(text, options);
    
    // Play the audio
    await openAIService.playAudio(audioBlob);
  } catch (error) {
    console.error("Error speaking text:", error);
    // Silently fail - interviewer will just not speak
  }
};
