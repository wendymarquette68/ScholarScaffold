import uuid
from flask import Blueprint, request, jsonify
from models import db
from models.article import Article
from models.proposal_draft import ProposalDraft
from models.rubric_result import RubricResult
from routes.auth import get_current_user
from services.rubric_engine import score_proposal

rubric_bp = Blueprint('rubric', __name__)


@rubric_bp.route('/score', methods=['POST'])
def score_draft():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    version = data.get('version', 1)

    # Get the proposal draft
    draft = ProposalDraft.query.filter_by(user_id=user.id, version=version).first()
    if not draft:
        return jsonify({'error': 'Draft not found'}), 404

    # Count included articles for evidence integration scoring
    articles = Article.query.filter_by(user_id=user.id, review_complete=True).all()
    included_count = sum(1 for a in articles if a.review and a.review.inclusion_decision == 'include')

    # Build draft data dict
    draft_data = {
        'title': draft.title,
        'background': draft.background,
        'problemStatement': draft.problem_statement,
        'purposeResearchQuestion': draft.purpose_research_question,
        'literatureSynthesis': draft.literature_synthesis,
        'significance': draft.significance,
        'preliminaryQuestions': draft.preliminary_questions,
    }

    # Run the rubric engine
    result = score_proposal(draft_data, included_count)

    # Save or update rubric result
    existing = RubricResult.query.filter_by(proposal_draft_id=draft.id).first()
    if existing:
        existing.thesis_clarity = result['scores']['thesisClarity']
        existing.scope_precision = result['scores']['scopePrecision']
        existing.evidence_integration = result['scores']['evidenceIntegration']
        existing.synthesis_depth = result['scores']['synthesisDepth']
        existing.methodological_awareness = result['scores']['methodologicalAwareness']
        existing.structural_completeness = result['scores']['structuralCompleteness']
        existing.citation_presence = result['scores']['citationPresence']
        existing.narrative_feedback = result['narrativeFeedback']
        existing.priority_fixes = result['priorityFixes']
        existing.revision_roadmap = result['revisionRoadmap']
        rubric_result = existing
    else:
        rubric_result = RubricResult(
            id=str(uuid.uuid4()),
            proposal_draft_id=draft.id,
            thesis_clarity=result['scores']['thesisClarity'],
            scope_precision=result['scores']['scopePrecision'],
            evidence_integration=result['scores']['evidenceIntegration'],
            synthesis_depth=result['scores']['synthesisDepth'],
            methodological_awareness=result['scores']['methodologicalAwareness'],
            structural_completeness=result['scores']['structuralCompleteness'],
            citation_presence=result['scores']['citationPresence'],
            narrative_feedback=result['narrativeFeedback'],
            priority_fixes=result['priorityFixes'],
            revision_roadmap=result['revisionRoadmap'],
        )
        db.session.add(rubric_result)

    draft.submitted_for_rubric = True
    db.session.commit()

    return jsonify({
        'success': True,
        'result': rubric_result.to_dict(),
    })


@rubric_bp.route('/results/<int:version>', methods=['GET'])
def get_results(version):
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    draft = ProposalDraft.query.filter_by(user_id=user.id, version=version).first()
    if not draft:
        return jsonify({'error': 'Draft not found'}), 404

    if not draft.rubric_result:
        return jsonify({'error': 'No rubric results yet'}), 404

    return jsonify({
        'success': True,
        'result': draft.rubric_result.to_dict(),
    })


@rubric_bp.route('/comparison', methods=['GET'])
def get_comparison():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    draft1 = ProposalDraft.query.filter_by(user_id=user.id, version=1).first()
    draft2 = ProposalDraft.query.filter_by(user_id=user.id, version=2).first()

    result = {
        'success': True,
        'draft1': None,
        'draft2': None,
    }

    if draft1:
        result['draft1'] = {
            'draft': draft1.to_dict(),
            'rubric': draft1.rubric_result.to_dict() if draft1.rubric_result else None,
        }
    if draft2:
        result['draft2'] = {
            'draft': draft2.to_dict(),
            'rubric': draft2.rubric_result.to_dict() if draft2.rubric_result else None,
        }

    return jsonify(result)
