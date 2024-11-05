import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

interface MeshViewerProps {
  backendUrl: string; // Accept the backend URL as a prop
}

const MeshViewer: React.FC<MeshViewerProps> = ({ backendUrl }) => {
  const meshRef = useRef<THREE.Mesh | null>(null); // Reference to the mesh

  useEffect(() => {
    const fetchMesh = async () => {
      try {
        const response = await fetch(`${backendUrl}/mesh`, { method: 'GET' }); // Fetch mesh from backend
        const plyText = await response.text(); // Get the mesh data as text

        // Create a Blob from the fetched text
        const blob = new Blob([plyText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob); // Create a URL for the blob

        // Load the mesh using PLYLoader
        const loader = new PLYLoader();
        loader.load(url, (geometry) => {
          // Create a new mesh with the loaded geometry
          const material = new THREE.MeshStandardMaterial({ color: 0xff5533 });
          const mesh = new THREE.Mesh(geometry, material);
          meshRef.current = mesh; // Store the mesh in the ref
        });

        // Cleanup the blob URL
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error fetching or loading mesh:', error);
      }
    };

    fetchMesh();
  }, [backendUrl]);

  return (
    <Canvas style={{ height: '100vh', width: '100vw' }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {meshRef.current && <primitive object={meshRef.current} />} {/* Render the mesh */}
    </Canvas>
  );
};

export default MeshViewer;
