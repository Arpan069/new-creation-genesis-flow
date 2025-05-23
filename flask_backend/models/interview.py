
from datetime import datetime
from .user import db

class Interview(db.Model):
    """Interview model for storing interview data"""
    __tablename__ = 'interviews'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending') # pending, completed, cancelled
    recording_url = db.Column(db.String(255)) # Stores the video path
    
    # Transcript and Analysis fields
    transcript_text = db.Column(db.Text) # Full interview transcript

    language_score = db.Column(db.Float)
    language_justification = db.Column(db.Text)
    
    personality_score = db.Column(db.Float)
    personality_justification = db.Column(db.Text)
    
    accuracy_score = db.Column(db.Float)
    accuracy_justification = db.Column(db.Text) # Renamed from accuracy_score_justification for consistency
    
    overall_summary = db.Column(db.Text) # Can be used for general feedback

    # Existing score and feedback can be populated by new analysis or kept separate
    score = db.Column(db.Float) # Could be an average of the new scores
    feedback = db.Column(db.Text) # Could be the overall_summary

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    scheduled_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    
    # Foreign keys
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidates.id'), nullable=False) # Assuming candidate must be linked
    employer_id = db.Column(db.Integer, db.ForeignKey('employers.id'), nullable=True) # Employer can be optional for practice
    
    # Relationships
    candidate = db.relationship('Candidate', back_populates='interviews')
    employer = db.relationship('Employer', back_populates='interviews')
    
    def to_dict(self):
        """Convert interview object to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'recording_url': self.recording_url,
            
            'transcript_text': self.transcript_text,
            'language_score': self.language_score,
            'language_justification': self.language_justification,
            'personality_score': self.personality_score,
            'personality_justification': self.personality_justification,
            'accuracy_score': self.accuracy_score,
            'accuracy_justification': self.accuracy_justification,
            'overall_summary': self.overall_summary,
            
            'score': self.score, # Kept for now
            'feedback': self.feedback, # Kept for now

            'created_at': self.created_at.isoformat() if self.created_at else None,
            'scheduled_at': self.scheduled_at.isoformat() if self.scheduled_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'candidate_id': self.candidate_id,
            'employer_id': self.employer_id
        }

