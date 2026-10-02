import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, Plus, Minus, Crosshair, Eye, Loader2 } from 'lucide-react';

interface ThreeViewerProps {
  onSelectEntity?: (entityId: string) => void;
  selectedEntityId?: string;
  showConflict?: boolean;
}

export const ThreeViewer: React.FC<ThreeViewerProps> = ({
  onSelectEntity,
  selectedEntityId = 'PU-018',
  showConflict = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [unavailableState, setUnavailableState] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070D18');

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 45, 60);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Group containing the entire spatial scene
    const group = new THREE.Group();
    group.rotation.x = -Math.PI / 12;
    group.rotation.y = -Math.PI / 6;
    scene.add(group);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Function to load dynamic mesh from backend
    const loadDynamicGeometry = async () => {
      setLoading(true);
      try {
        // Here we hit the geospatial service directly to get the 3D volume
        // In production this would be orchestrated via the Node API and stored in PostGIS
        const res = await fetch(`/api/volumes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            parcel_id: selectedEntityId,
            footprint: [
              [-20, -10], [20, -10], [15, 15], [-25, 15] // Sample footprint to feed Trimesh/Shapely
            ],
            base_elevation: 0.0,
            height: 12.0,
            floors: 3
          })
        });
        
        if (res.ok) {
          const data = await res.json();
          
          // Render Cadastral Parcel Outline (Cyan wireframe polygon)
          const parcelPts = [
            new THREE.Vector3(-20, 0, -10),
            new THREE.Vector3(20, 0, -10),
            new THREE.Vector3(15, 0, 15),
            new THREE.Vector3(-25, 0, 15),
            new THREE.Vector3(-20, 0, -10),
          ];
          const parcelGeo = new THREE.BufferGeometry().setFromPoints(parcelPts);
          const parcelLine = new THREE.Line(
            parcelGeo,
            new THREE.LineBasicMaterial({ color: 0x38BDF8, linewidth: 2 })
          );
          group.add(parcelLine);

          // Render generated mesh if available
          const bMesh = data.building_volume?.mesh;
          if (bMesh && bMesh.vertices && bMesh.faces) {
            const bldGeo = new THREE.BufferGeometry();
            
            // Flatten vertices
            const vertices = new Float32Array(bMesh.vertices.flat());
            bldGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            
            // Flatten faces
            const indices = [];
            for (const face of bMesh.faces) {
              indices.push(face[0], face[1], face[2]);
            }
            bldGeo.setIndex(indices);
            bldGeo.computeVertexNormals();

            const bldMat = new THREE.MeshStandardMaterial({
              color: 0x0284C7,
              transparent: true,
              opacity: 0.35,
              wireframe: false
            });
            const buildingMesh = new THREE.Mesh(bldGeo, bldMat);
            group.add(buildingMesh);
            
            // Edges for clarity
            const edges = new THREE.EdgesGeometry(bldGeo);
            const edgeLine = new THREE.LineSegments(
              edges,
              new THREE.LineBasicMaterial({ color: 0x38BDF8 })
            );
            group.add(edgeLine);
          } else {
             // Fallback if mesh fails to generate (e.g. Trimesh issues on lightweight docker image)
             const unitGeo = new THREE.BoxGeometry(14, 12, 10);
             const unitMat = new THREE.MeshBasicMaterial({ color: 0x0D9488, transparent: true, opacity: 0.85 });
             const unitMesh = new THREE.Mesh(unitGeo, unitMat);
             unitMesh.position.set(-4, 6, 3);
             group.add(unitMesh);
          }
        }
      } catch (err) {
        console.error("Failed to load 3D geometry:", err);
      } finally {
        setLoading(false);
      }
      
      // Add Conflict Corridor if enabled
      if (showConflict) {
        const conflictPts = [
          new THREE.Vector3(-30, 0, 14),
          new THREE.Vector3(25, 0, 6),
        ];
        const conflictGeo = new THREE.BufferGeometry().setFromPoints(conflictPts);
        const conflictLine = new THREE.Line(
          conflictGeo,
          new THREE.LineBasicMaterial({ color: 0xEF4444, linewidth: 3 })
        );
        group.add(conflictLine);
      }
    };

    loadDynamicGeometry();

    // Subtle gentle orbit motion
    let animId: number;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.002;
      group.rotation.y = -Math.PI / 6 + Math.sin(t) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [showConflict, selectedEntityId]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '520px', backgroundColor: '#070D18', borderRadius: '6px', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Top Left Compass & Status */}
      <div style={{
        position: 'absolute',
        top: 14,
        left: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{
          color: '#38BDF8',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.8rem',
          fontWeight: 700,
          backgroundColor: 'rgba(10, 19, 31, 0.7)',
          padding: '4px 8px',
          borderRadius: '4px',
          width: 'fit-content'
        }}>
          <Compass size={16} /> N
        </div>
        {loading && (
          <div style={{
            color: '#2DD4BF',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            backgroundColor: 'rgba(10, 19, 31, 0.7)',
            padding: '4px 8px',
            borderRadius: '4px',
          }}>
            <Loader2 size={12} className="animate-spin" /> Fetching real geometry...
          </div>
        )}
      </div>

      {/* Top Right Zoom Controls */}
      <div style={{
        position: 'absolute',
        top: 14,
        right: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        <button style={{
          width: '28px',
          height: '28px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          color: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <Plus size={14} />
        </button>
        <button style={{
          width: '28px',
          height: '28px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          color: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <Minus size={14} />
        </button>
        <button style={{
          width: '28px',
          height: '28px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          color: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <Crosshair size={14} />
        </button>
      </div>

      {/* Bottom Bar: Status toggle & Chips */}
      <div style={{
        position: 'absolute',
        bottom: 14,
        left: 14,
        right: 14,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setUnavailableState(!unavailableState)}
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              padding: '4px 10px',
              color: '#F8FAFC',
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Eye size={12} />
            Show unavailable state
          </button>

          <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            Parcel
          </span>
          <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'rgba(2, 132, 199, 0.15)', color: '#60A5FA', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
            Building
          </span>
          <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'rgba(13, 148, 136, 0.25)', color: '#2DD4BF', border: '1px solid rgba(13, 148, 136, 0.5)' }}>
            Candidate 3D unit
          </span>
          <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
            Conflict
          </span>
        </div>

        <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
          Dynamic geospatial volume generation
        </span>
      </div>
    </div>
  );
};
