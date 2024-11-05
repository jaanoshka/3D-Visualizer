import React, { useEffect } from "react";
import ListGroup from "../components/ListGroup";

// Define the interface for the props
interface OpenModelProps {
  backendUrl: string; // Ensure this is a string
}

// Ensure you destructure props in the function parameters
function OpenModel({ backendUrl }: OpenModelProps): JSX.Element {
  useEffect(() => {
    const fetchData = async () => {
      if (!backendUrl) {
        console.error("Backend URL is not defined.");
        return;
      }
      
      try {
        const response = await fetch(`${backendUrl}/model`); // Replace with your actual endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Handle your data here
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [backendUrl]);

  return (
    <div>
      <div>
        <h1>Open Model Screen</h1>
      </div>

      <div>
        <h6>
          Ziel: Auf dieser Seite müssen die Modelle abgelegt werden und ein
          Zugang zum Öffnen eines Model hergestellt werden
        </h6>
      </div>
      <div>
        <ListGroup />
      </div>
    </div>
  );
}

export default OpenModel;
