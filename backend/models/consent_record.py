from datetime import datetime
from . import db


class ConsentRecord(db.Model):
    __tablename__ = 'consent_records'

    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    consented = db.Column(db.Boolean, nullable=False)
    consent_timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    platform_version = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'consented': self.consented,
            'consentTimestamp': self.consent_timestamp.isoformat() if self.consent_timestamp else None,
            'platformVersion': self.platform_version,
        }
