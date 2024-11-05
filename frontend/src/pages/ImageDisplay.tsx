import React, { useEffect, useState } from "react";

interface ImageDisplayProps {
  backendUrl: string; // Define the backendUrl prop type
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ backendUrl }) => {
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);

  useEffect(() => {
    // Use backendUrl for fetching the image
    fetch(`${backendUrl}/image`, { method: 'POST' }) // Use the backendUrl prop
      .then(response => response.blob())
      .then(blob => {
        setImageBlob(blob);
        const url = URL.createObjectURL(blob);
        setImageURL(url);
      })
      .catch(err => {
        console.error('Error fetching image:', err);
      });

    return () => {
      if (imageURL) {
        URL.revokeObjectURL(imageURL);
      }
    };
  }, [backendUrl, imageURL]); // Add backendUrl to the dependency array

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
      <h1 style={{ margin: "20px 0" }}>Satellitenbild anzeigen</h1>
      <div>
        {imageURL ? (
          <img src={imageURL} alt="Fetched from backend" className="img2" />
        ) : (
          <p>Loading...</p>
        )}
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

export default ImageDisplay;
