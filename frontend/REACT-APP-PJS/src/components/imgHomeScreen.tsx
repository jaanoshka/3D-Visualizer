// In deiner React-Komponente, z.B. App.tsx

import React from "react";
import img1 from "../assets/img1.png";

function imgHomeScreen() {
  return (
    <div>
      <img
        src={img1}
        alt="Home Screen"
        style={{
          width: "1000px", // Breite des Bildes
          height: "1250px",
          marginTop: "0px", // Abstand nach oben
          marginLeft: "718px",
          borderRadius: "8px", // Abgerundete Ecken
        }}
      />
    </div>
  );
}

export default imgHomeScreen;
