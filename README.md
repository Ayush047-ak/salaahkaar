# 🏛️ Salaahkaar (सलाहकार)
### 3D Property Reconciliation, Conflict Graph, and Geospatial Verification Platform

Salaahkaar is a modern spatial property intelligence platform built to resolve land boundaries, build volumetric (3D) cadastres, detect spatial/legal conflicts, and verify land parcels with high accuracy using LiDAR point clouds, deed registries, and topological knowledge graphs.

---

## 📁 Monorepo Structure

```
salaahkaar/
├── apps/
│   ├── web/                         # Modern React + Vite + Three.js Frontend
│   └── api/                         # Node.js + TypeScript Application API & Orchestrator
├── services/
│   └── geospatial/                  # Python + FastAPI + Shapely/Open3D/Trimesh Service
├── packages/
│   └── shared-contracts/            # Shared TypeScript types, schemas & DTOs
├── database/
│   ├── postgres/                    # PostGIS schemas, migrations & spatial seed data
│   └── neo4j/                       # Graph database constraints & property topology cypher
├── data/
│   ├── samples/                     # Point clouds (.las/sample), floor heights, cadastral parcels
│   └── processed/                   # Generated 3D meshes, reconciled geometries
├── docs/                            # Architecture diagrams, API specs, dataset guides
└── scripts/                         # Setup, demo seeding, and launch scripts
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **Python**: v3.10+
- **Docker & Docker Compose** (for PostgreSQL PostGIS & Neo4j)

### 2. Environment Setup
```bash
# Copy example environment configuration
cp .env.example .env

# Install Node workspace dependencies
npm install

# Setup Python Virtual Environment for Geospatial Service
cd services/geospatial
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

### 3. Spin up Databases with Docker
```bash
docker compose up -d postgres neo4j
```

### 4. Run Development Servers
- **Full Monorepo**: `npm run dev`
- **Frontend Only**: `npm run dev:web` (Runs on `http://localhost:5173`)
- **Node API**: `npm run dev:api` (Runs on `http://localhost:4000`)
- **Geospatial Service**: `npm run dev:geospatial` (Runs on `http://localhost:8000`)

---

## 🛠️ Key Features
- **3D Volumetric Property Visualization**: Interactive Three.js/MapLibre viewer with floor-by-floor extrusion and height estimation.
- **Topological Conflict Graph**: Neo4j-backed graph visualizing ownership overlap, easement encumbrances, and boundary discrepancies.
- **Geospatial Extraction Pipeline**: Automated footprint extraction, coordinate transformation (EPSG/WGS84), and point cloud slicing.
- **Legal & Cadastral Reconciliation**: Deterministic discrepancy scoring between physical point cloud models and legal land deeds.
- **Evidence & Verification Studio**: Side-by-side comparison, audit logs, and approval workflows for land revenue officers & adjudicators.
