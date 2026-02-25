import uuid
from flask import Blueprint, request, jsonify
from models import db
from models.article import Article
from models.article_review import ArticleReview
from routes.auth import get_current_user

articles_bp = Blueprint('articles', __name__)


@articles_bp.route('', methods=['GET'])
def get_articles():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    articles = Article.query.filter_by(user_id=user.id).order_by(Article.created_at.desc()).all()
    return jsonify({
        'success': True,
        'articles': [a.to_dict() for a in articles],
    })


@articles_bp.route('/<article_id>', methods=['GET'])
def get_article(article_id):
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    article = Article.query.filter_by(id=article_id, user_id=user.id).first()
    if not article:
        return jsonify({'error': 'Article not found'}), 404

    return jsonify({'success': True, 'article': article.to_dict()})


@articles_bp.route('', methods=['POST'])
def create_article():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    if not user.design_literacy_complete:
        return jsonify({'error': 'Complete Design Literacy Module first'}), 403

    data = request.get_json()
    required = ['title', 'authors', 'year', 'journal']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    article = Article(
        id=str(uuid.uuid4()),
        user_id=user.id,
        title=data['title'],
        authors=data['authors'],
        year=int(data['year']),
        journal=data['journal'],
        doi=data.get('doi', ''),
        abstract=data.get('abstract', ''),
    )
    db.session.add(article)
    db.session.commit()

    return jsonify({'success': True, 'article': article.to_dict()}), 201


@articles_bp.route('/<article_id>', methods=['PUT'])
def update_article(article_id):
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    article = Article.query.filter_by(id=article_id, user_id=user.id).first()
    if not article:
        return jsonify({'error': 'Article not found'}), 404

    data = request.get_json()
    for field in ['title', 'authors', 'year', 'journal', 'doi', 'abstract']:
        if field in data:
            setattr(article, field, int(data[field]) if field == 'year' else data[field])

    db.session.commit()
    return jsonify({'success': True, 'article': article.to_dict()})


@articles_bp.route('/<article_id>/review', methods=['POST'])
def save_review(article_id):
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    article = Article.query.filter_by(id=article_id, user_id=user.id).first()
    if not article:
        return jsonify({'error': 'Article not found'}), 404

    data = request.get_json()

    # Validate required fields
    required_fields = [
        'researchQuestion', 'studyDesign', 'sample', 'keyFindings', 'significance',
        'designStrengthRating', 'internalValidityIssues', 'externalValidityIssues',
        'limitations', 'applicabilityToScope',
        'relevanceScore', 'evidenceStrengthScore', 'argumentContributionScore',
        'whyIncludeExclude', 'biggestLimitation', 'intendedUse', 'inclusionDecision',
    ]
    for field in required_fields:
        if field not in data or (isinstance(data[field], str) and not data[field].strip()):
            return jsonify({'error': f'{field} is required'}), 400

    # Validate limitations minimum
    limitations = data.get('limitations', [])
    filled = [l for l in limitations if isinstance(l, str) and l.strip()]
    if len(filled) < 3:
        return jsonify({'error': 'Minimum 3 limitations required'}), 400

    # Validate inclusion decision
    if data['inclusionDecision'] not in ('include', 'exclude'):
        return jsonify({'error': 'inclusionDecision must be include or exclude'}), 400

    # Upsert review
    review = ArticleReview.query.filter_by(article_id=article_id).first()
    if review:
        # Update existing
        review.research_question = data['researchQuestion']
        review.study_design = data['studyDesign']
        review.sample = data['sample']
        review.key_findings = data['keyFindings']
        review.significance = data['significance']
        review.design_strength_rating = int(data['designStrengthRating'])
        review.internal_validity_issues = data['internalValidityIssues']
        review.external_validity_issues = data['externalValidityIssues']
        review.limitations = filled
        review.applicability_to_scope = data['applicabilityToScope']
        review.relevance_score = int(data['relevanceScore'])
        review.evidence_strength_score = int(data['evidenceStrengthScore'])
        review.argument_contribution_score = int(data['argumentContributionScore'])
        review.why_include_exclude = data['whyIncludeExclude']
        review.biggest_limitation = data['biggestLimitation']
        review.intended_use = data['intendedUse']
        review.inclusion_decision = data['inclusionDecision']
    else:
        review = ArticleReview(
            id=str(uuid.uuid4()),
            article_id=article_id,
            research_question=data['researchQuestion'],
            study_design=data['studyDesign'],
            sample=data['sample'],
            key_findings=data['keyFindings'],
            significance=data['significance'],
            design_strength_rating=int(data['designStrengthRating']),
            internal_validity_issues=data['internalValidityIssues'],
            external_validity_issues=data['externalValidityIssues'],
            limitations=filled,
            applicability_to_scope=data['applicabilityToScope'],
            relevance_score=int(data['relevanceScore']),
            evidence_strength_score=int(data['evidenceStrengthScore']),
            argument_contribution_score=int(data['argumentContributionScore']),
            why_include_exclude=data['whyIncludeExclude'],
            biggest_limitation=data['biggestLimitation'],
            intended_use=data['intendedUse'],
            inclusion_decision=data['inclusionDecision'],
        )
        db.session.add(review)

    article.review_complete = True
    db.session.commit()

    return jsonify({'success': True, 'review': review.to_dict()})


@articles_bp.route('/progress', methods=['GET'])
def get_progress():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    articles = Article.query.filter_by(user_id=user.id, review_complete=True).all()
    total = len(articles)
    included = sum(1 for a in articles if a.review and a.review.inclusion_decision == 'include')
    excluded = sum(1 for a in articles if a.review and a.review.inclusion_decision == 'exclude')

    return jsonify({
        'success': True,
        'progress': {
            'total': total,
            'included': included,
            'excluded': excluded,
        },
    })
