-- ============================================================
-- Salaahkaar Spatial Verification Platform — PostgreSQL Schema
-- Requires: PostGIS 3.x, uuid-ossp
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────────────────────
-- 1. Projects
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    region VARCHAR(100) NOT NULL,
    crs VARCHAR(50) DEFAULT 'EPSG:4326',
    status VARCHAR(50) DEFAULT 'DATA_INTAKE',
    total_parcels INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────
-- 2. Source Datasets (uploaded files)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS source_datasets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    filename VARCHAR(500) NOT NULL,
    original_name VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100),
    size_bytes BIGINT DEFAULT 0,
    dataset_type VARCHAR(50) NOT NULL
        CHECK (dataset_type IN ('POINTCLOUD','CADASTRAL_PARCEL','BUILDING_FOOTPRINT','REGISTRY_DEED','SURVEY_MAP','OTHER')),
    status VARCHAR(50) DEFAULT 'UPLOADED'
        CHECK (status IN ('UPLOADED','VALIDATING','READY','PROCESSING','FAILED')),
    record_count INT,
    crs VARCHAR(50),
    uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────
-- 3. Parcels (2D cadastre + PostGIS geometry)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS parcels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    khasra_number VARCHAR(100) NOT NULL,
    survey_number VARCHAR(100),
    owner_name VARCHAR(255) NOT NULL,
    claimed_area_sqm NUMERIC(12, 2) NOT NULL,
    calculated_area_sqm NUMERIC(12, 2),
    zoning_type VARCHAR(50) DEFAULT 'Residential'
        CHECK (zoning_type IN ('Residential','Commercial','Agricultural','Mixed','Industrial')),
    geom GEOMETRY(Polygon, 4326),
    status VARCHAR(50) DEFAULT 'Unverified'
        CHECK (status IN ('Unverified','Processing','Conflict','Reconciled','Approved')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_parcels_geom ON parcels USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_parcels_project ON parcels (project_id);

-- ──────────────────────────────────────────────────────────────
-- 4. Buildings and 3D Volumetric Extrusions
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID REFERENCES parcels(id) ON DELETE CASCADE,
    building_name VARCHAR(255),
    total_floors INT DEFAULT 1,
    base_elevation_m NUMERIC(8, 2) DEFAULT 0.0,
    total_height_m NUMERIC(8, 2) NOT NULL,
    footprint_geom GEOMETRY(Polygon, 4326),
    source_dataset_id UUID REFERENCES source_datasets(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_buildings_footprint ON buildings USING GIST (footprint_geom);
CREATE INDEX IF NOT EXISTS idx_buildings_parcel ON buildings (parcel_id);

-- ──────────────────────────────────────────────────────────────
-- 5. Property Units (Strata / 3D Sub-units)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS property_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    unit_identifier VARCHAR(100) NOT NULL,
    floor_level INT NOT NULL,
    unit_type VARCHAR(50) DEFAULT 'Apartment'
        CHECK (unit_type IN ('Apartment','Commercial_Office','Retail','Common_Area','Parking')),
    carpet_area_sqft NUMERIC(10, 2),
    built_up_area_sqft NUMERIC(10, 2),
    super_built_up_area_sqft NUMERIC(10, 2),
    bbox_min_x NUMERIC(10, 4),
    bbox_min_y NUMERIC(10, 4),
    bbox_min_z NUMERIC(8, 2),
    bbox_max_x NUMERIC(10, 4),
    bbox_max_y NUMERIC(10, 4),
    bbox_max_z NUMERIC(8, 2),
    owner_name VARCHAR(255),
    registry_deed_number VARCHAR(100),
    share_percentage NUMERIC(5, 2) DEFAULT 100.0,
    status VARCHAR(50) DEFAULT 'Compliant'
        CHECK (status IN ('Compliant','Disputed','Easement_Violation','Encroachment')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────
-- 6. Detected Spatial & Cadastral Conflicts
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL
        CHECK (category IN ('BOUNDARY_OVERLAP','EASEMENT_ENCROACHMENT','HEIGHT_LIMIT_VIOLATION','SETBACK_VIOLATION','DEED_AREA_DISCREPANCY','MULTIPLE_TITLE_CLAIMS')),
    severity VARCHAR(20) DEFAULT 'WARNING'
        CHECK (severity IN ('INFO','WARNING','HIGH','CRITICAL')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    affected_parcel_ids UUID[] NOT NULL,
    affected_unit_ids UUID[],
    overlap_area_sqm NUMERIC(10, 2),
    encroachment_distance_m NUMERIC(8, 2),
    violation_geom GEOMETRY(Polygon, 4326),
    cadastral_source VARCHAR(255),
    lidar_source VARCHAR(255),
    registry_deed_ref VARCHAR(255),
    confidence_score NUMERIC(5, 2) DEFAULT 0.95,
    resolution_status VARCHAR(50) DEFAULT 'OPEN'
        CHECK (resolution_status IN ('OPEN','UNDER_REVIEW','ADJUDICATED','DISMISSED')),
    detected_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_conflicts_project ON conflicts (project_id);

-- ──────────────────────────────────────────────────────────────
-- 7. Evidence (links sources to conflicts)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conflict_id UUID REFERENCES conflicts(id) ON DELETE CASCADE,
    source_dataset_id UUID REFERENCES source_datasets(id) ON DELETE SET NULL,
    evidence_type VARCHAR(50) NOT NULL
        CHECK (evidence_type IN ('LIDAR_SCAN','CADASTRAL_MAP','REGISTRY_DEED','SURVEY_REPORT','PHOTOGRAPH','COMPUTED')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    reference_uri VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────
-- 8. Easements
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS easements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    easement_type VARCHAR(50) NOT NULL
        CHECK (easement_type IN ('DRAINAGE','ACCESS_ROAD','PIPELINE','POWER_LINE','RIGHT_OF_WAY','OTHER')),
    buffer_width_meters NUMERIC(8, 2) NOT NULL,
    encumbered_parcel_ids UUID[],
    geom GEOMETRY(LineString, 4326),
    status VARCHAR(50) DEFAULT 'ACTIVE_RESTRICTION'
        CHECK (status IN ('ACTIVE_RESTRICTION','PENDING_REVIEW','LIFTED')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_easements_geom ON easements USING GIST (geom);

-- ──────────────────────────────────────────────────────────────
-- 9. Verifications / Adjudications Audit Trail
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conflict_id UUID REFERENCES conflicts(id) ON DELETE SET NULL,
    parcel_id UUID REFERENCES parcels(id) ON DELETE CASCADE,
    officer_id VARCHAR(100) NOT NULL,
    officer_name VARCHAR(255) NOT NULL,
    decision VARCHAR(100) NOT NULL
        CHECK (decision IN ('APPROVE_AS_SURVEYED','ENFORCE_DEED_BOUNDARY','REQUEST_FIELD_RE_SURVEY','ISSUE_ENCROACHMENT_NOTICE','ADJUST_EASEMENT')),
    notes TEXT,
    stipulated_conditions TEXT[],
    signature_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_verifications_parcel ON verifications (parcel_id);
CREATE INDEX IF NOT EXISTS idx_verifications_conflict ON verifications (conflict_id);
