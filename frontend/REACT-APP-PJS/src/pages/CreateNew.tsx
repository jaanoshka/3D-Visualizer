import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import { useState } from "react";
import React, { ChangeEvent } from "react";

function CreateNew(): JSX.Element {
  const [vNorthing, setVNorthing] = useState("xxx"); // Leerstring für initialen Zustand
  const [vEasting, setVEasting] = useState("");
  const [vStreet, setVStreet] = useState("");
  const [vNumber, setVNumber] = useState("");
  const [vCity, setVCity] = useState("");
  const [vZIP, setVZIP] = useState("");

  const handleChangeNorthing = (event: ChangeEvent<HTMLInputElement>) => {
    setVNorthing(event.target.value);
  };

  const handleChangeEasting = (event: ChangeEvent<HTMLInputElement>) => {
    setVEasting(event.target.value);
  };

  const handleChangeStreet = (event: ChangeEvent<HTMLInputElement>) => {
    setVStreet(event.target.value);
  };

  const handleChangeNumber = (event: ChangeEvent<HTMLInputElement>) => {
    setVNumber(event.target.value);
  };

  const handleChangeCity = (event: ChangeEvent<HTMLInputElement>) => {
    setVCity(event.target.value);
  };

  const handleChangeZIP = (event: ChangeEvent<HTMLInputElement>) => {
    setVZIP(event.target.value);
  };

  const handleSubmit = async () => {
    // Adresse zusammenfassen, um ein einzelnes Adressfeld zu erstellen
    const address = `${vStreet} ${vNumber}, ${vZIP} ${vCity}`;

    try {
      const response = await fetch("http://localhost:4000/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Abrufen des Bildes.");
      }

      const result = await response.json();
      console.log("Server-Antwort:", result);
      alert("Daten erfolgreich an das Backend gesendet!");
    } catch (error) {
      console.error("Fehler beim Senden der Daten:", error);
      alert("Fehler beim Senden der Daten.");
    }
  };

  return (
    <div>
      <img src={img1} alt="Background" className="background-image" />
      <div>
        <a
          href="https://www.uni-wuerzburg.de/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={img2} alt="Background" className="img2" />
        </a>
      </div>
      <div>
        <a
          href="https://greenventory.de/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={img3} alt="Background" className="img3" />
        </a>
      </div>
      <div>
        <h1>Bitte geben Sie die Koordinaten und Adresse ein</h1>
        <div className="input-container">
          <div className="input-group">
            <label>Northing:</label>
            <input
              type="text"
              value={vNorthing}
              onChange={handleChangeNorthing}
            />
          </div>

          <div className="input-group">
            <label>Easting:</label>
            <input
              type="text"
              value={vEasting}
              onChange={handleChangeEasting}
            />
          </div>

          <div className="input-group">
            <label>Street:</label>
            <input type="text" value={vStreet} onChange={handleChangeStreet} />
          </div>

          <div className="input-group">
            <label>Number:</label>
            <input type="text" value={vNumber} onChange={handleChangeNumber} />
          </div>

          <div className="input-group">
            <label>City:</label>
            <input type="text" value={vCity} onChange={handleChangeCity} />
          </div>

          <div className="input-group">
            <label>ZIP Code:</label>
            <input type="text" value={vZIP} onChange={handleChangeZIP} />
          </div>

          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default CreateNew;
