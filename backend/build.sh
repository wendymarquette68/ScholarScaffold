#!/usr/bin/env bash
# Render build script for the backend
set -o errexit

pip install -r requirements.txt

# Run safe column migrations (adds new columns, skips existing)
python migrate.py

# Seed the database with test users
python seed.py
