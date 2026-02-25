import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from config import config
from models import db

migrate = Migrate()


def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins='*')

    # Register blueprints
    from routes import all_blueprints
    for blueprint, url_prefix in all_blueprints:
        app.register_blueprint(blueprint, url_prefix=url_prefix)

    # Health check
    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'ScholarScaffold API is running'}

    # Create tables on first run
    with app.app_context():
        db.create_all()

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
