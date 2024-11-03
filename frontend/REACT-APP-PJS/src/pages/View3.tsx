import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import * as THREE from "three";
import img2 from "../assets/img2.png";

// Neue Komponente für das rotierende Mesh-Modell
const RotatingMesh = ({ geometry }: { geometry: THREE.BufferGeometry }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [rotationSpeed, setRotationSpeed] = useState(0);

  // useFrame wird in jedem Frame aufgerufen
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += rotationSpeed; // Rotation um die Z-Achse
    }
  });

  // Tastatureingaben behandeln
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setRotationSpeed(0.01); // Drehe nach links (Z-Achse)
      } else if (event.key === "ArrowRight") {
        setRotationSpeed(-0.01); // Drehe nach rechts (Z-Achse)
      }
    };

    const handleKeyUp = () => {
      setRotationSpeed(0); // Stoppe Rotation, wenn die Taste losgelassen wird
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      {/* Verwende ein Mesh-Material wie MeshStandardMaterial oder MeshPhongMaterial */}
      <meshStandardMaterial vertexColors={true} />{" "}
      {/* Falls die Geometrie Farbinformationen enthält */}
    </mesh>
  );
};

const MeshViewer = () => {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    const loader = new PLYLoader();
    loader.load(
      "/poisson_mesh-14.ply", // Pfad zur PLY-Datei
      (geometry) => {
        geometry.scale(0.1, 0.1, 0.1); // Skaliere das Mesh
        geometry.computeVertexNormals(); // Berechne die Normalen für Lichtreflexionen
        setGeometry(geometry);
      },
      undefined,
      (error) => {
        console.error("Fehler beim Laden des Meshes:", error);
      }
    );
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 50], fov: 50 }} // Kamera weiter weg positionieren
      gl={{ antialias: true }}
      style={{ backgroundColor: "#1a1a1a", height: "100%", width: "100%" }} // Vollbild Canvas
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />{" "}
      {/* Lichtquelle */}
      <Suspense fallback={null}>
        {geometry && <RotatingMesh geometry={geometry} />}
      </Suspense>
      <axesHelper args={[5]} /> {/* 5 ist die Länge der Achsen */}
      <OrbitControls />
    </Canvas>
  );
};

const View = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#add8e6",
      }}
    >
      <h1 style={{ margin: "20px 0" }}>Mesh anzeigen</h1>

      <div
        style={{
          width: "80%",
          height: "80%",
          border: "2px solid red",
        }}
      >
        <MeshViewer />
      </div>
    </div>
  );
};

export default View;
