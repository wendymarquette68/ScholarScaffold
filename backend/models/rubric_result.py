from datetime import datetime
from . import db


class RubricResult(db.Model):
    __tablename__ = 'rubric_results'

    id = db.Column(db.String(36), primary_key=True)
    proposal_draft_id = db.Column(db.String(36), db.ForeignKey('proposal_drafts.id'), nullable=False, unique=True)

    # 7 scoring dimensions (1-4 scale)
    thesis_clarity = db.Column(db.Integer, nullable=False)
    scope_precision = db.Column(db.Integer, nullable=False)
    evidence_integration = db.Column(db.Integer, nullable=False)
    synthesis_depth = db.Column(db.Integer, nullable=False)
    methodological_awareness = db.Column(db.Integer, nullable=False)
    structural_completeness = db.Column(db.Integer, nullable=False)
    citation_presence = db.Column(db.Integer, nullable=False)

    # Feedback
    narrative_feedback = db.Column(db.JSON, default=dict)  # {dimension: feedback_text}
    priority_fixes = db.Column(db.JSON, default=list)  # Top 3 priority fixes
    revision_roadmap = db.Column(db.JSON, default=list)  # Ordered list of recommendations

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'proposalDraftId': self.proposal_draft_id,
            'scores': {
                'thesisClarity': self.thesis_clarity,
                'scopePrecision': self.scope_precision,
                'evidenceIntegration': self.evidence_integration,
                'synthesisDepth': self.synthesis_depth,
                'methodologicalAwareness': self.methodological_awareness,
                'structuralCompleteness': self.structural_completeness,
                'citationPresence': self.citation_presence,
            },
            'narrativeFeedback': self.narrative_feedback,
            'priorityFixes': self.priority_fixes,
            'revisionRoadmap': self.revision_roadmap,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }

    @property
    def total_score(self):
        return (
            self.thesis_clarity + self.scope_precision + self.evidence_integration +
            self.synthesis_depth + self.methodological_awareness +
            self.structural_completeness + self.citation_presence
        )

    @property
    def max_score(self):
        return 28  # 7 dimensions * 4 max
