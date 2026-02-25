from datetime import datetime
from . import db


class SearchStrategy(db.Model):
    __tablename__ = 'search_strategies'

    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    topic = db.Column(db.Text, nullable=False)
    population = db.Column(db.Text, nullable=False)
    keywords = db.Column(db.JSON, default=list)
    boolean_operators = db.Column(db.JSON, default=list)
    filters = db.Column(db.JSON, default=dict)
    selected_databases = db.Column(db.JSON, default=list)
    search_string = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'topic': self.topic,
            'population': self.population,
            'keywords': self.keywords,
            'booleanOperators': self.boolean_operators,
            'filters': self.filters,
            'selectedDatabases': self.selected_databases,
            'searchString': self.search_string,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
