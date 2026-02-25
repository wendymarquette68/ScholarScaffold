#!/usr/bin/env bash
# Render build script for the backend
set -o errexit

pip install -r requirements.txt

# Seed the database with test users
python seed.py
