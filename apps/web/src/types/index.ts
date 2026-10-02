export * from '@salaahkaar/shared-contracts';

export interface UIState {
  sidebarOpen: boolean;
  selectedParcelId: string | null;
  activeLayer: '3d_mesh' | 'cadastre_2d' | 'conflict_graph';
}
