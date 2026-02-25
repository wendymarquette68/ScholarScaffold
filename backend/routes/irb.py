import uuid
from flask import Blueprint, request, jsonify
from models import db
from models.irb_log import IrbLog
from routes.auth import get_current_user

irb_bp = Blueprint('irb', __name__)


@irb_bp.route('/log', methods=['POST'])
def log_event():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    # Only log if user has consented
    if not user.consent_flag:
        return jsonify({'success': True, 'logged': False, 'reason': 'User has not consented'})

    data = request.get_json()
    event_type = data.get('eventType', '')
    payload = data.get('payload', {})

    if not event_type:
        return jsonify({'error': 'eventType is required'}), 400

    log = IrbLog(
        id=str(uuid.uuid4()),
        user_id=user.id,
        event_type=event_type,
        payload=payload,
    )
    db.session.add(log)
    db.session.commit()

    return jsonify({'success': True, 'logged': True})


@irb_bp.route('/logs', methods=['GET'])
def get_logs():
    """Admin endpoint to retrieve IRB logs for a user (for research purposes)."""
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    if not user.consent_flag:
        return jsonify({'success': True, 'logs': [], 'reason': 'User has not consented'})

    logs = IrbLog.query.filter_by(user_id=user.id).order_by(IrbLog.created_at.desc()).all()
    return jsonify({
        'success': True,
        'logs': [l.to_dict() for l in logs],
    })
