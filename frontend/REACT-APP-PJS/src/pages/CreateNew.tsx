import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import { useState } from "react";
import React, { ChangeEvent } from "react";

/*function CreateNew(): JSX.Element {
  const [vNorthing, setVNorthing] = useState("Northing");
  const [vEasting, setVEasting] = useState("Easting");

  const [vStreet, setVStreet] = useState("Street");
  const [vNumber, setVNumber] = useState("Number");
  const [vCity, setVCity] = useState("City");
  const [vZIP, setVZIP] = useState("ZIP-Code");

  const click = () => {
    alert(
      `Northing: ${vNorthing}, Easting: ${vEasting}, Street: ${vStreet}, Number: ${vNumber}, City: ${vCity}, ZIP-Code: ${vZIP}`
    );
  };
  const changeNorthing = (event: ChangeEvent<HTMLInputElement>) => {
    setVNorthing(event.target.value);
  };

  const changeEasting = (event: ChangeEvent<HTMLInputElement>) => {
    setVEasting(event.target.value);
  };

  const changeStreet = (event: ChangeEvent<HTMLInputElement>) => {
    setVStreet(event.target.value);
  };

  const changeNumber = (event: ChangeEvent<HTMLInputElement>) => {
    setVNumber(event.target.value);
  };
  const changeCity = (event: ChangeEvent<HTMLInputElement>) => {
    setVCity(event.target.value);
  };
  const changeZIP = (event: ChangeEvent<HTMLInputElement>) => {
    setVZIP(event.target.value);
  };
*/

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

  const handleSubmit = () => {
    const AdresseFront = {
      street: vStreet,
      number: vNumber,
      city: vCity,
      zipCode: vZIP,
    };

    // Speichern in localStorage
    localStorage.setItem("userData", JSON.stringify(AdresseFront));

    console.log("Benutzerdaten gespeichert:", AdresseFront);
    alert("Benutzerdaten gespeichert!");

    console.log("Benutzerdaten:", AdresseFront);
    alert("Benutzerdaten gesammelt!");
    alert(JSON.stringify(AdresseFront, null, 2));
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
