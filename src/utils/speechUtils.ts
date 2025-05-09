
import { OpenAIService } from "@/services/OpenAIService";

const openAIService = new OpenAIService();

/**
 * Speak text using OpenAI TTS
 * @param text Text to speak
 * @param isSystemAudioOn Whether system audio is enabled
 * @param options Options for speech synthesis
 */
export const speakText = async (
  text: string, 
  isSystemAudioOn: boolean,
  options = { voice: "nova", speed: 1.0 }
): Promise<void> => {
  if (!isSystemAudioOn || !text) return Promise.resolve();
  
  try {
    console.log("Speaking text:", text);
    
    // Generate speech using OpenAI TTS API
    const audioBlob = await openAIService.textToSpeech(text, options);
    
    // Play the audio
    return await openAIService.playAudio(audioBlob);
  } catch (error) {
    console.error("Error speaking text:", error);
    // Silently fail - interviewer will just not speak
    return Promise.resolve();
  }
};

/**
 * Check if browser supports speech recognition
 */
export const checkSpeechRecognitionSupport = (): boolean => {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

/**
 * Uses browser's built-in speech synthesis as a fallback
 * @param text Text to speak
 * @param options Speech options
 */
export const speakWithBrowserSynthesis = (
  text: string,
  options = { rate: 1.0, pitch: 1.0, volume: 1.0 }
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!text || !window.speechSynthesis) {
      resolve();
      return;
    }
    
    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set options
    utterance.rate = options.rate;
    utterance.pitch = options.pitch;
    utterance.volume = options.volume;
    
    // Choose a voice (try to get a female English voice)
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter(voice => 
      voice.lang.startsWith('en-') && voice.name.includes('Female')
    );
    
    if (englishVoices.length > 0) {
      utterance.voice = englishVoices[0];
    }
    
    // Add event handlers
    utterance.onend = () => {
      resolve();
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      reject(new Error('Speech synthesis failed'));
    };
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Get audio input permission and check if microphone is available
 */
export const requestAudioPermission = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Clean up the stream after we've checked permission
    stream.getTracks().forEach(track => track.stop());
    
    return true;
  } catch (error) {
    console.error("Microphone permission denied:", error);
    return false;
  }
};
