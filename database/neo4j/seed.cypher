// ============================================================
// Salaahkaar — Neo4j Graph Seed (rich topology)
// ============================================================

// --- Parcels ---
MERGE (p1:Parcel {id: 'p0000001-0001-0001-0001-000000000001', khasraNumber: '101/A', ownerName: 'Aarav Sharma', areaSqM: 450.0, zoningType: 'Residential', status: 'Conflict', projectId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'})
MERGE (p2:Parcel {id: 'p0000002-0002-0002-0002-000000000002', khasraNumber: '101/B', ownerName: 'Vikram Mehta', areaSqM: 520.0, zoningType: 'Mixed', status: 'Conflict', projectId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'})
MERGE (p3:Parcel {id: 'p0000003-0003-0003-0003-000000000003', khasraNumber: '102', ownerName: 'Priya Iyer', areaSqM: 610.0, zoningType: 'Residential', status: 'Reconciled', projectId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'})
MERGE (p4:Parcel {id: 'p0000004-0004-0004-0004-000000000004', khasraNumber: '103/A', ownerName: 'Rajesh Kumar', areaSqM: 380.0, zoningType: 'Commercial', status: 'Unverified', projectId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'})
MERGE (p5:Parcel {id: 'p0000005-0005-0005-0005-000000000005', khasraNumber: '104', ownerName: 'Meena Devi', areaSqM: 720.0, zoningType: 'Agricultural', status: 'Approved', projectId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'})

// --- Buildings ---
MERGE (b1:Building {id: 'b0000001-0001-0001-0001-000000000001', name: 'Sharma Residence', floors: 3, heightM: 9.5})
MERGE (b2:Building {id: 'b0000002-0002-0002-0002-000000000002', name: 'Mehta Commercial Complex', floors: 5, heightM: 16.2})
MERGE (b3:Building {id: 'b0000003-0003-0003-0003-000000000003', name: 'Iyer Villa', floors: 2, heightM: 7.0})

// --- Units ---
MERGE (u1:Unit {id: 'u0000001-0001-0001-0001-000000000001', identifier: 'Flat 101-A', floor: 1, type: 'Apartment', status: 'Compliant'})
MERGE (u2:Unit {id: 'u0000002-0002-0002-0002-000000000002', identifier: 'Flat 201-A', floor: 2, type: 'Apartment', status: 'Compliant'})
MERGE (u3:Unit {id: 'u0000003-0003-0003-0003-000000000003', identifier: 'Flat 301-A', floor: 3, type: 'Apartment', status: 'Compliant'})
MERGE (u4:Unit {id: 'u0000004-0004-0004-0004-000000000004', identifier: 'Shop G-1', floor: 0, type: 'Retail', status: 'Disputed'})
MERGE (u5:Unit {id: 'u0000005-0005-0005-0005-000000000005', identifier: 'Office 201', floor: 2, type: 'Commercial_Office', status: 'Compliant'})
MERGE (u6:Unit {id: 'u0000006-0006-0006-0006-000000000006', identifier: 'Parking B1', floor: -1, type: 'Parking', status: 'Encroachment'})

// --- Easement Paths ---
MERGE (e1:EasementPath {id: 'e0000001-0001-0001-0001-000000000001', name: 'Sector 45 Public Drainage & Passage', easementType: 'DRAINAGE', widthMeters: 3.5})
MERGE (e2:EasementPath {id: 'e0000002-0002-0002-0002-000000000002', name: 'Internal Access Road', easementType: 'ACCESS_ROAD', widthMeters: 5.0})

// --- Legal Entities ---
MERGE (le1:LegalEntity {id: 'le-001', name: 'Aarav Sharma', entityType: 'INDIVIDUAL'})
MERGE (le2:LegalEntity {id: 'le-002', name: 'Vikram Mehta', entityType: 'INDIVIDUAL'})
MERGE (le3:LegalEntity {id: 'le-003', name: 'Priya Iyer', entityType: 'INDIVIDUAL'})
MERGE (le4:LegalEntity {id: 'le-004', name: 'TechStart Pvt Ltd', entityType: 'COMPANY'})
MERGE (le5:LegalEntity {id: 'le-005', name: 'Mehta Complex Society', entityType: 'SOCIETY'})

// --- Conflicts ---
MERGE (c1:Conflict {id: 'c0000001-0001-0001-0001-000000000001', title: 'Boundary Overlap 101/A & 101/B', severity: 'HIGH', overlapSqM: 18.4})
MERGE (c2:Conflict {id: 'c0000002-0002-0002-0002-000000000002', title: 'Drainage Easement Encroachment', severity: 'WARNING', overlapSqM: 12.0})

// ═══════════════════════════════════════════════════════════════
// RELATIONSHIPS
// ═══════════════════════════════════════════════════════════════

// Parcel adjacency
MERGE (p1)-[:ADJACENT_TO {boundaryLengthMeters: 42.5}]->(p2)
MERGE (p2)-[:ADJACENT_TO {boundaryLengthMeters: 38.0}]->(p3)
MERGE (p1)-[:ADJACENT_TO {boundaryLengthMeters: 28.0}]->(p4)
MERGE (p4)-[:ADJACENT_TO {boundaryLengthMeters: 55.0}]->(p5)

// Buildings on parcels
MERGE (p1)-[:CONTAINS_BUILDING]->(b1)
MERGE (p2)-[:CONTAINS_BUILDING]->(b2)
MERGE (p3)-[:CONTAINS_BUILDING]->(b3)

// Units in buildings
MERGE (b1)-[:CONTAINS_UNIT {floor: 1}]->(u1)
MERGE (b1)-[:CONTAINS_UNIT {floor: 2}]->(u2)
MERGE (b1)-[:CONTAINS_UNIT {floor: 3}]->(u3)
MERGE (b2)-[:CONTAINS_UNIT {floor: 0}]->(u4)
MERGE (b2)-[:CONTAINS_UNIT {floor: 2}]->(u5)
MERGE (b2)-[:CONTAINS_UNIT {floor: -1}]->(u6)

// Ownership
MERGE (le1)-[:OWNS {deedRef: 'DEED-2021-9982', sharePercent: 100}]->(u1)
MERGE (le1)-[:OWNS_PARCEL {deedRef: 'REG-DL-2018-8831'}]->(p1)
MERGE (le2)-[:OWNS {deedRef: 'DEED-2019-7821', sharePercent: 100}]->(u4)
MERGE (le2)-[:OWNS_PARCEL {deedRef: 'REG-DL-2017-6642'}]->(p2)
MERGE (le3)-[:OWNS_PARCEL]->(p3)
MERGE (le4)-[:LEASES {deedRef: 'DEED-2020-3345'}]->(u5)
MERGE (le5)-[:MANAGES]->(u6)

// Conflict relationships
MERGE (p1)-[:ENCROACHES_ON {overlapAreaSqM: 18.4, severity: 'High'}]->(p2)
MERGE (c1)-[:AFFECTS]->(p1)
MERGE (c1)-[:AFFECTS]->(p2)

// Easement relationships
MERGE (p2)-[:SUBJECT_TO_EASEMENT {encumberedAreaSqM: 35.0}]->(e1)
MERGE (c2)-[:AFFECTS]->(p2)
MERGE (c2)-[:INVOLVES_EASEMENT]->(e1)
MERGE (p1)-[:SERVED_BY_ROAD]->(e2)
MERGE (p2)-[:SERVED_BY_ROAD]->(e2)
