import { queryPostgres } from '../integrations/postgres.client';

export interface PropertyUnitRow {
  id: string;
  building_id: string;
  unit_identifier: string;
  floor_level: number;
  unit_type: string;
  carpet_area_sqft: number | null;
  built_up_area_sqft: number | null;
  super_built_up_area_sqft: number | null;
  bbox_min_x: number | null;
  bbox_min_y: number | null;
  bbox_min_z: number | null;
  bbox_max_x: number | null;
  bbox_max_y: number | null;
  bbox_max_z: number | null;
  owner_name: string | null;
  registry_deed_number: string | null;
  share_percentage: number;
  status: string;
  created_at: string;
}

export interface BuildingRow {
  id: string;
  parcel_id: string;
  building_name: string | null;
  total_floors: number;
  base_elevation_m: number;
  total_height_m: number;
  footprint_geojson: any;
  created_at: string;
}

export class PropertyRepository {
  async getBuildingsByParcelId(parcelId: string): Promise<BuildingRow[]> {
    const result = await queryPostgres(
      `SELECT id, parcel_id, building_name, total_floors,
              base_elevation_m, total_height_m,
              ST_AsGeoJSON(footprint_geom)::json as footprint_geojson,
              created_at
       FROM buildings WHERE parcel_id = $1
       ORDER BY building_name`,
      [parcelId]
    );
    return result.rows;
  }

  async getUnitsByBuildingId(buildingId: string): Promise<PropertyUnitRow[]> {
    const result = await queryPostgres(
      `SELECT * FROM property_units
       WHERE building_id = $1
       ORDER BY floor_level, unit_identifier`,
      [buildingId]
    );
    return result.rows;
  }

  async getUnitsByProjectId(projectId: string): Promise<(PropertyUnitRow & { parcel_id: string })[]> {
    const result = await queryPostgres(
      `SELECT pu.*, b.parcel_id
       FROM property_units pu
       JOIN buildings b ON pu.building_id = b.id
       JOIN parcels p ON b.parcel_id = p.id
       WHERE p.project_id = $1
       ORDER BY pu.floor_level, pu.unit_identifier`,
      [projectId]
    );
    return result.rows;
  }

  async getBuildingById(id: string): Promise<BuildingRow | null> {
    const result = await queryPostgres(
      `SELECT id, parcel_id, building_name, total_floors,
              base_elevation_m, total_height_m,
              ST_AsGeoJSON(footprint_geom)::json as footprint_geojson,
              created_at
       FROM buildings WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async getUnitById(id: string): Promise<PropertyUnitRow | null> {
    const result = await queryPostgres(
      `SELECT * FROM property_units WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }
}
