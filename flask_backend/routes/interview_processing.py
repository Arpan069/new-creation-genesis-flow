
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Interview, User
from utils.openai_client import analyze_transcript_with_openai
from datetime import datetime

interview_processing_routes = Blueprint('interview_processing_routes', __name__, url_prefix='/api/interviews')

@interview_processing_routes.route('/complete', methods=['POST'])
@jwt_required()
def complete_interview():
    current_user_id = get_jwt_identity()
    data = request.json

    if not data:
        return jsonify({"msg": "Missing JSON in request"}), 400

    video_url = data.get('video_url')
    transcript_text = data.get('transcript_text')
    title = data.get('title', f"AI Practice Interview - {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}")

    if not video_url or not transcript_text:
        return jsonify({"msg": "Missing video_url or transcript_text"}), 400

    try:
        # Ensure the user is a candidate
        user = User.query.get(current_user_id)
        if not user or user.user_type != 'candidate':
             # If using polymorphic ID, candidate_id is user_id for candidates
            return jsonify({"msg": "User is not a candidate or not found"}), 403

        candidate_id = user.id

        # Analyze transcript with OpenAI
        analysis = analyze_transcript_with_openai(transcript_text)

        # Calculate average score
        total_score = 0
        num_scores = 0
        if analysis.get('language_score', {}).get('score') is not None:
            total_score += analysis['language_score']['score']
            num_scores += 1
        if analysis.get('personality_score', {}).get('score') is not None:
            total_score += analysis['personality_score']['score']
            num_scores += 1
        if analysis.get('accuracy_score', {}).get('score') is not None:
            total_score += analysis['accuracy_score']['score']
            num_scores += 1
        
        average_score = total_score / num_scores if num_scores > 0 else None


        new_interview = Interview(
            title=title,
            candidate_id=candidate_id, # Automatically link to the logged-in candidate
            recording_url=video_url,
            transcript_text=transcript_text,
            status='completed',
            completed_at=datetime.utcnow(),
            
            language_score=analysis.get('language_score', {}).get('score'),
            language_justification=analysis.get('language_score', {}).get('justification'),
            personality_score=analysis.get('personality_score', {}).get('score'),
            personality_justification=analysis.get('personality_score', {}).get('justification'),
            accuracy_score=analysis.get('accuracy_score', {}).get('score'),
            accuracy_justification=analysis.get('accuracy_score', {}).get('justification'),
            overall_summary=analysis.get('overall_summary'),
            
            score=average_score, # Populate existing score field with average
            feedback=analysis.get('overall_summary') # Populate existing feedback with summary
        )

        db.session.add(new_interview)
        db.session.commit()

        return jsonify(new_interview.to_dict()), 201

    except ValueError as ve: # Catch specific errors like API key missing
        return jsonify({"msg": str(ve)}), 500
    except Exception as e:
        db.session.rollback()
        print(f"Error completing interview: {e}") # Log the full error
        return jsonify({"msg": "Failed to complete interview", "error": str(e)}), 500

