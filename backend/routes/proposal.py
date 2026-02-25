import uuid
from flask import Blueprint, request, jsonify
from models import db
from models.article import Article
from models.proposal_draft import ProposalDraft
from routes.auth import get_current_user

proposal_bp = Blueprint('proposal', __name__)


def check_proposal_unlock(user) -> dict:
    """Check if user meets requirements to access proposal builder."""
    articles = Article.query.filter_by(user_id=user.id, review_complete=True).all()
    total = len(articles)
    included = sum(1 for a in articles if a.review and a.review.inclusion_decision == 'include')
    excluded = sum(1 for a in articles if a.review and a.review.inclusion_decision == 'exclude')

    unlocked = total >= 10 and included >= 5 and excluded >= 2
    return {
        'unlocked': unlocked,
        'progress': {'total': total, 'included': included, 'excluded': excluded},
    }


@proposal_bp.route('/status', methods=['GET'])
def get_unlock_status():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    status = check_proposal_unlock(user)
    return jsonify({'success': True, **status})


@proposal_bp.route('/drafts', methods=['GET'])
def get_drafts():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    status = check_proposal_unlock(user)
    if not status['unlocked']:
        return jsonify({'error': 'Proposal Builder is locked', **status}), 403

    drafts = ProposalDraft.query.filter_by(user_id=user.id).order_by(ProposalDraft.version.desc()).all()
    return jsonify({
        'success': True,
        'drafts': [d.to_dict() for d in drafts],
    })


@proposal_bp.route('/drafts', methods=['POST'])
def save_draft():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    status = check_proposal_unlock(user)
    if not status['unlocked']:
        return jsonify({'error': 'Proposal Builder is locked', **status}), 403

    data = request.get_json()
    version = data.get('version', 1)

    # Find existing draft for this version or create new
    draft = ProposalDraft.query.filter_by(user_id=user.id, version=version).first()
    if draft:
        draft.title = data.get('title', draft.title)
        draft.background = data.get('background', draft.background)
        draft.problem_statement = data.get('problemStatement', draft.problem_statement)
        draft.purpose_research_question = data.get('purposeResearchQuestion', draft.purpose_research_question)
        draft.literature_synthesis = data.get('literatureSynthesis', draft.literature_synthesis)
        draft.significance = data.get('significance', draft.significance)
        draft.preliminary_questions = data.get('preliminaryQuestions', draft.preliminary_questions)
    else:
        draft = ProposalDraft(
            id=str(uuid.uuid4()),
            user_id=user.id,
            version=version,
            title=data.get('title', ''),
            background=data.get('background', ''),
            problem_statement=data.get('problemStatement', ''),
            purpose_research_question=data.get('purposeResearchQuestion', ''),
            literature_synthesis=data.get('literatureSynthesis', ''),
            significance=data.get('significance', ''),
            preliminary_questions=data.get('preliminaryQuestions', ''),
        )
        db.session.add(draft)

    db.session.commit()
    return jsonify({'success': True, 'draft': draft.to_dict()})


@proposal_bp.route('/drafts/<int:version>', methods=['GET'])
def get_draft_version(version):
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    draft = ProposalDraft.query.filter_by(user_id=user.id, version=version).first()
    if not draft:
        return jsonify({'error': 'Draft not found'}), 404

    return jsonify({'success': True, 'draft': draft.to_dict()})


@proposal_bp.route('/comparison', methods=['GET'])
def get_comparison():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    draft1 = ProposalDraft.query.filter_by(user_id=user.id, version=1).first()
    draft2 = ProposalDraft.query.filter_by(user_id=user.id, version=2).first()

    return jsonify({
        'success': True,
        'draft1': draft1.to_dict() if draft1 else None,
        'draft2': draft2.to_dict() if draft2 else None,
    })
