
"""
Flask backend for AI Interview Application
Handles OpenAI API calls securely
"""

import os
import base64
import io
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS - replace with your React app's URL in production
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Configure OpenAI
openai.api_key = os.environ.get("OPENAI_API_KEY")
if not openai.api_key:
    print("WARNING: OPENAI_API_KEY environment variable not set")

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "Backend is running"})

@app.route("/api/transcribe", methods=["POST"])
def transcribe_audio():
    """Transcribe audio using OpenAI Whisper API"""
    data = request.json
    
    if not data or "audio_data" not in data:
        return jsonify({"error": "Missing audio data"}), 400
    
    try:
        # Decode base64 audio data
        audio_bytes = base64.b64decode(data["audio_data"])
        
        # Prepare file for OpenAI API
        audio_file = io.BytesIO(audio_bytes)
        audio_file.name = "audio.webm"  # Name required by OpenAI
        
        # Get transcription options
        options = data.get("options", {})
        
        # Call OpenAI Whisper API
        response = openai.Audio.transcribe(
            file=audio_file,
            model="whisper-1",
            language=options.get("language"),
            prompt=options.get("prompt"),
            temperature=options.get("temperature", 0.2)
        )
        
        return jsonify({"text": response.text})
    
    except Exception as e:
        print(f"Transcription error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/generate-response", methods=["POST"])
def generate_response():
    """Generate AI response using OpenAI GPT"""
    data = request.json
    
    if not data or "transcript" not in data:
        return jsonify({"error": "Missing transcript"}), 400
    
    try:
        transcript = data["transcript"]
        current_question = data.get("currentQuestion", "")
        options = data.get("options", {})
        
        # Create system prompt
        system_prompt = options.get("systemPrompt") or f"""
        You are an AI interviewer conducting a job interview. 
        Your name is AI Interviewer. You are currently asking: "{current_question}"
        Respond naturally to the candidate's answer. Keep your response brief (2-3 sentences maximum).
        Be conversational but professional. Ask thoughtful follow-up questions when appropriate.
        You must respond in complete sentences, even if the candidate's answer is unclear.
        If the candidate's answer shows they are done with this topic, end with "Let's move on to the next question."
        If the candidate's answer is unclear, ask them to clarify.
        IMPORTANT: Don't repeat yourself. Never say "Thank you for sharing" or similar phrases repeatedly.
        """
        
        # Call OpenAI Chat Completions API
        response = openai.ChatCompletion.create(
            model=options.get("model", "gpt-4o-mini"),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": transcript}
            ],
            temperature=options.get("temperature", 0.7),
            max_tokens=options.get("maxTokens", 250)
        )
        
        return jsonify({"response": response.choices[0].message.content})
    
    except Exception as e:
        print(f"AI response generation error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/text-to-speech", methods=["POST"])
def text_to_speech():
    """Convert text to speech using OpenAI TTS API"""
    data = request.json
    
    if not data or "text" not in data:
        return jsonify({"error": "Missing text"}), 400
    
    try:
        text = data["text"]
        options = data.get("options", {})
        
        # Call OpenAI TTS API
        response = openai.Audio.create(
            model="tts-1",
            voice=options.get("voice", "nova"),
            input=text,
            speed=options.get("speed", 1.0),
            response_format=options.get("format", "mp3")
        )
        
        # Convert audio to base64
        audio_base64 = base64.b64encode(response.content).decode("utf-8")
        
        return jsonify({"audio_data": audio_base64})
    
    except Exception as e:
        print(f"TTS error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
