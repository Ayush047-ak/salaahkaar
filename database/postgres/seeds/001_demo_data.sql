-- Demo Project
INSERT INTO projects (id, name, region, crs, status)
VALUES ('77a5e840-a19c-497d-a191-8933b934ea20', 'Sector 45 Urban Cadastre', 'Delhi NCR', 'EPSG:4326', 'CONFLICT_GRAPHING')
ON CONFLICT (id) DO NOTHING;
