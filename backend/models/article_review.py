from datetime import datetime
from . import db


class ArticleReview(db.Model):
    __tablename__ = 'article_reviews'

    id = db.Column(db.String(36), primary_key=True)
    article_id = db.Column(db.String(36), db.ForeignKey('articles.id'), nullable=False, unique=True)

    # Section A: Structured Summary
    research_question = db.Column(db.Text, nullable=False)
    study_design = db.Column(db.String(100), nullable=False)
    sample = db.Column(db.Text, nullable=False)
    key_findings = db.Column(db.Text, nullable=False)
    significance = db.Column(db.Text, nullable=False)

    # Section B: Evidence Evaluation
    design_strength_rating = db.Column(db.Integer, nullable=False)
    internal_validity_issues = db.Column(db.Text, nullable=False)
    external_validity_issues = db.Column(db.Text, nullable=False)
    limitations = db.Column(db.JSON, nullable=False)  # Array of strings, min 3
    applicability_to_scope = db.Column(db.Text, nullable=False)

    # Section C: Inclusion Decision
    relevance_score = db.Column(db.Integer, nullable=False)
    evidence_strength_score = db.Column(db.Integer, nullable=False)
    argument_contribution_score = db.Column(db.Integer, nullable=False)
    why_include_exclude = db.Column(db.Text, nullable=False)
    biggest_limitation = db.Column(db.Text, nullable=False)
    intended_use = db.Column(db.Text, nullable=False)
    inclusion_decision = db.Column(db.String(10), nullable=False)  # 'include' or 'exclude'

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'articleId': self.article_id,
            'researchQuestion': self.research_question,
            'studyDesign': self.study_design,
            'sample': self.sample,
            'keyFindings': self.key_findings,
            'significance': self.significance,
            'designStrengthRating': self.design_strength_rating,
            'internalValidityIssues': self.internal_validity_issues,
            'externalValidityIssues': self.external_validity_issues,
            'limitations': self.limitations,
            'applicabilityToScope': self.applicability_to_scope,
            'relevanceScore': self.relevance_score,
            'evidenceStrengthScore': self.evidence_strength_score,
            'argumentContributionScore': self.argument_contribution_score,
            'whyIncludeExclude': self.why_include_exclude,
            'biggestLimitation': self.biggest_limitation,
            'intendedUse': self.intended_use,
            'inclusionDecision': self.inclusion_decision,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
