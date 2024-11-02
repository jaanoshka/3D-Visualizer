import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import { useState } from "react";
import React, { ChangeEvent } from "react";

function CreateNew(): JSX.Element {
  const [vMail, setVMail] = useState("E-Mail");
  const [vUsername, setVUsername] = useState("Username");
  const [vPassword, setVPassword] = useState("New Password");
  const click = () => {
    alert(
      `User E-Mail: ${vMail}, Username: ${vUsername}, Password: ${vPassword}`
    );
  };
  const changevMail = (event: ChangeEvent<HTMLInputElement>) => {
    setVMail(event.target.value);
  };

  const changevUsername = (event: ChangeEvent<HTMLInputElement>) => {
    setVUsername(event.target.value);
  };

  const changevPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setVPassword(event.target.value);
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
        <h1 className="textWelcome">Please fill in the selected coordinates</h1>
      </div>
      <div className="Input1">
        <input onChange={changevMail} value={vMail} />
        <input onChange={changevUsername} value={vUsername} />
        <input onChange={changevPassword} value={vPassword} />
        <button onClick={click}>Apply</button>
      </div>
    </div>
  );
}

export default CreateNew;
