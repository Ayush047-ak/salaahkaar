-- ============================================================
-- Salaahkaar — Demo Seed Data
-- ============================================================

-- Project
INSERT INTO projects (id, name, description, region, crs, status, total_parcels) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sector 45 Urban Cadastre', 'Cadastral reconciliation for Sector 45 residential and mixed-use parcels in Delhi NCR.', 'Delhi NCR', 'EPSG:4326', 'CONFLICT_GRAPHING', 42),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Greenfield Highway Corridor Easements', 'Easement verification along the proposed National Highway 44 bypass corridor.', 'Maharashtra', 'EPSG:4326', 'VERIFICATION_COMPLETE', 128)
ON CONFLICT (id) DO NOTHING;

-- Source Datasets
INSERT INTO source_datasets (id, project_id, filename, original_name, mime_type, size_bytes, dataset_type, status, record_count, crs) VALUES
  ('d1a1a1a1-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'sector45_lidar_2024.las', 'DJI_Zenmuse_L2_Scan_Sector45.las', 'application/octet-stream', 245000000, 'POINTCLOUD', 'READY', 14500000, 'EPSG:32643'),
  ('d2a2a2a2-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'sector45_parcels.geojson', 'Delhi_Revenue_Map_SRV894.geojson', 'application/geo+json', 1200000, 'CADASTRAL_PARCEL', 'READY', 42, 'EPSG:4326'),
  ('d3a3a3a3-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'registry_deeds.pdf', 'Registry_Deeds_Sector45_Batch.pdf', 'application/pdf', 8500000, 'REGISTRY_DEED', 'READY', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Parcels with PostGIS geometry
INSERT INTO parcels (id, project_id, khasra_number, survey_number, owner_name, claimed_area_sqm, calculated_area_sqm, zoning_type, geom, status) VALUES
  ('p0000001-0001-0001-0001-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '101/A', 'SRV-894', 'Aarav Sharma', 450.00, 468.40, 'Residential',
   ST_GeomFromText('POLYGON((77.2090 28.6139, 77.2096 28.6139, 77.2096 28.6145, 77.2090 28.6145, 77.2090 28.6139))', 4326), 'Conflict'),

  ('p0000002-0002-0002-0002-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '101/B', 'SRV-895', 'Vikram Mehta', 520.00, 501.60, 'Mixed',
   ST_GeomFromText('POLYGON((77.2095 28.6139, 77.2102 28.6139, 77.2102 28.6145, 77.2095 28.6145, 77.2095 28.6139))', 4326), 'Conflict'),

  ('p0000003-0003-0003-0003-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '102', 'SRV-896', 'Priya Iyer', 610.00, 605.20, 'Residential',
   ST_GeomFromText('POLYGON((77.2102 28.6139, 77.2110 28.6139, 77.2110 28.6147, 77.2102 28.6147, 77.2102 28.6139))', 4326), 'Reconciled'),

  ('p0000004-0004-0004-0004-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '103/A', 'SRV-897', 'Rajesh Kumar', 380.00, 375.50, 'Commercial',
   ST_GeomFromText('POLYGON((77.2085 28.6147, 77.2092 28.6147, 77.2092 28.6153, 77.2085 28.6153, 77.2085 28.6147))', 4326), 'Unverified'),

  ('p0000005-0005-0005-0005-000000000005', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '104', 'SRV-898', 'Meena Devi', 720.00, 718.30, 'Agricultural',
   ST_GeomFromText('POLYGON((77.2092 28.6147, 77.2105 28.6147, 77.2105 28.6158, 77.2092 28.6158, 77.2092 28.6147))', 4326), 'Approved')
ON CONFLICT (id) DO NOTHING;

-- Buildings
INSERT INTO buildings (id, parcel_id, building_name, total_floors, base_elevation_m, total_height_m, footprint_geom, source_dataset_id) VALUES
  ('b0000001-0001-0001-0001-000000000001', 'p0000001-0001-0001-0001-000000000001', 'Sharma Residence', 3, 0.0, 9.50,
   ST_GeomFromText('POLYGON((77.2091 28.6140, 77.2095 28.6140, 77.2095 28.6144, 77.2091 28.6144, 77.2091 28.6140))', 4326),
   'd1a1a1a1-1111-1111-1111-111111111111'),

  ('b0000002-0002-0002-0002-000000000002', 'p0000002-0002-0002-0002-000000000002', 'Mehta Commercial Complex', 5, 0.0, 16.20,
   ST_GeomFromText('POLYGON((77.2096 28.6140, 77.2101 28.6140, 77.2101 28.6144, 77.2096 28.6144, 77.2096 28.6140))', 4326),
   'd1a1a1a1-1111-1111-1111-111111111111'),

  ('b0000003-0003-0003-0003-000000000003', 'p0000003-0003-0003-0003-000000000003', 'Iyer Villa', 2, 0.0, 7.00,
   ST_GeomFromText('POLYGON((77.2103 28.6140, 77.2108 28.6140, 77.2108 28.6145, 77.2103 28.6145, 77.2103 28.6140))', 4326),
   'd1a1a1a1-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- Property Units
INSERT INTO property_units (id, building_id, unit_identifier, floor_level, unit_type, carpet_area_sqft, built_up_area_sqft, super_built_up_area_sqft, bbox_min_x, bbox_min_y, bbox_min_z, bbox_max_x, bbox_max_y, bbox_max_z, owner_name, registry_deed_number, share_percentage, status) VALUES
  ('u0000001-0001-0001-0001-000000000001', 'b0000001-0001-0001-0001-000000000001', 'Flat 101-A', 1, 'Apartment', 1150.00, 1320.00, 1550.00, 0, 0, 0, 15, 12, 3, 'Aarav Sharma', 'DEED-2021-9982', 100.0, 'Compliant'),
  ('u0000002-0002-0002-0002-000000000002', 'b0000001-0001-0001-0001-000000000001', 'Flat 201-A', 2, 'Apartment', 1150.00, 1320.00, 1550.00, 0, 0, 3, 15, 12, 6, 'Rohan Verma', 'DEED-2022-1044', 100.0, 'Compliant'),
  ('u0000003-0003-0003-0003-000000000003', 'b0000001-0001-0001-0001-000000000001', 'Flat 301-A', 3, 'Apartment', 1100.00, 1280.00, 1480.00, 0, 0, 6, 15, 12, 9, 'Sanjay Gupta', 'DEED-2023-0112', 100.0, 'Compliant'),
  ('u0000004-0004-0004-0004-000000000004', 'b0000002-0002-0002-0002-000000000002', 'Shop G-1', 0, 'Retail', 800.00, 950.00, 1100.00, 0, 0, 0, 20, 10, 3.5, 'Vikram Mehta', 'DEED-2019-7821', 100.0, 'Disputed'),
  ('u0000005-0005-0005-0005-000000000005', 'b0000002-0002-0002-0002-000000000002', 'Office 201', 2, 'Commercial_Office', 1400.00, 1600.00, 1900.00, 0, 0, 3.5, 20, 10, 7, 'TechStart Pvt Ltd', 'DEED-2020-3345', 100.0, 'Compliant'),
  ('u0000006-0006-0006-0006-000000000006', 'b0000002-0002-0002-0002-000000000002', 'Parking B1', -1, 'Parking', 2000.00, 2200.00, 2200.00, 0, 0, -3, 20, 10, 0, 'Mehta Complex Society', 'DEED-2019-7821', 100.0, 'Encroachment')
ON CONFLICT (id) DO NOTHING;

-- Easements
INSERT INTO easements (id, project_id, name, easement_type, buffer_width_meters, encumbered_parcel_ids, geom, status) VALUES
  ('e0000001-0001-0001-0001-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sector 45 Public Drainage & Passage', 'DRAINAGE', 3.5,
   ARRAY['p0000002-0002-0002-0002-000000000002'::UUID],
   ST_GeomFromText('LINESTRING(77.2094 28.6138, 77.2094 28.6146)', 4326), 'ACTIVE_RESTRICTION'),

  ('e0000002-0002-0002-0002-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Internal Access Road', 'ACCESS_ROAD', 5.0,
   ARRAY['p0000001-0001-0001-0001-000000000001'::UUID, 'p0000002-0002-0002-0002-000000000002'::UUID],
   ST_GeomFromText('LINESTRING(77.2088 28.6142, 77.2104 28.6142)', 4326), 'ACTIVE_RESTRICTION')
ON CONFLICT (id) DO NOTHING;

-- Conflicts
INSERT INTO conflicts (id, project_id, category, severity, title, description, affected_parcel_ids, overlap_area_sqm, encroachment_distance_m, cadastral_source, lidar_source, registry_deed_ref, confidence_score, resolution_status,
  violation_geom) VALUES
  ('c0000001-0001-0001-0001-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'BOUNDARY_OVERLAP', 'HIGH',
   'Khasra 101/A & 101/B Boundary Overlap',
   'Calculated 18.4 sqm overlapping polygon detected between cadastral deed claim and processed LiDAR footprint. The eastern boundary of 101/A extends 1.25m into the western boundary of 101/B.',
   ARRAY['p0000001-0001-0001-0001-000000000001'::UUID, 'p0000002-0002-0002-0002-000000000002'::UUID],
   18.40, 1.25,
   'Delhi Revenue Map SRV-894', 'DJI Zenmuse L2 LiDAR Survey 2024', 'REG-DL-2018-8831', 0.96, 'OPEN',
   ST_GeomFromText('POLYGON((77.2095 28.6139, 77.2096 28.6139, 77.2096 28.6145, 77.2095 28.6145, 77.2095 28.6139))', 4326)),

  ('c0000002-0002-0002-0002-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'EASEMENT_ENCROACHMENT', 'WARNING',
   'Drainage Easement Encroachment by 101/B',
   'Building footprint of Mehta Commercial Complex encroaches 2.1m into the 3.5m drainage easement buffer zone along the western edge.',
   ARRAY['p0000002-0002-0002-0002-000000000002'::UUID],
   12.00, 2.10,
   'Municipal Easement Register', 'DJI Zenmuse L2 LiDAR Survey 2024', 'EASE-2015-0451', 0.91, 'UNDER_REVIEW',
   NULL),

  ('c0000003-0003-0003-0003-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'DEED_AREA_DISCREPANCY', 'INFO',
   'Khasra 101/A Area Discrepancy',
   'Deed claims 450 sqm but LiDAR-calculated area is 468.4 sqm (4.1% over-claim). Within acceptable municipal tolerance.',
   ARRAY['p0000001-0001-0001-0001-000000000001'::UUID],
   NULL, NULL,
   'Delhi Revenue Map SRV-894', 'DJI Zenmuse L2 LiDAR Survey 2024', 'REG-DL-2018-8831', 0.98, 'OPEN',
   NULL)
ON CONFLICT (id) DO NOTHING;

-- Evidence
INSERT INTO evidence (id, conflict_id, source_dataset_id, evidence_type, title, description, reference_uri) VALUES
  ('ev000001-0001-0001-0001-000000000001', 'c0000001-0001-0001-0001-000000000001', 'd1a1a1a1-1111-1111-1111-111111111111', 'LIDAR_SCAN',
   'LiDAR Point Cloud — Sector 45', 'DJI Zenmuse L2 aerial LiDAR survey from January 2024 covering all parcels in Sector 45.', NULL),
  ('ev000002-0002-0002-0002-000000000002', 'c0000001-0001-0001-0001-000000000001', 'd2a2a2a2-2222-2222-2222-222222222222', 'CADASTRAL_MAP',
   'Revenue Map SRV-894', 'Official Delhi Revenue Department cadastral map for khasra numbers 101/A through 104.', NULL),
  ('ev000003-0003-0003-0003-000000000003', 'c0000001-0001-0001-0001-000000000001', 'd3a3a3a3-3333-3333-3333-333333333333', 'REGISTRY_DEED',
   'Registration Deed REG-DL-2018-8831', 'Registered sale deed for khasra 101/A in favour of Aarav Sharma dated 14-Mar-2018.', NULL),
  ('ev000004-0004-0004-0004-000000000004', 'c0000002-0002-0002-0002-000000000002', NULL, 'COMPUTED',
   'Computed Easement Buffer Intersection', 'Automatically computed intersection between building footprint and 3.5m drainage easement buffer.', NULL)
ON CONFLICT (id) DO NOTHING;
