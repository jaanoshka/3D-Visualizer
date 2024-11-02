import React, { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import * as THREE from "three";

// Neue Komponente für die rotierende Punktwolke
const RotatingPoints = ({ geometry }: { geometry: THREE.BufferGeometry }) => {
  const groupRef = React.useRef<THREE.Group>(null!);

  // Skalierung der Punktwolke für bessere Sichtbarkeit
  useEffect(() => {
    if (geometry) {
      geometry.scale(0.1, 0.1, 0.1); // Vergrößere die Punktwolke, falls sie zu klein ist
    }
  }, [geometry]);

  // useFrame wird in jedem Frame aufgerufen
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.0005; // Reduzierte Rotationsgeschwindigkeit um die Z-Achse
    }
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry}>
        <pointsMaterial size={0.01} color={0x00ff00} />{" "}
        {/* Vergrößere die Punktgröße */}
      </points>
    </group>
  );
};

const PointCloudViewer = () => {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    const loader = new PLYLoader();
    loader.load(
      "/point_cloud_Jasmin.ply",
      (geometry) => {
        geometry.computeVertexNormals();
        console.log(
          "Anzahl der Punkte in der Punktwolke:",
          geometry.attributes.position.count
        ); // Anzahl der Punkte ausgeben
        setGeometry(geometry);
      },
      undefined,
      (error) => {
        console.error("Fehler beim Laden der Punktwolke:", error);
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
      <Suspense fallback={null}>
        {geometry && <RotatingPoints geometry={geometry} />}
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
      <h1 style={{ margin: "20px 0" }}>Punktwolke anzeigen</h1>
      <div
        style={{
          width: "80%",
          height: "80%",
          border: "2px solid red",
        }}
      >
        <PointCloudViewer />
      </div>
    </div>
  );
};

export default View;
