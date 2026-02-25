import uuid
from flask import Blueprint, request, jsonify
from models import db
from models.search_strategy import SearchStrategy
from routes.auth import get_current_user

strategy_bp = Blueprint('strategy', __name__)


@strategy_bp.route('', methods=['POST'])
def save_strategy():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()

    # Upsert: update existing or create new
    strategy = SearchStrategy.query.filter_by(user_id=user.id).first()
    if strategy:
        strategy.topic = data.get('topic', strategy.topic)
        strategy.population = data.get('population', strategy.population)
        strategy.keywords = data.get('keywords', strategy.keywords)
        strategy.boolean_operators = data.get('booleanOperators', strategy.boolean_operators)
        strategy.filters = data.get('filters', strategy.filters)
        strategy.selected_databases = data.get('selectedDatabases', strategy.selected_databases)
        strategy.search_string = data.get('searchString', strategy.search_string)
    else:
        strategy = SearchStrategy(
            id=str(uuid.uuid4()),
            user_id=user.id,
            topic=data.get('topic', ''),
            population=data.get('population', ''),
            keywords=data.get('keywords', []),
            boolean_operators=data.get('booleanOperators', []),
            filters=data.get('filters', {}),
            selected_databases=data.get('selectedDatabases', []),
            search_string=data.get('searchString', ''),
        )
        db.session.add(strategy)

    db.session.commit()
    return jsonify({'success': True, 'strategy': strategy.to_dict()})


@strategy_bp.route('', methods=['GET'])
def get_strategy():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    strategy = SearchStrategy.query.filter_by(user_id=user.id).first()
    if not strategy:
        return jsonify({'success': True, 'strategy': None})

    return jsonify({'success': True, 'strategy': strategy.to_dict()})


@strategy_bp.route('/complete', methods=['POST'])
def mark_complete():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    user.search_strategy_complete = True
    db.session.commit()

    return jsonify({'success': True})
