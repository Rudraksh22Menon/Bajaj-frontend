import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './App.css';

function App() {
  // State for handling input, API response, errors, and selected dropdown options
  const [inputData, setInputData] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Multi-select dropdown options
  const options = [
    { value: 'numbers', label: 'Numbers' },
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' }
  ];

  // Update document title to roll number
  useEffect(() => {
    document.title = "Your Roll Number"; // Replace with your actual roll number
  }, []);

  // Handle form submission (JSON input validation and API call)
  const handleSubmit = async () => {
    try {
      const jsonData = JSON.parse(inputData); // Validate JSON input

      // Adjust the URL to match your backend URL
      const response = await fetch('https://backendd-f143e51585ff.herokuapp.com/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: jsonData.data || [], // Adjust based on your API payload requirements
          file_b64: jsonData.file_b64 || "" // Adjust if necessary
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setApiResponse(data); // Set the response to display later
      setError(null); // Clear any previous errors
    } catch (err) {
      setError("Invalid JSON format or API error.");
    }
  };

  // Handle multi-select dropdown change
  const handleSelect = (options) => {
    setSelectedOptions(options);
  };

  // Filter API response based on the selected dropdown options
  const displayData = () => {
    let display = {};
    if (selectedOptions.some(option => option.value === 'numbers')) {
      display.numbers = apiResponse?.numbers || [];
    }
    if (selectedOptions.some(option => option.value === 'alphabets')) {
      display.alphabets = apiResponse?.alphabets || [];
    }
    if (selectedOptions.some(option => option.value === 'highest_lowercase_alphabet')) {
      display.highest_lowercase_alphabet = apiResponse?.highest_lowercase_alphabet || [];
    }
    return display;
  };

  return (
    <div className="app-container">
      <h1>BFHL Frontend</h1>
      <textarea
        placeholder='Enter JSON input (e.g., {"data": ["A", "b", "3"], "file_b64": "BASE64_STRING"})'
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>

      {error && <p className="error">{error}</p>}

      {apiResponse && (
        <>
          <Select
            isMulti
            value={selectedOptions}
            onChange={handleSelect}
            options={options}
          />
          <div className="response-container">
            {Object.keys(displayData()).map((key) => (
              <p key={key}>
                {key}: {JSON.stringify(displayData()[key])}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
