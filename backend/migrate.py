"""
Safe column migration script.
Adds new columns to existing tables without dropping data.
Run via: python migrate.py
Called by build.sh on every Render deploy.
"""
import os
from app import create_app
from models import db
from sqlalchemy import text

NEW_COLUMNS = [
    # table, column, type+default
    ('search_strategies', 'research_question', "TEXT DEFAULT ''"),
    ('proposal_drafts', 'theoretical_framework', "TEXT DEFAULT ''"),
    ('proposal_drafts', 'proposed_methodology', "TEXT DEFAULT ''"),
]


def migrate():
    app = create_app()
    with app.app_context():
        # Ensure all tables exist first
        db.create_all()

        with db.engine.connect() as conn:
            for table, column, col_def in NEW_COLUMNS:
                try:
                    conn.execute(text(f'ALTER TABLE {table} ADD COLUMN {column} {col_def}'))
                    conn.commit()
                    print(f'  + Added {column} to {table}')
                except Exception:
                    conn.rollback()
                    print(f'  = {column} in {table} already exists — skipping')


if __name__ == '__main__':
    print('Running ScholarScaffold database migrations...')
    migrate()
    print('Migrations complete.')
