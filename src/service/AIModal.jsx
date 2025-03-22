import { GoogleGenerativeAI } from "@google/generative-ai";
  const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
export const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "generate travel plan for location: Las Vegas for 3 days for Couple with a cheap budget, Give me a Hotels options list with HotelName, Hotel addresses, Price , hotel image url, geocoordinates, rating, descriptions and suggest itinerary with placename, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for 3 days with each day plan with best time to visit in JSON format "},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, here's a comprehensive 3-day Las Vegas itinerary for a couple on a budget, presented in JSON format. I'll focus on free attractions, affordable dining options, and reasonably priced accommodations.\n\n```json\n{\n  \"tripName\": \"Las Vegas Budget Getaway for Couples\",\n  \"duration\": \"3 Days\",\n  \"budget\": \"Cheap/Affordable\",\n  \"travelers\": \"Couple\",\n  \"currency\": \"USD\",\n  \"hotelOptions\": [\n    {\n      \"hotelName\": \"Circus Circus Hotel & Casino\",\n      \"hotelAddress\": \"2880 S Las Vegas Blvd, Las Vegas, NV 89109\",\n      \"price\": \"From $40 per night (depending on season and deals)\",\n      \"hotelImageUrl\": \"https://media-cdn.tripadvisor.com/media/photo-s/1a/59/c0/18/exterior.jpg\",\n      \"geoCoordinates\": {\n        \"latitude\": 36.1263,\n        \"longitude\": -115.1634\n      },\n      \"rating\": 3.5,\n      \"description\": \"Affordable option on the Strip with a circus theme, free circus acts, and Adventuredome theme park (additional cost).  Rooms are basic but clean. Good for families and budget travelers.\",\n        \"amenities\": [\n          \"Free Circus Acts\",\n          \"Adventuredome Theme Park\",\n          \"Casino\",\n          \"Multiple Dining Options\",\n          \"Swimming Pool\"\n        ]\n    },\n    {\n      \"hotelName\": \"Excalibur Hotel & Casino\",\n      \"hotelAddress\": \"3850 S Las Vegas Blvd, Las Vegas, NV 89109\",\n      \"price\": \"From $45 per night (depending on season and deals)\",\n      \"hotelImageUrl\": \"https://media-cdn.tripadvisor.com/media/photo-s/1b/90/21/6c/excalibur-hotel-casino.jpg\",\n      \"geoCoordinates\": {\n        \"latitude\": 36.0983,\n        \"longitude\": -115.1743\n      },\n      \"rating\": 3.7,\n      \"description\": \"Medieval-themed hotel on the south end of the Strip. Offers relatively affordable rooms and is connected to Luxor and Mandalay Bay by free trams.  Ideal for those looking for a themed experience on a budget.\",\n        \"amenities\": [\n          \"Casino\",\n          \"Tournament of Kings Dinner Show\",\n          \"Multiple Dining Options\",\n          \"Swimming Pools\",\n          \"Free Tram Access to Luxor and Mandalay Bay\"\n        ]\n    },\n    {\n      \"hotelName\": \"Stratosphere Hotel, Casino and Tower\",\n      \"hotelAddress\": \"2000 S Las Vegas Blvd, Las Vegas, NV 89104\",\n      \"price\": \"From $40 per night (depending on season and deals)\",\n      \"hotelImageUrl\": \"https://media-cdn.tripadvisor.com/media/photo-s/1b/8b/b0/b3/the-strat-hotel-casino.jpg\",\n      \"geoCoordinates\": {\n        \"latitude\": 36.1472,\n        \"longitude\": -115.1575\n      },\n      \"rating\": 3.6,\n      \"description\": \"Located at the north end of the Strip, offering stunning views from the Stratosphere Tower (additional cost for rides/observation).  Rooms are generally affordable, but the location is a bit further from the central Strip action.\",\n        \"amenities\": [\n          \"Stratosphere Tower Observation Deck\",\n          \"Thrill Rides\",\n          \"Casino\",\n          \"Multiple Dining Options\",\n          \"Swimming Pool\"\n        ]\n    }\n  ],\n  \"itinerary\": {\n    \"day1\": {\n      \"theme\": \"South Strip Exploration & Free Shows\",\n      \"bestTimeToVisit\": \"Morning to Evening\",\n      \"locations\": [\n        {\n          \"placeName\": \"Welcome to Las Vegas Sign\",\n          \"placeDetails\": \"Iconic sign at the south end of the Strip. A must-do photo opportunity.\",\n          \"placeImageUrl\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Welcome_to_Las_Vegas_sign.JPG/1280px-Welcome_to_Las_Vegas_sign.JPG\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.0828,\n            \"longitude\": -115.1731\n          },\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.5,\n          \"timeTravel\": \"15 minutes (from Excalibur via walking)\"\n        },\n        {\n          \"placeName\": \"Bellagio Conservatory & Botanical Garden\",\n          \"placeDetails\": \"Beautiful and free floral display that changes seasonally inside the Bellagio.\",\n          \"placeImageUrl\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Bellagio_Conservatory_%26_Botanical_Gardens.jpg/1280px-Bellagio_Conservatory_%26_Botanical_Gardens.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1125,\n            \"longitude\": -115.1742\n          },\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.7,\n          \"timeTravel\": \"25 minutes (bus ride from Welcome to Las Vegas Sign)\"\n        },\n        {\n          \"placeName\": \"Bellagio Fountains\",\n          \"placeDetails\": \"Spectacular free water show synchronized to music. Runs every 30 minutes in the afternoon and every 15 minutes in the evening.\",\n          \"placeImageUrl\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Bellagio_fountains.jpg/1280px-Bellagio_fountains.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1128,\n            \"longitude\": -115.1740\n          },\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.8,\n          \"timeTravel\": \"Adjacent to the Conservatory\"\n        },\n        {\n          \"placeName\": \"Fremont Street Experience\",\n          \"placeDetails\": \"Free light and sound show on a giant video screen canopy in Downtown Las Vegas. Street performers, casinos, and cheap eats abound.\",\n          \"placeImageUrl\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Fremont_Street_Experience_at_night.jpg/1280px-Fremont_Street_Experience_at_night.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1702,\n            \"longitude\": -115.1423\n          },\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.6,\n          \"timeTravel\": \"30 minutes (Bus ride from Bellagio)\"\n        }\n      ]\n    },\n    \"day2\": {\n      \"theme\": \"Central Strip & Budget Eats\",\n      \"bestTimeToVisit\": \"Morning to Evening\",\n      \"locations\": [\n        {\n          \"placeName\": \"High Roller Observation Wheel (Optional)\",\n          \"placeDetails\": \"Offers panoramic views of the Las Vegas Strip and surrounding valley.  Consider a daytime ride for better visibility.\",\n          \"placeImageUrl\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/The_High_Roller_Las_Vegas_June_2014_%28cropped%29.jpg/1280px-The_High_Roller_Las_Vegas_June_2014_%28cropped%29.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1154,\n            \"longitude\": -115.1641\n          },\n          \"ticketPricing\": \"From $25 (depending on time of day and deals)\",\n          \"rating\": 4.3,\n          \"timeTravel\": \"30 minutes (Bus ride from Fremont Street Experience)\"\n        },\n        {\n          \"placeName\": \"LINQ Promenade\",\n          \"placeDetails\": \"Outdoor shopping, dining, and entertainment district leading to the High Roller. Free to walk around and window shop.\",\n          \"placeImageUrl\": \"https://media-cdn.tripadvisor.com/media/photo-s/0f/24/d7/e6/linq-promenade.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1152,\n            \"longitude\": -115.1666\n          },\n          \"ticketPricing\": \"Free (unless purchasing items)\",\n          \"rating\": 4.4,\n          \"timeTravel\": \"Adjacent to High Roller\"\n        },\n        {\n          \"placeName\": \"Eiffel Tower Viewing Deck at Paris Las Vegas\",\n          \"placeDetails\": \"Half-scale replica of the Eiffel Tower with a viewing deck offering great Strip views.\",\n          \"placeImageUrl\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Eiffel_Tower_Paris_Hotel_Las_Vegas_2011.jpg/1280px-Eiffel_Tower_Paris_Hotel_Las_Vegas_2011.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1122,\n            \"longitude\": -115.1717\n          },\n          \"ticketPricing\": \"From $24 (depending on time of day and deals)\",\n          \"rating\": 4.5,\n          \"timeTravel\": \"15 minutes (walk from LINQ)\"\n        },\n        {\n          \"placeName\": \"Mirage Volcano\",\n          \"placeDetails\": \"Free volcano eruption show in front of the Mirage hotel.  Runs nightly.\",\n          \"placeImageUrl\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Mirage_volcano.jpg/1280px-Mirage_volcano.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1212,\n            \"longitude\": -115.1742\n          },\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.6,\n          \"timeTravel\": \"10 minutes (walk from Eiffel Tower)\"\n        }\n      ]\n    },\n    \"day3\": {\n      \"theme\": \"Northern Strip & Departure\",\n      \"bestTimeToVisit\": \"Morning to Afternoon\",\n      \"locations\": [\n        {\n          \"placeName\": \"The Venetian & The Palazzo\",\n          \"placeDetails\": \"Explore the canals, shops, and architecture of these luxurious resorts. Window shopping is free!\",\n          \"placeImageUrl\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/The_Venetian_Hotel_and_Casino.jpg/1280px-The_Venetian_Hotel_and_Casino.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1214,\n            \"longitude\": -115.1706\n          },\n          \"ticketPricing\": \"Free (unless gondola ride or shopping)\",\n          \"rating\": 4.6,\n          \"timeTravel\": \"15 minutes (walk from Mirage)\"\n        },\n        {\n          \"placeName\": \"Gondola Ride (Optional)\",\n          \"placeDetails\": \"Take a ride on a gondola through the canals of the Venetian.  It's romantic but can be pricey.\",\n          \"placeImageUrl\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Gondolas_Venetian.jpg/1280px-Gondolas_Venetian.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1214,\n            \"longitude\": -115.1706\n          },\n          \"ticketPricing\": \"From $36 per person\",\n          \"rating\": 4.2,\n          \"timeTravel\": \"Located within the Venetian\"\n        },\n        {\n          \"placeName\": \"Free Circus Acts at Circus Circus\",\n          \"placeDetails\": \"Enjoy free circus acts throughout the day at Circus Circus. A fun and budget-friendly activity.\",\n          \"placeImageUrl\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Circus_Circus_Las_Vegas.jpg/1280px-Circus_Circus_Las_Vegas.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1263,\n            \"longitude\": -115.1634\n          },\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.0,\n          \"timeTravel\": \"15 minutes (walk from the Venetian)\"\n        },\n        {\n          \"placeName\": \"Departure\",\n          \"placeDetails\": \"Head to the airport or your next destination.\",\n          \"placeImageUrl\": null,\n          \"geoCoordinates\": null,\n          \"ticketPricing\": null,\n          \"rating\": null,\n          \"timeTravel\": \"Varies depending on departure location\"\n        }\n      ]\n    }\n  },\n  \"budgetTips\": [\n    \"Take advantage of free attractions like the Bellagio Fountains, Conservatory, and Fremont Street Experience.\",\n    \"Look for happy hour deals and affordable restaurants off the main Strip.\",\n    \"Use public transportation (buses) or walk to save on taxi/rideshare costs.\",\n    \"Bring your own water and snacks to avoid paying high prices at hotels and attractions.\",\n    \"Consider visiting during the off-season (summer or winter) for lower hotel rates.\"\n  ],\n  \"diningSuggestions\": [\n    {\n      \"restaurantName\": \"In-N-Out Burger\",\n      \"cuisine\": \"Burgers\",\n      \"priceRange\": \"$\",\n      \"description\": \"West Coast burger chain known for its fresh ingredients and affordable prices.\",\n      \"location\": \"Multiple locations in Las Vegas\"\n    },\n    {\n      \"restaurantName\": \"Secret Pizza (Cosmopolitan)\",\n      \"cuisine\": \"Pizza\",\n      \"priceRange\": \"$\",\n      \"description\": \"Hidden pizza place within the Cosmopolitan hotel, serving delicious slices at reasonable prices.\",\n      \"location\": \"The Cosmopolitan of Las Vegas\"\n    },\n    {\n      \"restaurantName\": \"Ocean One Bar & Grille\",\n      \"cuisine\": \"American\",\n      \"priceRange\": \"$\",\n      \"description\": \"Located inside the Miracle Mile Shops, offering a variety of dishes and cocktails at very affordable prices.\",\n      \"location\": \"Miracle Mile Shops at Planet Hollywood\"\n    }\n  ]\n}\n```\n\n**Key Improvements and Explanations:**\n\n*   **JSON Format:**  The entire structure is valid JSON, making it easy to parse and use in applications.\n*   **Hotel Options:**\n    *   Added specific hotel options (Circus Circus, Excalibur, Stratosphere) known for being budget-friendly.\n    *   Included addresses, example prices (remember these fluctuate!), image URLs, geo-coordinates, ratings, and descriptions.  Critically, provided amenities list.\n*   **Detailed Itinerary:**\n    *   Organized by day with a theme for each day.\n    *   `bestTimeToVisit` added for each day.\n    *   `locations` array within each day.\n    *   Each location includes:\n        *   `placeName`: The name of the attraction.\n        *   `placeDetails`: A brief description.\n        *   `placeImageUrl`: URL of an image of the location.\n        *   `geoCoordinates`:  Latitude and longitude for mapping.\n        *   `ticketPricing`: Cost information (or \"Free\" if applicable).\n        *   `rating`: A subjective rating (out of 5).\n        *   `timeTravel`: Estimated travel time from the previous location, helping with planning.\n*   **Budget Tips:** Added a section with practical advice for saving money.\n*   **Dining Suggestions:** Included affordable restaurant recommendations.\n*   **Realistic Travel Times:** The `timeTravel` estimates are more realistic, considering distances and transportation options (walking, bus) within Las Vegas.\n*   **Free Activities Emphasis:**  Prioritized free or low-cost attractions.\n*   **Optional Activities:**  Included some optional activities (like the High Roller) and clearly marked them as such, so the couple can choose whether to spend money on them.\n*   **Clear Formatting:** Used consistent formatting and indentation for readability.\n\n**How to use this JSON:**\n\n1.  **Copy the JSON:** Copy the entire block of text above.\n2.  **Paste into a JSON Viewer/Formatter:**  Paste the text into an online JSON viewer/formatter (search for \"JSON formatter online\").  This will help you verify that it's valid JSON and make it easier to read.\n3.  **Parse in Code:** If you're a developer, you can use a JSON parsing library in your programming language (e.g., `json.loads()` in Python, `JSON.parse()` in JavaScript) to load this data into your application.\n4.  **Adapt and Customize:**  This is a template.  Adjust the hotel options, activities, dining suggestions, and prices to fit the specific couple's interests and the current deals available.\n\n**Important Notes:**\n\n*   **Prices:**  Prices for hotels, attractions, and meals are *highly* variable in Las Vegas.  They depend on the time of year, day of the week, and any ongoing promotions.  *Always check current prices before booking.*\n*   **Transportation:**  Walking is a great way to see the Strip, but it can be very hot, especially in the summer. Consider using the Las Vegas Monorail (if staying near it) or the bus system (Deuce) for longer distances.\n*   **Deals and Discounts:** Look for deals on websites like Groupon, Travelzoo, or directly on the hotel/attraction websites.\n*   **Flexibility:**  Be prepared to be flexible with your itinerary.  Las Vegas can be unpredictable, and things can change quickly.\n*   **Hydration:** Stay hydrated, especially if you're visiting during the summer.\n*   **Walking Shoes:** Wear comfortable shoes, as you'll be doing a lot of walking.\n\nThis comprehensive JSON provides a solid foundation for planning an affordable and fun Las Vegas trip for a couple. Remember to customize it to your specific needs and preferences.  Enjoy your trip!\n"},
          ],
        },
      ],
    });
  
   