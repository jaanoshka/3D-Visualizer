import img1 from "./assets/img1.png"; // Importiere das Bild
import "./App.css"; // Importiere deine CSS-Datei
import img2 from "./assets/img2.png";
import img3 from "./assets/img3.png";
import { useState } from "react";
import React, { ChangeEvent } from "react";

import NavBar from "./components/NAV";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav1 from "./components/NAV";
import OpenModel from "./pages/OpenModel";
import CreateNew from "./pages/CreateNew";
import CreateUser from "./pages/User";
import HOME from "./pages/Home";
import View from "./pages/View";
import View2 from "./pages/View2";
import ErrorBoundary from "./components/ErrorBoundary"; // Importiere die Fehlergrenze
import View3 from "./pages/View3";

function App() {
  let Component;

  switch (window.location.pathname) {
    case "/":
      Component = <HOME />;
      break;
    case "/CreateNew":
      Component = <CreateNew />;
      break;
    case "/OpenModel":
      Component = <OpenModel />;
      break;
    case "/CreateUser":
      Component = <CreateUser />;
      break;
    case "/View":
      Component = <View />;
      break;
    case "/View2":
      Component = (
        <ErrorBoundary>
          {" "}
          {/* Fehlergrenze um die View2-Komponente */}
          <View2 />
        </ErrorBoundary>
      );
      break;
    case "/View3":
      Component = (
        <ErrorBoundary>
          {" "}
          {/* Fehlergrenze um die View2-Komponente */}
          <View3 />
        </ErrorBoundary>
      );
      break;
    default:
      Component = <HOME />; // Optional: Fallback-Komponente
  }

  return (
    <>
      <Nav1 />
      {Component}
    </>
  );
}

export default App;
