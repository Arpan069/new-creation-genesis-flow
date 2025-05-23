
import os
import openai
import json
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.environ.get("OPENAI_API_KEY")

def analyze_transcript_with_openai(transcript_text: str):
    """
    Analyzes an interview transcript using OpenAI GPT model.
    Returns a dictionary with scores and justifications.
    """
    if not openai.api_key:
        raise ValueError("OPENAI_API_KEY not found in environment variables.")

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
        client = openai.OpenAI() # Initialize client
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
        raise e # Or return a default error object as above

# Placeholder for other OpenAI client functions if they exist in this file
# ... keep existing code (if any other functions are in this file)

