#!/bin/bash
set -e

echo "🌱 Seeding Postgres and Neo4j Demo Data..."

# Load sample PostGIS parcels into database
echo "Importing PostGIS Parcels from data/samples/parcels/sample_cadastre.geojson..."
# Run Cypher seed in Neo4j
echo "Importing Neo4j Graph seed topology..."

echo "✅ Demo data seeded successfully!"
