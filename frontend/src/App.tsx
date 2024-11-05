import img1 from "./assets/img1.png"; // Import image
import "./App.css"; // Import your CSS file
import img2 from "./assets/img2.png";
import img3 from "./assets/img3.png";
import { useState } from "react";
import React from "react";
import NavBar from "./components/NAV";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OpenModel from "./pages/OpenModel";
import AddressInput from "./pages/AddressInput";
import CreateUser from "./pages/CreateUser";
import Home from "./pages/Home";
import ImageDisplay from "./pages/ImageDisplay";
import MeshVisualization from "./pages/MeshVisualization";
import ErrorBoundary from "./components/ErrorBoundary"; // Import Error Boundary

function App() {
  const backendUrl = process.env.REACT_APP_BACKEND_SERVICE_URL || ""; // Ensure this is a string
  console.log(backendUrl)

  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AddressInput" element={
          <ErrorBoundary>
            <AddressInput backendUrl={backendUrl} />
          </ErrorBoundary>
        } />
        <Route path="/OpenModel" element={<OpenModel backendUrl={backendUrl} />} /> {/* Correct prop passing */}
        <Route path="/CreateUser" element={<CreateUser />} /> 
        <Route path="/ImageDisplay" element={
          <ErrorBoundary>
            <ImageDisplay backendUrl={backendUrl} />
          </ErrorBoundary>
        } />        
        <Route path="/MeshVisualization" element={
          <ErrorBoundary>
            <MeshVisualization backendUrl={backendUrl} />
          </ErrorBoundary>
        } />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
