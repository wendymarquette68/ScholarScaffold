"""Seed the database with test data matching the frontend mock data."""

import uuid
import bcrypt
from app import create_app
from models import db
from models.user import User


def seed():
    app = create_app()
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()

        # Create test users
        pw_hash = bcrypt.hashpw('password123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        user1 = User(
            id='user-1',
            email='student@university.edu',
            password_hash=pw_hash,
            name='Demo Student',
            consent_flag=True,
            design_literacy_complete=True,
            search_strategy_complete=True,
        )

        user2 = User(
            id='user-2',
            email='test@university.edu',
            password_hash=pw_hash,
            name='Test Student',
            consent_flag=None,
            design_literacy_complete=False,
            search_strategy_complete=False,
        )

        db.session.add_all([user1, user2])
        db.session.commit()

        print('Database seeded successfully!')
        print(f'  User 1: {user1.email} (pre-completed stages)')
        print(f'  User 2: {user2.email} (fresh start)')
        print(f'  Password for both: password123')


if __name__ == '__main__':
    seed()
