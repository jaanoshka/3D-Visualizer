import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";

function HOME(): JSX.Element {
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
        <h1>
          Welcome, this is the HomeScreen, please select one function of the
          navbar{" "}
        </h1>
      </div>
    </div>
  );
}

export default HOME;
