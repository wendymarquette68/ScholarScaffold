from datetime import datetime
from . import db


class Article(db.Model):
    __tablename__ = 'articles'

    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.Text, nullable=False)
    authors = db.Column(db.Text, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    journal = db.Column(db.Text, nullable=False)
    doi = db.Column(db.String(255))
    abstract = db.Column(db.Text)
    review_complete = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    review = db.relationship('ArticleReview', backref='article', uselist=False, lazy='joined')
    annotation = db.relationship('Annotation', backref='article', uselist=False, lazy='joined')

    def to_dict(self):
        result = {
            'id': self.id,
            'userId': self.user_id,
            'title': self.title,
            'authors': self.authors,
            'year': self.year,
            'journal': self.journal,
            'doi': self.doi,
            'abstract': self.abstract,
            'reviewComplete': self.review_complete,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
        if self.review:
            result['review'] = self.review.to_dict()
        return result
