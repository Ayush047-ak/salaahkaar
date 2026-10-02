import { apiFetch } from './api-client';

export const projectsApi = {
  list: () => apiFetch<any[]>('/projects'),
  getById: (id: string) => apiFetch<any>(`/projects/${id}`),
  getStatus: (id: string) => apiFetch<any>(`/projects/${id}/status`),
  create: (payload: any) => apiFetch<any>('/projects', { method: 'POST', body: JSON.stringify(payload) }),
};

export const ingestionApi = {
  uploadFile: async (projectId: string, datasetType: string, file: File) => {
    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('datasetType', datasetType);
    formData.append('file', file);
    
    // We cannot use apiFetch directly because fetch with FormData shouldn't have 'Content-Type': 'application/json'
    const baseUrl = import.meta.env.PROD ? '/api/v1' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1');
    const res = await fetch(`${baseUrl}/ingestion/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
    const data = await res.json();
    return data.data;
  },
  getDatasets: (projectId: string) => apiFetch<any[]>(`/ingestion/project/${projectId}`),
};

export const propertiesApi = {
  getParcels: (projectId: string) => apiFetch<any[]>(`/properties/${projectId}`),
  getBuildings: (parcelId: string) => apiFetch<any[]>(`/properties/parcel/${parcelId}/buildings`),
  getUnits: (projectId: string) => apiFetch<any[]>(`/properties/${projectId}/units`),
  getUnitsForBuilding: (buildingId: string) => apiFetch<any[]>(`/properties/building/${buildingId}/units`),
};

export const graphApi = {
  getGraph: (projectId: string) => apiFetch<any>(`/graph/${projectId}`),
  getConflicts: (projectId: string) => apiFetch<any[]>(`/reconciliation/${projectId}/conflicts`),
};

export const verificationApi = {
  submitDecision: (decisionPayload: any) =>
    apiFetch<any>('/verification/adjudicate', {
      method: 'POST',
      body: JSON.stringify(decisionPayload),
    }),
  getHistory: (parcelId: string) => apiFetch<any[]>(`/verification/history/${parcelId}`),
};
