import React, { useState, useCallback, useRef } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const API_KEY = import.meta.env.VITE_API_KEY;

const LocationSearch = ({ onSelect }) => {
  const [options, setOptions] = useState([]);
  const timeoutRef = useRef(null); // Use useRef to store timeout ID

  const fetchSuggestions = useCallback((query) => {
    if (!query) {
      setOptions([]); // Clear options when input is empty
      return;
    }

    clearTimeout(timeoutRef.current); // Clear previous timeout
    timeoutRef.current = setTimeout(async () => {
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&limit=5&apiKey=${API_KEY}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.features) {
          setOptions(data.features.map((feature) => feature.properties.formatted));
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    }, 300);
  }, []);

  return (
    <Autocomplete
      freeSolo
      options={options}
      onInputChange={(event, newInputValue) => fetchSuggestions(newInputValue)}
      onChange={(event, selectedValue) => {
        if (selectedValue && onSelect) {
          onSelect(selectedValue); // Send final selection to parent
        }
      }}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label="Search Location..." 
          variant="outlined"
          sx={{ 
            input: { color: "white", fontSize: "18px" }, // Ensures text is visible
            label: { color: "white" }, // Changes label color
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" }, // Default border
              "&:hover fieldset": { borderColor: "lightgray" }, // On hover
              "&.Mui-focused fieldset": { borderColor: "cyan" } // On focus
            }
          }}
        />
      )}
    />
  );
};

export default LocationSearch;
