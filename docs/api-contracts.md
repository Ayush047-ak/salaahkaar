# 📡 API Contracts & Endpoints

## Node.js Application API (`http://localhost:4000/api/v1`)

### 1. Projects
- `GET /projects`: List all cadastre verification projects
- `POST /projects`: Create a new project workspace
- `GET /projects/:id`: Get project summary and workflow progress

### 2. Ingestion & Preprocessing
- `POST /ingestion/upload`: Upload LAS/LAZ point cloud and GeoJSON deed boundaries
- `POST /processing/run-pipeline`: Trigger point cloud filtering and footprint extraction

### 3. Properties & 3D Extrusion
- `GET /properties/:projectId`: Get all parcels with PostGIS geometries and 3D building meshes
- `GET /properties/:projectId/units`: Get strata 3D unit breakdown

### 4. Conflict Graph & Reconciliation
- `GET /graph/:projectId`: Retrieve Neo4j topological graph (nodes & edges)
- `GET /reconciliation/:projectId/conflicts`: Retrieve detected boundary overlaps & easement violations

### 5. Verifications
- `POST /verification/adjudicate`: Submit revenue officer decision and digital audit signature

---

## Python Geospatial Service (`http://localhost:8000`)
- `GET /health`: Health check and GPU/CPU capability report
- `POST /api/preprocess`: Slice point cloud by bounding box and filter noise
- `POST /api/extract`: Extract building 2D polygon footprint and estimate floor heights
- `POST /api/geometry/mesh`: Generate 3D OBJ / GLTF mesh from footprint & elevation
- `POST /api/reconcile`: Run spatial intersection and calculate overlap square meters
