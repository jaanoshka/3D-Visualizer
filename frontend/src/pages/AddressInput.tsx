import img1 from "./assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import React, { ChangeEvent, useState } from "react";

const AddressInput: React.FC<{ backendUrl: string }> = ({ backendUrl }) => {
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
    setError(''); // Reset error on input change
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!address) {
      setError('Please enter an address.');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch satellite image');
      }

      const imageData = await response.json(); // Handle the response accordingly
      console.log(imageData); // Process the returned image data
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while fetching the image.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
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
      <h1>Enter Address to Get Satellite Image</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text"
          value={address}
          onChange={handleChange}
          placeholder="123 Main St, City, Country"
          style={{
            fontSize: '18px',
            fontStyle: 'italic', // Cursive style for the placeholder
            padding: '10px',
            width: '300px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ marginTop: '20px', padding: '10px 20px' }}>Get Satellite Image</button>
      </form>
    </div>
  );
};
export default AddressInput;