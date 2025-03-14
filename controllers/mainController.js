const apiKey = "AIzaSyBmei9lRUUfJI-kLIPNBoc2SxEkwhKHyvU";
const axios = require("axios");
module.exports = {
  getGooglePlaces: async (req, res) => {
    const { input, state } = req.query;
    if (!input || !state) {
      return res.status(400).json({
        status: "error",
        message: "Input query and state are required",
      });
    }
    try {
      const geoResponse = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: `${state}, India`,
            key: apiKey,
          },
        }
      );
      if (!geoResponse.data.results.length) {
        return res.status(404).json({
          status: "error",
          message: "State not found",
        });
      }
      const stateBounds = geoResponse.data.results[0].geometry.bounds;
      const stateLocation = geoResponse.data.results[0].geometry.location;
      const placesResponse = await axios.get(
        "https://maps.googleapis.com/maps/api/place/autocomplete/json",
        {
          params: {
            input,
            key: apiKey,
            types: "(cities)",
            location: `${stateLocation.lat},${stateLocation.lng}`,
            radius: 50000,
            components: "country:IN",
          },
        }
      );
      if (!placesResponse.data.predictions.length) {
        return res.json({
          status: "success",
          message: "No suggestions found",
          places: [],
        });
      }
      const places = placesResponse.data.predictions.map((place) => ({
        value: place.description,
        label: place.description,
        placeId: place.place_id,
      }));
      res.json({
        status: "success",
        message: "Data found",
        places,
      });
    } catch (error) {
      console.error("Error fetching place suggestions:", error);
      res.status(500).json({
        status: "error",
        message: "Error fetching data",
        error: error.message,
      });
    }
  },
  getAllSellPackages: async (req, res) => {
    try {
      const plans = [
        {
          title: "Free Listing",
          duration: "1 Month",
          price: "Free",
          features: {
            "Number Of Listings": "1",
            "Response Rate": "25",
            "Position On Search": "2X More",
            "Buyers Visibility": "Low",
            "Verified Tag": "Limited",
            "Visibility on Best Details": "No",
            "Visibility on Latest Details": "No",
            "Land Page AD": "No",
            "Land Page Banner": "No",
            "Listings Page Small ADS": "No",
            "Dedicated Agent Support": "No",
            Creatives: "No",
            "Listing Support": "No",
            "Meta ADS": "No",
            "Prime Promition": "No",
            CRM: "No",
          },
        },
        {
          title: "Basic",
          duration: "120 Days",
          price: 10999,
          features: {
            "Number Of Listings": "50",
            "Response Rate": "50",
            "Position On Search": "3X More",
            "Buyers Visibility": "50%",
            "Verified Tag": "Limited",
            "Visibility on Best Details": "No",
            "Visibility on Latest Details": "No",
            "Land Page AD": "No",
            "Land Page Banner": "No",
            "Listings Page Small ADS": "No",
            "Dedicated Agent Support": "No",
            Creatives: "No",
            "Listing Support": "No",
            "Meta ADS": "No",
            "Prime Promition": "No",
            CRM: "No",
          },
        },
        {
          title: "Prime",
          duration: "6 Months",
          price: 20999,
          isPopular: true,
          features: {
            "Number Of Listings": "150",
            "Response Rate": "150",
            "Position On Search": "5X More",
            "Buyers Visibility": "80%",
            "Verified Tag": "Unlimited",
            "Visibility on Best Details": "yes",
            "Visibility on Latest Details": "yes",
            "Land Page AD": "yes",
            "Land Page Banner": "yes",
            "Listings Page Small ADS": "yes",
            "Dedicated Agent Support": "yes",
            Creatives: "yes",
            "Listing Support": "yes",
            "Meta ADS": "No",
            "Prime Promition": "No",
            CRM: "No",
          },
        },
        {
          title: "Prime Plus",
          duration: "365 Days",
          price: 35000,
          features: {
            "Number Of Listings": "250",
            "Response Rate": "250",
            "Position On Search": "5X More",
            "Buyers Visibility": "100%",
            "Verified Tag": "Unlimited",
            "Visibility on Best Details": "yes",
            "Visibility on Latest Details": "yes",
            "Land Page AD": "yes",
            "Land Page Banner": "yes",
            "Listings Page Small ADS": "yes",
            "Dedicated Agent Support": "yes",
            Creatives: "yes",
            "Listing Support": "yes",
            "Meta ADS": "yes",
            "Prime Promition": "yes",
            CRM: "yes",
          },
        },
      ];

      // Send response
      res.status(200).json({
        success: true,
        message: "Packages retrieved successfully",
        data: plans,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving packages",
        error: error.message,
      });
    }
  },
  getAllRentPackages: async (req, res) => {
    try {
      const plans = [
        {
          title: "Free Listing",
          duration: "1 Month",
          price: "Free",
          features: {
            "Number Of Listings": "1",
            "Response Rate": "25",
            "Position On Search": "2X More",
            "Buyers Visibility": "Low",
            "Verified Tag": "Limited",
            "Visibility on Best Details": "No",
            "Visibility on Latest Details": "No",
            "Land Page AD": "No",
            "Land Page Banner": "No",
            "Listings Page Small ADS": "No",
            "Dedicated Agent Support": "No",
            Creatives: "No",
            "Listing Support": "No",
            "Meta ADS": "No",
            "Prime Promition": "No",
            CRM: "No",
          },
        },
        {
          title: "Basic",
          duration: "120 Days",
          price: 10999,
          features: {
            "Number Of Listings": "50",
            "Response Rate": "50",
            "Position On Search": "3X More",
            "Buyers Visibility": "Medium",
            "Verified Tag": "Limited",
            "Visibility on Best Details": "No",
            "Visibility on Latest Details": "No",
            "Land Page AD": "No",
            "Land Page Banner": "No",
            "Listings Page Small ADS": "No",
            "Dedicated Agent Support": "No",
            Creatives: "No",
            "Listing Support": "No",
            "Meta ADS": "No",
            "Prime Promition": "No",
            CRM: "No",
          },
        },
        {
          title: "Prime",
          duration: "6 Months",
          price: 20999,
          isPopular: true,
          features: {
            "Number Of Listings": "150",
            "Response Rate": "150",
            "Position On Search": "5X More",
            "Buyers Visibility": "High",
            "Verified Tag": "Unlimited",
            "Visibility on Best Details": "yes",
            "Visibility on Latest Details": "yes",
            "Land Page AD": "yes",
            "Land Page Banner": "yes",
            "Listings Page Small ADS": "yes",
            "Dedicated Agent Support": "yes",
            Creatives: "yes",
            "Listing Support": "yes",
            "Meta ADS": "No",
            "Prime Promition": "No",
            CRM: "No",
          },
        },
        {
          title: "Prime Plus",
          duration: "365 Days",
          price: 35000,
          features: {
            "Number Of Listings": "250",
            "Response Rate": "250",
            "Position On Search": "5X More",
            "Buyers Visibility": "High",
            "Verified Tag": "Unlimited",
            "Visibility on Best Details": "yes",
            "Visibility on Latest Details": "yes",
            "Land Page AD": "yes",
            "Land Page Banner": "yes",
            "Listings Page Small ADS": "yes",
            "Dedicated Agent Support": "yes",
            Creatives: "yes",
            "Listing Support": "yes",
            "Meta ADS": "yes",
            "Prime Promition": "yes",
            CRM: "yes",
          },
        },
      ];

      // Send response
      res.status(200).json({
        success: true,
        message: "Packages retrieved successfully",
        data: plans,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving packages",
        error: error.message,
      });
    }
  },
  getAllCommercialsPackages: async (req, res) => {
    try {
      const plans = [
        {
          title: "Free Listing",
          duration: "1 Month",
          price: "Free",
          features: {
            "Number Of Listings": "1",
            "Response Rate": "25",
            "Position On Search": "2X More",
            "Buyers Visibility": "Low",
            "Verified Tag": "Limited",
            "Visibility on Best Details": "No",
            "Visibility on Latest Details": "No",
            "Land Page AD": "No",
            "Land Page Banner": "No",
            "Listings Page Small ADS": "No",
            "Dedicated Agent Support": "No",
            Creatives: "No",
            "Listing Support": "No",
            "Meta ADS": "No",
            "Prime Promition": "No",
            CRM: "No",
          },
        },
        {
          title: "Basic",
          duration: "120 Days",
          price: 10999,
          features: {
            "Number Of Listings": "50",
            "Response Rate": "50",
            "Position On Search": "3X More",
            "Buyers Visibility": "Medium",
            "Verified Tag": "Limited",
            "Visibility on Best Details": "No",
            "Visibility on Latest Details": "No",
            "Land Page AD": "No",
            "Land Page Banner": "No",
            "Listings Page Small ADS": "No",
            "Dedicated Agent Support": "No",
            Creatives: "No",
            "Listing Support": "No",
            "Meta ADS": "No",
            "Prime Promition": "No",
            CRM: "No",
          },
        },
        {
          title: "Prime",
          duration: "6 Months",
          price: 20999,
          isPopular: true,
          features: {
            "Number Of Listings": "150",
            "Response Rate": "150",
            "Position On Search": "5X More",
            "Buyers Visibility": "High",
            "Verified Tag": "Unlimited",
            "Visibility on Best Details": "yes",
            "Visibility on Latest Details": "yes",
            "Land Page AD": "yes",
            "Land Page Banner": "yes",
            "Listings Page Small ADS": "yes",
            "Dedicated Agent Support": "yes",
            Creatives: "yes",
            "Listing Support": "yes",
            "Meta ADS": "No",
            "Prime Promition": "No",
            CRM: "No",
          },
        },
        {
          title: "Prime Plus",
          duration: "365 Days",
          price: 35000,
          features: {
            "Number Of Listings": "250",
            "Response Rate": "250",
            "Position On Search": "5X More",
            "Buyers Visibility": "High",
            "Verified Tag": "Unlimited",
            "Visibility on Best Details": "yes",
            "Visibility on Latest Details": "yes",
            "Land Page AD": "yes",
            "Land Page Banner": "yes",
            "Listings Page Small ADS": "yes",
            "Dedicated Agent Support": "yes",
            Creatives: "yes",
            "Listing Support": "yes",
            "Meta ADS": "yes",
            "Prime Promition": "yes",
            CRM: "yes",
          },
        },
      ];

      // Send response
      res.status(200).json({
        success: true,
        message: "Packages retrieved successfully",
        data: plans,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving packages",
        error: error.message,
      });
    }
  },
};
