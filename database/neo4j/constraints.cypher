// Uniqueness Constraints
CREATE CONSTRAINT parcel_id_unique IF NOT EXISTS
FOR (p:Parcel) REQUIRE p.id IS UNIQUE;

CREATE CONSTRAINT unit_id_unique IF NOT EXISTS
FOR (u:Unit) REQUIRE u.id IS UNIQUE;

CREATE CONSTRAINT easement_id_unique IF NOT EXISTS
FOR (e:EasementPath) REQUIRE e.id IS UNIQUE;

CREATE CONSTRAINT entity_id_unique IF NOT EXISTS
FOR (le:LegalEntity) REQUIRE le.id IS UNIQUE;

CREATE CONSTRAINT conflict_id_unique IF NOT EXISTS
FOR (c:Conflict) REQUIRE c.id IS UNIQUE;

// Indexes for Fast Graph Traversals
CREATE INDEX parcel_khasra_idx IF NOT EXISTS FOR (p:Parcel) ON (p.khasraNumber);
CREATE INDEX parcel_project_idx IF NOT EXISTS FOR (p:Parcel) ON (p.projectId);
