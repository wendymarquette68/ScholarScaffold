from datetime import datetime
from . import db


class ProposalDraft(db.Model):
    __tablename__ = 'proposal_drafts'

    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    version = db.Column(db.Integer, nullable=False, default=1)
    title = db.Column(db.Text, default='')
    background = db.Column(db.Text, default='')
    problem_statement = db.Column(db.Text, default='')
    purpose_research_question = db.Column(db.Text, default='')
    literature_synthesis = db.Column(db.Text, default='')
    significance = db.Column(db.Text, default='')
    preliminary_questions = db.Column(db.Text, default='')
    submitted_for_rubric = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    rubric_result = db.relationship('RubricResult', backref='proposal_draft', uselist=False, lazy='joined')

    __table_args__ = (
        db.UniqueConstraint('user_id', 'version', name='uq_user_version'),
    )

    def to_dict(self):
        result = {
            'id': self.id,
            'userId': self.user_id,
            'version': self.version,
            'title': self.title,
            'background': self.background,
            'problemStatement': self.problem_statement,
            'purposeResearchQuestion': self.purpose_research_question,
            'literatureSynthesis': self.literature_synthesis,
            'significance': self.significance,
            'preliminaryQuestions': self.preliminary_questions,
            'submittedForRubric': self.submitted_for_rubric,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
        }
        if self.rubric_result:
            result['rubricResult'] = self.rubric_result.to_dict()
        return result

    def get_full_text(self):
        """Concatenate all sections into a single text for rubric scoring."""
        sections = [
            self.title, self.background, self.problem_statement,
            self.purpose_research_question, self.literature_synthesis,
            self.significance, self.preliminary_questions,
        ]
        return '\n\n'.join(s for s in sections if s)
