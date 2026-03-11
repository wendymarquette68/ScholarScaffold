import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    # Render uses postgres:// but SQLAlchemy requires postgresql://
    _db_url = os.getenv('DATABASE_URL', 'sqlite:///scholar_scaffold.db')
    if _db_url.startswith('postgres://'):
        _db_url = _db_url.replace('postgres://', 'postgresql://', 1)
    SQLALCHEMY_DATABASE_URI = _db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False

    # Pilot mode: reduced article review thresholds (2 total, 1 include, 1 exclude)
    PILOT_MODE = os.getenv('PILOT_MODE', 'false').lower() == 'true'
    REVIEW_TOTAL_REQUIRED = 2 if PILOT_MODE else 10
    REVIEW_INCLUDE_REQUIRED = 1 if PILOT_MODE else 5
    REVIEW_EXCLUDE_REQUIRED = 1 if PILOT_MODE else 2


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig,
}
