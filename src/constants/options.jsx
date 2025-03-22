export const SelectTravelsList = [
    {
        id: 1,
        title: 'Just Me',
        desc: 'A sole traveler in exploration',
        icon: '🦅',
        people: '1 person'
    },
    {
        id: 2,
        title: 'A Couple',
        desc: 'Two travelers in tandem',
        icon: '🥂',
        people: '2 people'
    },
    {
        id: 3,
        title: 'Family',
        desc: 'A group of fun-loving adventurers',
        icon: '🏡',
        people: '3 to 5 people'
    },
    {
        id: 4,
        title: 'Friends',
        desc: 'Traveling with a group of close friends',
        icon: '🎉',
        people: '6 to 10 people'
    }
];

export const SelectBudgetOptions = [
    {
        id: 1,
        title: 'Cheap',
        desc: 'Stay conscious of costs',
        icon: '💵'
    },
    {
        id: 2,
        title: 'Moderate',
        desc: 'Balance between comfort and cost',
        icon: '💳'
    },
    {
        id: 3,
        title: 'Luxury',
        desc: 'Premium experience with high-end services',
        icon: '🏆'
    },
    {
        id: 4,
        title: 'All-Inclusive',
        desc: 'Everything covered for a stress-free trip',
        icon: '🌍'
    }
];

export const AI_PROMPT = `
Generate a detailed travel plan **exclusively for {location}**, strictly avoiding nearby cities, for **{totalDays} days**. The plan should cater to **{traveler} travelers** within a **{budget} budget**.

### **🏨 Hotels Section:**  
- **Only list hotels within {location}** (do not include hotels from nearby areas).  
- For each hotel, provide:  
  - 🏨 **Hotel Name**  
  - 📍 **Hotel Address** (**Ensure it is within {location}**)  
  - 💰 **Price per night**  
  - 🖼️ **Hotel Image URL**  
  - 🌍 **Geo-coordinates** (Latitude & Longitude within {location})  
  - ⭐ **Rating**  
  - 📝 **Short description of the hotel**  

### **📍 Itinerary Section (Array Format):**  
- **Each day's plan must only include locations within {location}**.  
- The itinerary should be structured as an **array**, with each day containing multiple locations.  

Example format:
\`\`\`json
"itinerary": [
  {
    "day": 1,
    "theme": "Exploring Local Attractions",
    "bestTimeToVisit": "Morning to Evening",
    "locations": [
      {
        "placeName": "Central Park",
        "placeDetails": "A large public park with beautiful landscapes.",
        "placeImageUrl": "https://example.com/central-park.jpg",
        "geoCoordinates": { "latitude": 40.785091, "longitude": -73.968285 },
        "ticketPricing": "Free",
        "rating": 4.7,
        "timeTravel": "N/A (Starting point)"
      },
      {
        "placeName": "City Museum",
        "placeDetails": "A historical museum showcasing city heritage.",
        "placeImageUrl": "https://example.com/museum.jpg",
        "geoCoordinates": { "latitude": 40.779437, "longitude": -73.963244 },
        "ticketPricing": "$15 per adult",
        "rating": 4.5,
        "timeTravel": "15 minutes from Central Park"
      }
    ]
  }
]
\`\`\`

### **⚠️ Important Constraints:**  
- **Do not** include locations, hotels, or attractions outside {location}.  
- The response **must be in structured JSON format**, ensuring the **itinerary is an array** sorted by day.
`;

