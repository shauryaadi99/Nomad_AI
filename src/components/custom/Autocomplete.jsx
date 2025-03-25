import React, { useState, useCallback, useRef } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const API_KEY = import.meta.env.VITE_API_KEY;

const LocationSearch = ({ onSelect }) => {
  const [options, setOptions] = useState([]);
  const timeoutRef = useRef(null);

  // Fetch suggestions from the API
  const fetchSuggestions = useCallback((query) => {
    const normalizedQuery = query.trim(); // Normalize query before making request

    if (!normalizedQuery) {
      setOptions([]); // If empty, clear options
      return;
    }

    // Clear any pending requests
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        normalizedQuery
      )}&limit=5&apiKey=${API_KEY}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.features) {
          // Ensure all options are trimmed properly
          const uniqueOptions = Array.from(
            new Set(data.features.map((feature) => feature.properties.formatted.trim()))
          );

          setOptions(uniqueOptions); // Update options in state
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    }, 300);
  }, []);

  // Handle input changes
  const handleInputChange = (event, newInputValue, reason) => {
    if (reason === "reset") return; // Prevent unwanted resets

    // Allow fetching for both "Dhanbad" and "Dhanbad " (trailing space case)
    fetchSuggestions(newInputValue);
  };

  // Handle selection from dropdown
  const handleSelectionChange = (event, selectedValue) => {
    if (selectedValue && onSelect) {
      onSelect(selectedValue); // Send selected value without trimming (API already handles normalization)
    }
  };

  return (
    <Autocomplete
      freeSolo={false}
      options={options}
      onInputChange={handleInputChange}
      onChange={handleSelectionChange}
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
