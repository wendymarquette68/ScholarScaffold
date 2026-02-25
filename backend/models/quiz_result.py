from datetime import datetime
from . import db


class QuizResult(db.Model):
    __tablename__ = 'quiz_results'

    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    score = db.Column(db.Float, nullable=False)
    passed = db.Column(db.Boolean, nullable=False)
    responses = db.Column(db.JSON, default=dict)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'score': self.score,
            'passed': self.passed,
            'responses': self.responses,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
