from datetime import datetime
from . import db


class Annotation(db.Model):
    __tablename__ = 'annotations'

    id = db.Column(db.String(36), primary_key=True)
    article_id = db.Column(db.String(36), db.ForeignKey('articles.id'), nullable=False, unique=True)
    summary = db.Column(db.Text)
    evaluation = db.Column(db.Text)
    relevance = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'articleId': self.article_id,
            'summary': self.summary,
            'evaluation': self.evaluation,
            'relevance': self.relevance,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
