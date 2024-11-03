import React, { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import * as THREE from "three";
import img2 from "../assets/img2.png";

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
      <h1 style={{ margin: "20px 0" }}>Satelitbild anzeigen</h1>
      <div>
        <a
          href="https://www.uni-wuerzburg.de/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={img2} alt="Background" className="img2" />
        </a>
      </div>
      <div
        style={{
          width: "80%",
          height: "80%",
          border: "2px solid red",
        }}
      ></div>
    </div>
  );
};

export default View;
