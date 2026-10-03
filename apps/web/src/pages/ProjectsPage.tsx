import React, { useEffect, useState } from 'react';
import { Plus, FolderGit2, ArrowRight, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../services/projects.api';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Project State
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', region: '', crs: 'EPSG:4326' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const DEMO_PROJECTS = [
    {
      id: 'demo-bengaluru-01',
      name: 'Bengaluru IT Corridor Strata Reconciliation',
      description: 'Controlled demo for 3D building, floor strata, and cadastral parcel reconciliation.',
      region: 'Bengaluru, Karnataka (Whitefield)',
      crs: 'EPSG:4326',
      total_parcels: 14,
      status: 'RECONCILED'
    },
    {
      id: 'demo-mumbai-02',
      name: 'Mumbai Suburban Land & Strata Audit',
      description: 'High-density vertical parcel separation and easement encroachment check.',
      region: 'Mumbai, Maharashtra',
      crs: 'EPSG:4326',
      total_parcels: 28,
      status: 'CONFLICT_DETECTED'
    }
  ];

  const fetchProjects = () => {
    setLoading(true);
    const stored = localStorage.getItem('local_projects');
    const localList: any[] = stored ? JSON.parse(stored) : [];

    projectsApi.list()
      .then(data => {
        if (data && data.length > 0) {
          setProjects([...localList, ...data]);
        } else {
          setProjects([...localList, ...DEMO_PROJECTS]);
        }
      })
      .catch(err => {
        console.warn("Using offline demo projects:", err);
        setProjects([...localList, ...DEMO_PROJECTS]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const openWorkspace = (projectId: string) => {
    localStorage.setItem('activeProjectId', projectId);
    navigate('/app');
  };

  const handleCreate = async () => {
    if (!newProject.name || !newProject.region) return;
    setCreating(true);
    try {
      const data = await projectsApi.create(newProject);
      if (data && data.id) {
        setShowModal(false);
        setNewProject({ name: '', description: '', region: '', crs: 'EPSG:4326' });
        openWorkspace(data.id);
        return;
      }
    } catch (err) {
      console.warn("Backend API unavailable, creating project locally in workspace:", err);
    }
    
    // Graceful offline creation
    const localId = 'proj-' + Date.now();
    const created = {
      id: localId,
      name: newProject.name,
      description: newProject.description || 'Spatial verification & cadastre workspace.',
      region: newProject.region,
      crs: newProject.crs || 'EPSG:4326',
      total_parcels: 0,
      status: 'DATA_INTAKE',
      created_at: new Date().toISOString()
    };
    
    try {
      const stored = localStorage.getItem('local_projects');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(created);
      localStorage.setItem('local_projects', JSON.stringify(list));
      localStorage.setItem(`proj_${localId}`, JSON.stringify(created));
    } catch (e) {
      console.error(e);
    }

    setProjects(prev => [created, ...prev]);
    setShowModal(false);
    setNewProject({ name: '', description: '', region: '', crs: 'EPSG:4326' });
    setCreating(false);
    openWorkspace(localId);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h2 className="page-title">Projects</h2>
          <p className="page-subtitle">Manage spatial cadastre workspaces and processing sessions.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} />
          New project
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', color: '#64748B' }}>
          <Loader2 size={24} className="animate-spin" />
          <span style={{ marginLeft: '10px' }}>Loading projects...</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {projects.map((p) => (
            <div key={p.id} className="card-panel" style={{ cursor: 'pointer' }} onClick={() => openWorkspace(p.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 6, backgroundColor: '#E6F6F3', color: '#0D7A68', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FolderGit2 size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>{p.name}</h3>
                      <span className="badge badge-ready">{p.status}</span>
                    </div>
                    <p className="section-desc" style={{ marginTop: '2px' }}>{p.description || 'No description provided.'}</p>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.75rem', color: '#64748B' }}>
                      <span>CRS: {p.crs}</span>
                      <span>Parcels: {p.total_parcels}</span>
                      <span>Region: {p.region}</span>
                    </div>
                  </div>
                </div>

                <button className="btn-secondary" style={{ fontSize: '0.78rem' }} onClick={(e) => { e.stopPropagation(); openWorkspace(p.id); }}>
                  Open Workspace <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
             <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
               No projects found. Create one to get started.
             </div>
          )}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="card-panel" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
            >
              <X size={20} />
            </button>
            <h3 className="section-title" style={{ marginBottom: '16px' }}>Create New Project</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Project Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                  placeholder="e.g. Downtown Sector B"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Description</label>
                <textarea 
                  className="form-input" 
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                  placeholder="Optional description"
                  style={{ minHeight: '60px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Region *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newProject.region}
                    onChange={e => setNewProject({...newProject, region: e.target.value})}
                    placeholder="e.g. New York, NY"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>CRS</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newProject.crs}
                    onChange={e => setNewProject({...newProject, crs: e.target.value})}
                    placeholder="EPSG:4326"
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn-secondary" onClick={() => setShowModal(false)} disabled={creating}>Cancel</button>
              <button className="btn-primary" onClick={handleCreate} disabled={creating || !newProject.name || !newProject.region}>
                {creating ? <Loader2 size={16} className="animate-spin" /> : 'Create Workspace'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
