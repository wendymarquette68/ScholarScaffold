from datetime import datetime
from . import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    consent_flag = db.Column(db.Boolean, nullable=True, default=None)
    design_literacy_complete = db.Column(db.Boolean, default=False)
    search_strategy_complete = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    articles = db.relationship('Article', backref='user', lazy='dynamic')
    search_strategies = db.relationship('SearchStrategy', backref='user', lazy='dynamic')
    quiz_results = db.relationship('QuizResult', backref='user', lazy='dynamic')
    proposal_drafts = db.relationship('ProposalDraft', backref='user', lazy='dynamic')
    irb_logs = db.relationship('IrbLog', backref='user', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'consentFlag': self.consent_flag,
            'designLiteracyComplete': self.design_literacy_complete,
            'searchStrategyComplete': self.search_strategy_complete,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
