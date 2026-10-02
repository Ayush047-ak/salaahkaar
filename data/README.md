# Sample & Test Datasets for Salaahkaar

This directory stores spatial reference samples, drone/LiDAR point cloud files, cadastral GIS layers, and floor height tables used for local development and integration testing.

## Directory Layout:
- `samples/pointcloud/`: Sample LAS/LAZ point clouds (or mock synthetic point clouds)
- `samples/parcels/`: GeoJSON cadastral land records with khasra & survey boundaries
- `samples/floor-height/`: CSV/JSON tables of ground-truth floor levels and slab measurements
- `samples/expected-results/`: Gold-standard benchmark reconciliation and conflict outputs
- `processed/`: Output directory where extracted 3D meshes (.obj / .gltf) and spatial slices are written
