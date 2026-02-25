from datetime import datetime
from . import db


class IrbLog(db.Model):
    __tablename__ = 'irb_logs'

    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    event_type = db.Column(db.String(100), nullable=False)
    payload = db.Column(db.JSON, default=dict)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'eventType': self.event_type,
            'payload': self.payload,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
