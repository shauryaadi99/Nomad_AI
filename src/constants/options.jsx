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
- **Only list hotels(atleast 5) within {location}** (do not include hotels from nearby areas).  
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
    "bestTimeToVisit": "from 7pm to 10pm (local time)",
    "locations": [
      {
        "placeName": "Central Park",
        "placeDetails": "Central Park, located in the heart of New York City, is a vast public park known for its breathtaking landscapes, lush greenery, and scenic walking trails. Spanning over 840 acres, it offers a perfect escape from the city's hustle and bustle. People of all age groups visit the park for relaxation, exercise, picnics, and recreational activities like boating, cycling, and ice skating in the winter. The park is also famous for its iconic spots like Bethesda Terrace, Strawberry Fields, and the Central Park Zoo. Visitors can enjoy a variety of popular foods, including hot dogs, pretzels, and New York-style bagels from nearby vendors. Whether it's families enjoying a sunny day, joggers running along the trails, or artists capturing its beauty, Central Park remains a beloved landmark for locals and tourists alike.",
        "placeImageUrl": "https://example.com/central-park.jpg",
        "geoCoordinates": { "latitude": 40.785091, "longitude": -73.968285 },
        "ticketPricing": "Free",
        "rating": 4.7,
        "timeTravel": "N/A (Starting point)"
      },
      {
        "placeName": "City Museum",
        "placeDetails": "The City Museum is a historical treasure trove that showcases the rich heritage and cultural evolution of the city. Featuring a vast collection of artifacts, photographs, and exhibits, it offers visitors a glimpse into the city's past, from its early foundations to modern developments. The museum attracts people of all ages, from history enthusiasts and students to tourists eager to learn about local traditions. Interactive displays, ancient relics, and well-preserved documents bring history to life, making it an engaging experience for visitors. Many museums also house quaint cafés and gift shops, offering unique souvenirs and local delicacies. Whether exploring old maps, admiring vintage architecture, or attending educational workshops, the City Museum serves as a bridge between the past and present, preserving the city's legacy for future generations.",
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

