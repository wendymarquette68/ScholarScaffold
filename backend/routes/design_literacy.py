import uuid
from flask import Blueprint, request, jsonify
from models import db
from models.quiz_result import QuizResult
from routes.auth import get_current_user

literacy_bp = Blueprint('literacy', __name__)

PASS_THRESHOLD = 70  # Percentage required to pass


@literacy_bp.route('/quiz', methods=['POST'])
def save_quiz():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    score = data.get('score', 0)
    responses = data.get('responses', {})
    passed = score >= PASS_THRESHOLD

    result = QuizResult(
        id=str(uuid.uuid4()),
        user_id=user.id,
        score=score,
        passed=passed,
        responses=responses,
    )
    db.session.add(result)

    if passed:
        user.design_literacy_complete = True

    db.session.commit()

    return jsonify({
        'success': True,
        'passed': passed,
        'score': score,
        'result': result.to_dict(),
    })


@literacy_bp.route('/status', methods=['GET'])
def get_status():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    return jsonify({
        'success': True,
        'complete': user.design_literacy_complete,
    })


@literacy_bp.route('/history', methods=['GET'])
def get_quiz_history():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    results = QuizResult.query.filter_by(user_id=user.id).order_by(QuizResult.created_at.desc()).all()
    return jsonify({
        'success': True,
        'results': [r.to_dict() for r in results],
    })
