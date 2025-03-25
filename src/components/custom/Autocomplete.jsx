import React, { useState, useCallback, useRef } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const API_KEY = import.meta.env.VITE_API_KEY;

const LocationSearch = ({ onSelect }) => {
  const [options, setOptions] = useState([]);
  const timeoutRef = useRef(null); // Use useRef to store timeout ID

  // Fetch suggestions based on input
  const fetchSuggestions = useCallback((query) => {
    // Only process non-empty queries (leading/trailing spaces are allowed)
    const trimmedQuery = query.trim();

    // If query is empty after trimming, do not fetch suggestions
    if (!trimmedQuery) {
      setOptions([]);
      return;
    }

    // Clear any pending timeouts
    clearTimeout(timeoutRef.current);
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

  // Handle input changes
  const handleInputChange = (event, newInputValue) => {
    fetchSuggestions(newInputValue); // Fetch suggestions when input changes
  };

  // Handle selection from dropdown
  const handleSelectionChange = (event, selectedValue) => {
    if (selectedValue && onSelect) {
      onSelect(selectedValue); // Send selected location to parent
    }
  };

  return (
    <Autocomplete
      freeSolo={false} // Disable free text input, only allow selection from the dropdown
      options={options}
      onInputChange={handleInputChange} // Fetch suggestions when input changes
      onChange={handleSelectionChange} // Send selected location to parent
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Location..."
          variant="outlined"
          sx={{
            input: { color: "white", fontSize: "18px" },
            label: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "lightgray" },
              "&.Mui-focused fieldset": { borderColor: "cyan" },
            },
          }}
        />
      )}
    />
  );
};

export default LocationSearch;
