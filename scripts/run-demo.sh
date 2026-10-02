#!/bin/bash
set -e

echo "🌟 Launching Salaahkaar Development Environment..."
docker compose up -d postgres neo4j
npm run dev
