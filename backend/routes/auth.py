import uuid
from flask import Blueprint, request, jsonify
import bcrypt
import jwt
from datetime import datetime, timedelta
from flask import current_app
from models import db
from models.user import User

auth_bp = Blueprint('auth', __name__)


def generate_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow(),
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


def get_current_user() -> User | None:
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1]
    payload = decode_token(token)
    if not payload:
        return None
    return User.query.get(payload['user_id'])


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'success': False, 'error': 'Email and password required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
        return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

    token = generate_token(user.id)
    return jsonify({'success': True, 'token': token, 'user': user.to_dict()})


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    name = data.get('name', email.split('@')[0])

    if not email or not password:
        return jsonify({'success': False, 'error': 'Email and password required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'error': 'Email already registered'}), 409

    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user = User(
        id=str(uuid.uuid4()),
        email=email,
        password_hash=password_hash,
        name=name,
    )
    db.session.add(user)
    db.session.commit()

    token = generate_token(user.id)
    return jsonify({'success': True, 'token': token, 'user': user.to_dict()}), 201


@auth_bp.route('/consent', methods=['POST'])
def save_consent():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    consent = data.get('consent')
    if consent is None:
        return jsonify({'error': 'Consent value required'}), 400

    user.consent_flag = bool(consent)
    db.session.commit()

    return jsonify({'success': True, 'consentFlag': user.consent_flag})


@auth_bp.route('/me', methods=['GET'])
def get_me():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify({'success': True, 'user': user.to_dict()})
