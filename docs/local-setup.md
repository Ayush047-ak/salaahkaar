# 💻 Local Setup Guide

Follow these steps to run the complete Salaahkaar stack on your local development machine.

## 1. Clone & Configure Environment
```bash
cp .env.example .env
npm install
```

## 2. Start PostgreSQL/PostGIS & Neo4j
```bash
docker compose up -d postgres neo4j
```

## 3. Start Python Geospatial Engine
```bash
cd services/geospatial
python -m venv .venv
# On Linux/macOS:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## 4. Start Node.js API and React Frontend
In the root directory:
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.
