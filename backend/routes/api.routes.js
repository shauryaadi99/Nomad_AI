const express = require("express");
const router = express.Router();

const { generateTrip } = require("../controllers/trip.controller");
const { 
  getPlaceDetails, 
  getNearbySearch, 
  getPlacePhoto, 
  getProxyImage 
} = require("../controllers/places.controller");

// Trip Generation
router.post("/generate-trip", generateTrip);

// Google Places Proxy endpoints
router.post("/place-details", getPlaceDetails);
router.post("/nearby-search", getNearbySearch);
router.get("/place-photo", getPlacePhoto);
router.get("/proxy-image", getProxyImage);

module.exports = router;
