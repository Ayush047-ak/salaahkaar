# 🏛️ Salaahkaar (सलाहकार)
### *Next-Generation 3D Property Reconciliation, Cadastral Topology Graph & Spatial Verification Platform*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://salaahkaar-lpdv.vercel.app/)
[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Three.js-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://salaahkaar-lpdv.vercel.app/)
[![FastAPI](https://img.shields.io/badge/Geospatial-FastAPI%20%7C%20Python%203.12-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/Spatial%20DB-PostgreSQL%20%2B%20PostGIS-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgis.net/)
[![Neo4j](https://img.shields.io/badge/Graph%20DB-Neo4j%20Aura-008CC1?style=for-the-badge&logo=neo4j&logoColor=white)](https://neo4j.com/)

---

## 🌐 Live Deployment

🚀 **Try the Live Application:** [**https://salaahkaar-lpdv.vercel.app/**](https://salaahkar.vercel.app/)

> **Salaahkaar** transforms complex land administration, deeds, and aerial LiDAR data into an interactive, volumetric 3D digital cadastre. It detects physical-vs-legal boundary encroachments, height/setback violations, and ownership conflicts using graph topology and deterministic spatial geometry algorithms.

---

## 📸 Platform Highlights

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SALAAHKAAR PLATFORM                            │
├────────────────────────────────┬────────────────────────────────────────────┤
│  🏢 3D Volumetric Strata       │  Interactive WebGL/Three.js parcel & floor  │
│     Explorer                   │  stack visualizer with height estimation.  │
├────────────────────────────────┼────────────────────────────────────────────┤
│  🕸️ Topological Conflict       │  Neo4j-powered graph tracking overlaps,     │
│     Knowledge Graph            │  easement encumbrances, and deed claims.   │
├────────────────────────────────┼────────────────────────────────────────────┤
│  🛰️ Geospatial Intelligence   │  FastAPI service for point cloud slicing,  │
│     Pipeline                   │  footprint extraction, and CRS transforms. │
├────────────────────────────────┼────────────────────────────────────────────┤
│  ⚖️ Adjudication & Audit       │  Evidence-backed verification studio for   │
│     Workbench                  │  revenue officers and spatial planners.    │
└────────────────────────────────┴────────────────────────────────────────────┘
```

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([🌐 Browser / Officer]) -->|HTTPS| Web[React + Vite Frontend (Vercel)]
    Web -->|REST /api/v1| API[Express API Orchestrator (Node.js/TS)]
    
    subgraph Data & Compute Services
        API -->|SQL + GiST Spatial Queries| PG[(PostgreSQL + PostGIS 3.x)]
        API -->|Cypher Graph Queries| Graph[(Neo4j Aura Graph DB)]
        API -->|gRPC / REST| Geo[Geospatial FastAPI Service (Python 3.12)]
        
        Geo -->|LiDAR LAS/LAZ & GeoJSON Processing| Shp[Shapely / Trimesh / Open3D Engine]
    end
```

---

## 📁 Monorepo Layout

```text
salaahkaar/
├── apps/
│   ├── web/                         # React 18, Vite, Three.js 3D Explorer & Tailwind/Vanilla CSS
│   └── api/                         # Express, TypeScript, Zod, pg & Neo4j driver orchestrator
├── services/
│   └── geospatial/                  # Python 3.12, FastAPI, Shapely, Trimesh, NumPy spatial engine
├── packages/
│   └── shared-contracts/            # Shared TypeScript interfaces, types & Zod schemas
├── database/
│   ├── postgres/                    # PostGIS DDL schema, spatial indexes & seed migrations
│   └── neo4j/                       # Graph constraints, relationship modeling & Cypher queries
├── docs/                            # Step-by-step cloud deployment & architecture guides
└── docker-compose.yml               # Multi-container local orchestration
```

---

## ⚡ Key Capabilities

### 1. 🏢 3D Strata & Floor Stack Exploration
- Volumetric 3D extrusion of building footprints from LiDAR point clouds.
- Multi-tier floor strata separation (carpet area, built-up area, super built-up area).
- Interactive camera controls, wireframe modes, and bounding box inspection.

### 2. 🔍 Automated Conflict Detection
- **Boundary Overlap**: Detects Cadastral vs. physical survey boundary discrepancies.
- **Easement Encroachment**: Buffer-based geometric intersections across roads, drainage, and power lines.
- **Height Limit & Setback Violations**: Computes volumetric extrusions against zoning bylaws.
- **Multiple Title Claims**: Uncovers dual-registered deeds on the same spatial polygon via Neo4j.

### 3. ⚖️ Revenue Officer Verification Studio
- Side-by-side evidence inspection (Deed records, LiDAR scans, GeoJSON cadastre).
- One-click adjudication decisions (`APPROVE_AS_SURVEYED`, `ENFORCE_DEED`, `ISSUE_ENCROACHMENT_NOTICE`).
- Cryptographic signature hashing for tamper-proof audit trails.

---

## 🛠️ Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18.x or v20.x
- **Python**: v3.12+
- **Docker & Docker Compose**

### 1. Clone the Repository
```bash
git clone https://github.com/Ayush047-ak/salaahkaar.git
cd salaahkaar
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```

### 3. Install Dependencies
```bash
# Install workspace dependencies
npm install

# Setup Python environment
cd services/geospatial
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

### 4. Start Databases via Docker
```bash
docker compose up -d postgres neo4j
```

### 5. Launch Development Services
```bash
# Run all services concurrently
npm run dev

# Or launch individually:
npm run dev:web         # Frontend: http://localhost:5173
npm run dev:api         # Express API: http://localhost:4000
npm run dev:geospatial  # Python Service: http://localhost:8000
```

---

## 🚀 Cloud Deployment Guide

| Service | Platform | Link / Config |
| :--- | :--- | :--- |
| **Frontend** | **Vercel** | [`apps/web`](apps/web) → [https://salaahkaar-lpdv.vercel.app/](https://salaahkaar-lpdv.vercel.app/) |
| **Express API** | **Render / Railway** | [`apps/api/Dockerfile`](apps/api/Dockerfile) |
| **Geospatial Engine** | **Render / Railway** | [`services/geospatial/Dockerfile`](services/geospatial/Dockerfile) |
| **PostgreSQL + PostGIS**| **Render / Supabase** | [`database/postgres/schema.sql`](database/postgres/schema.sql) |
| **Knowledge Graph** | **Neo4j Aura** | Free Cloud Graph Instance |

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ for Modern Land Governance & 3D Spatial Intelligence.</sub>
</div>
