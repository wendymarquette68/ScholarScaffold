import uuid
from flask import Blueprint, request, jsonify
from models import db
from models.article import Article
from models.annotation import Annotation
from routes.auth import get_current_user

bibliography_bp = Blueprint('bibliography', __name__)


@bibliography_bp.route('', methods=['GET'])
def get_bibliography():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    # Only return articles marked "include" with completed reviews
    articles = Article.query.filter_by(
        user_id=user.id,
        review_complete=True,
    ).all()

    included = [a for a in articles if a.review and a.review.inclusion_decision == 'include']

    result = []
    for article in included:
        entry = article.to_dict()
        if article.annotation:
            entry['annotation'] = article.annotation.to_dict()
        result.append(entry)

    return jsonify({'success': True, 'bibliography': result})


@bibliography_bp.route('/<article_id>/annotation', methods=['PUT'])
def update_annotation(article_id):
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    article = Article.query.filter_by(id=article_id, user_id=user.id).first()
    if not article:
        return jsonify({'error': 'Article not found'}), 404

    data = request.get_json()

    annotation = Annotation.query.filter_by(article_id=article_id).first()
    if annotation:
        annotation.summary = data.get('summary', annotation.summary)
        annotation.evaluation = data.get('evaluation', annotation.evaluation)
        annotation.relevance = data.get('relevance', annotation.relevance)
    else:
        annotation = Annotation(
            id=str(uuid.uuid4()),
            article_id=article_id,
            summary=data.get('summary', ''),
            evaluation=data.get('evaluation', ''),
            relevance=data.get('relevance', ''),
        )
        db.session.add(annotation)

    db.session.commit()
    return jsonify({'success': True, 'annotation': annotation.to_dict()})
