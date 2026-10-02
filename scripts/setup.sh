#!/bin/bash
set -e

echo "🚀 Setting up Salaahkaar Monorepo..."

if [ ! -f .env ]; then
    echo "📄 Creating .env from .env.example..."
    cp .env.example .env
fi

echo "📦 Installing root and workspace npm packages..."
npm install

echo "🐍 Setting up Python virtual environment for Geospatial service..."
cd services/geospatial
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi
source .venv/bin/activate || source .venv/Scripts/activate
pip install --upgrade pip
pip install -r requirements.txt
cd ../..

echo "✅ Setup completed successfully!"
