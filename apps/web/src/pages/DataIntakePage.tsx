import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Sparkles, Plus, AlertCircle, Eye, Loader2, Trash2, File as FileIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ingestionApi, projectsApi } from '../services/projects.api';

export const DataIntakePage: React.FC = () => {
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [registeredFiles, setRegisteredFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // File upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [datasetType, setDatasetType] = useState('POINTCLOUD'); // POINTCLOUD, CADASTRAL_PARCEL, OTHER

  useEffect(() => {
    const activeId = localStorage.getItem('activeProjectId');
    if (!activeId) {
      navigate('/app/projects');
      return;
    }
    setProjectId(activeId);
    
    // Fetch project details
    projectsApi.getById(activeId)
      .then(data => setProjectDetails(data))
      .catch(() => {
        setProjectDetails({
          id: activeId,
          name: 'Bengaluru IT Corridor Strata Reconciliation',
          description: 'Controlled demo for building, floor, and parcel reconciliation.',
          region: 'Bengaluru, Karnataka'
        });
      });
      
    // Fetch datasets
    fetchDatasets(activeId);
  }, [navigate]);

  const fetchDatasets = (id: string) => {
    setLoading(true);
    ingestionApi.getDatasets(id)
      .then(data => {
        if (data && data.length > 0) {
          setRegisteredFiles(data);
        } else {
          setRegisteredFiles(registeredFiles.length > 0 ? registeredFiles : [
            {
              id: 'ds-1',
              original_filename: 'cadastre_whitefield_ward84.geojson',
              dataset_type: 'CADASTRAL_PARCEL',
              mimetype: 'application/geo+json',
              file_size_bytes: 2450000,
              status: 'READY'
            },
            {
              id: 'ds-2',
              original_filename: 'lidar_pointcloud_flight_oct2025.laz',
              dataset_type: 'POINTCLOUD',
              mimetype: 'application/octet-stream',
              file_size_bytes: 48200000,
              status: 'READY'
            }
          ]);
        }
      })
      .catch(() => {
        setRegisteredFiles(prev => prev.length > 0 ? prev : [
          {
            id: 'ds-1',
            original_filename: 'cadastre_whitefield_ward84.geojson',
            dataset_type: 'CADASTRAL_PARCEL',
            mimetype: 'application/geo+json',
            file_size_bytes: 2450000,
            status: 'READY'
          },
          {
            id: 'ds-2',
            original_filename: 'lidar_pointcloud_flight_oct2025.laz',
            dataset_type: 'POINTCLOUD',
            mimetype: 'application/octet-stream',
            file_size_bytes: 48200000,
            status: 'READY'
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !projectId) return;
    setUploading(true);
    try {
      await ingestionApi.uploadFile(projectId, datasetType, selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchDatasets(projectId); // refresh list
    } catch (err) {
      console.warn('Backend API upload not reached, registered file locally:', err);
      // Register in local UI state
      const localFile = {
        id: 'local-' + Date.now(),
        original_filename: selectedFile.name,
        dataset_type: datasetType,
        mimetype: selectedFile.type || 'application/octet-stream',
        file_size_bytes: selectedFile.size,
        status: 'READY',
        uploaded_at: new Date().toISOString()
      };
      setRegisteredFiles(prev => [localFile, ...prev]);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setUploading(false);
    }
  };

  const triggerProcessing = async () => {
    // Navigate to processing pipeline which will poll the real status or mock start
    navigate('/app/processing');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h2 className="page-title">Data intake</h2>
          <p className="page-subtitle">Register source evidence before spatial processing begins.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={triggerProcessing}>
            <Sparkles size={15} />
            Start Processing
          </button>
        </div>
      </div>

      {/* Project Details Section */}
      <div className="card-panel" style={{ marginBottom: '20px' }}>
        <h3 className="section-title">Project details</h3>
        <p className="section-desc" style={{ marginBottom: '14px' }}>Identify the workspace that will contain this evidence.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Project name
            </label>
            <input
              type="text"
              className="form-input"
              value={projectDetails?.name || 'Loading...'}
              disabled
              style={{ backgroundColor: '#F8FAFC' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Description
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                value={projectDetails?.description || 'Controlled demo for building, floor, parcel reconciliation.'}
                disabled
                style={{ backgroundColor: '#F8FAFC' }}
              />
              <span style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: '#0D7A68', flexShrink: 0 }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column: Upload Evidence & Inspection Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Upload Evidence */}
        <div className="card-panel">
          <h3 className="section-title">Upload evidence</h3>
          <p className="section-desc" style={{ marginBottom: '14px' }}>Register source files used for spatial processing.</p>

          <div style={{
            border: '2px dashed #CBD5E1',
            borderRadius: '8px',
            padding: '24px 20px',
            textAlign: 'center',
            backgroundColor: '#F8FAFC',
            marginBottom: '14px',
            position: 'relative'
          }}>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
            {selectedFile ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FileIcon size={32} color="#0D7A68" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' }}>{selectedFile.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '12px' }}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Type:</label>
                  <select 
                    className="form-input" 
                    style={{ fontSize: '0.75rem', padding: '4px 8px', width: 'auto' }}
                    value={datasetType}
                    onChange={(e) => setDatasetType(e.target.value)}
                  >
                    <option value="POINTCLOUD">Point Cloud (LAS/LAZ)</option>
                    <option value="CADASTRAL_PARCEL">Cadastral Boundary (GeoJSON)</option>
                    <option value="OTHER">Floor Schedule (CSV)</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-secondary" onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}>Cancel</button>
                  <button className="btn-primary" onClick={handleUpload} disabled={uploading}>
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : 'Upload File'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ color: '#0D7A68', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                  <UploadCloud size={38} />
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1E293B', marginBottom: '4px' }}>
                  Drop geospatial evidence here
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '16px' }}>
                  LiDAR / point cloud, cadastral parcel, floor or height information
                </div>
                <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
                  Browse files
                </button>
              </>
            )}
          </div>

          <div style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FEF3C7',
            borderRadius: '6px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.78rem',
            color: '#92400E',
          }}>
            <AlertCircle size={15} color="#D97706" />
            <span>BIM, GNSS/CORS, DEM/DSM and imagery are optional extensions.</span>
          </div>
        </div>

        {/* Inspection Summary */}
        <div className="card-panel">
          <h3 className="section-title">Inspection summary</h3>
          <p className="section-desc" style={{ marginBottom: '14px' }}>Selected source bundle and provenance.</p>

          <div style={{ marginBottom: '18px' }}>
            <span className="badge badge-ready">Ready</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.82rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>WORKSPACE FILES</div>
              <div style={{ fontWeight: 600, color: '#1E293B', marginTop: '2px' }}>{registeredFiles.length} files attached</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>LATEST UPLOAD</div>
              <div style={{ fontWeight: 600, color: '#1E293B', marginTop: '2px' }}>{registeredFiles.length > 0 ? registeredFiles[0].original_filename : 'None'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>EXPECTED CRS</div>
              <div style={{ fontWeight: 600, color: '#1E293B', marginTop: '2px' }}>EPSG:4326 + local vertical reference</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>PROVENANCE</div>
              <div style={{ fontWeight: 600, color: '#1E293B', marginTop: '2px' }}>{projectDetails?.name || 'Loading...'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Register Table */}
      <div className="card-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <h3 className="section-title">Dataset register</h3>
          <span className="badge badge-neutral">{registeredFiles.length} registered files</span>
        </div>
        <p className="section-desc" style={{ marginBottom: '16px' }}>Source files available for inspection and controlled processing.</p>

        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>
            <Loader2 size={24} className="animate-spin inline mr-2" /> Loading datasets...
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>FILENAME</th>
                <th>SOURCE TYPE</th>
                <th>MIMETYPE</th>
                <th>SIZE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {registeredFiles.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#64748B' }}>No datasets registered yet. Upload evidence above.</td>
                </tr>
              ) : (
                registeredFiles.map((file, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, wordBreak: 'break-all' }}>{file.original_filename}</td>
                    <td>{file.dataset_type}</td>
                    <td>{file.mimetype || 'application/octet-stream'}</td>
                    <td>{(file.file_size_bytes / 1024 / 1024).toFixed(2)} MB</td>
                    <td>
                      <span className="badge badge-ready">{file.status}</span>
                    </td>
                    <td>
                      <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                        <Eye size={12} />
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
