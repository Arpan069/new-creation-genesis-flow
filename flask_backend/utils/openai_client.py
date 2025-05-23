
import os
import openai
import json
from dotenv import load_dotenv

load_dotenv()

# Initialize the API key at the module level
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY
else:
    print("Warning: OPENAI_API_KEY not found in environment variables. OpenAI API calls will fail.")
    openai.api_key = None # Explicitly set to None if not found

def is_api_key_configured() -> bool:
    """Checks if the OpenAI API key is configured."""
    return bool(openai.api_key)

def get_openai_client():
    """
    Returns an initialized OpenAI client if the API key is configured.
    Returns None otherwise.
    """
    if not is_api_key_configured():
        print("Error: OpenAI API key not configured. Cannot create client.")
        return None
    return openai.OpenAI()

def set_api_key(api_key_value: str):
    """
    Sets the OpenAI API key and returns an initialized OpenAI client.
    Raises ValueError if the API key is empty.
    """
    if not api_key_value:
        # This case should ideally be caught by the route before calling this.
        # However, adding a check here for robustness.
        print("Error: Attempted to set an empty API key.")
        # The route expects a client to be returned to make a test call,
        # so returning None or raising an exception needs to be handled by the caller.
        # For now, let's update the key and let the OpenAI client instantiation fail
        # or the subsequent test call fail, which is more aligned with current error handling.
        # Alternatively, we could raise an immediate error.
        # For consistency with `get_openai_client` which can return None,
        # let's consider what the caller in `auth.py` expects.
        # The caller `client = set_api_key(...)` then `client.chat.completions.create`.
        # So, it must return a client object.
        raise ValueError("API key cannot be empty.")

    openai.api_key = api_key_value
    # Optionally, update the global OPENAI_API_KEY if it's meant to be dynamically changed
    # For now, just setting openai.api_key is the direct way the library uses it.
    # global OPENAI_API_KEY
    # OPENAI_API_KEY = api_key_value
    
    # The route expects this function to return a client instance
    # so it can immediately test it.
    return openai.OpenAI()

def analyze_transcript_with_openai(transcript_text: str):
    """
    Analyzes an interview transcript using OpenAI GPT model.
    Returns a dictionary with scores and justifications.
    """
    client = get_openai_client()
    if not client:
        # If client is None, it means API key is not configured.
        # Return an error structure or raise an exception.
        # For consistency with existing error handling in the function,
        # let's craft an error response.
        return {
            "language_score": { "score": 0, "justification": "OpenAI API key not configured." },
            "personality_score": { "score": 0, "justification": "OpenAI API key not configured." },
            "accuracy_score": { "score": 0, "justification": "OpenAI API key not configured." },
            "overall_summary": "Could not analyze transcript because OpenAI API key is not configured."
        }

    prompt = f"""
You are an expert interview evaluator. Analyze the following interview transcript.
The candidate was asked a series of questions by an AI Interviewer.
Based *only* on the candidate's responses ("You: ...") in the transcript:
1.  **Language Score (out of 10)**: Evaluate clarity, grammar, vocabulary, and fluency.
2.  **Personality Score (out of 10)**: Evaluate confidence, articulation, enthusiasm, and professionalism.
3.  **Accuracy Score (out of 10)**: Evaluate the substance, relevance, and correctness of the answers to the questions asked. If questions are behavioral, assess the quality of examples and STAR method usage if apparent. If technical, assess technical correctness.

Provide a brief justification (1-2 sentences) for each score.

Return the output *only* as a single valid JSON object with the following structure:
{{
  "language_score": {{ "score": <number>, "justification": "<text>" }},
  "personality_score": {{ "score": <number>, "justification": "<text>" }},
  "accuracy_score": {{ "score": <number>, "justification": "<text>" }},
  "overall_summary": "<A brief 2-3 sentence summary of the candidate's performance based on these aspects.>"
}}

Transcript:
---
{transcript_text}
---
Ensure the output is a single valid JSON object and nothing else.
"""
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini", # Using a cost-effective and capable model
            messages=[
                {"role": "system", "content": "You are an expert interview evaluator outputting JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            response_format={"type": "json_object"} # Request JSON output
        )
        
        analysis_result_str = response.choices[0].message.content
        if analysis_result_str is None:
            raise ValueError("OpenAI returned an empty response.")
            
        analysis_result = json.loads(analysis_result_str)
        return analysis_result
        
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from OpenAI: {e}")
        print(f"Received content: {analysis_result_str}")
        # Fallback or re-attempt logic could be added here
        return { # Return default/error structure
            "language_score": { "score": 0, "justification": "Error in analysis." },
            "personality_score": { "score": 0, "justification": "Error in analysis." },
            "accuracy_score": { "score": 0, "justification": "Error in analysis." },
            "overall_summary": "Could not analyze transcript due to an error."
        }
    except Exception as e:
        print(f"Error analyzing transcript with OpenAI: {e}")
        # Consider re-raising or returning a specific error structure
        # If the client itself was None (e.g. API key issue not caught by get_openai_client initial check)
        # this generic exception might catch it.
        return {
            "language_score": { "score": 0, "justification": f"OpenAI API Error: {str(e)}" },
            "personality_score": { "score": 0, "justification": f"OpenAI API Error: {str(e)}" },
            "accuracy_score": { "score": 0, "justification": f"OpenAI API Error: {str(e)}" },
            "overall_summary": f"Could not analyze transcript due to an OpenAI API error: {str(e)}"
        }

# Placeholder for other OpenAI client functions if they exist in this file
# ... keep existing code (if any other functions are in this file)

