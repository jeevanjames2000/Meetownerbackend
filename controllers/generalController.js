
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});
const apiKey = 'AIzaSyBmei9lRUUfJI-kLIPNBoc2SxEkwhKHyvU';
const axios = require('axios');

const getCities = async (req, res) => {
    try {
        const cities = await prisma.cities.findMany({
            where: {
                status: 'active',
            }
        });
        const cities_list = cities.map(type => ({
            value: type.id,
            label: type.name
        }));

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'cities fetched successfully',
            cities: cities_list
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}

const getStates = async (req, res) => {
    try {
        const states = await prisma.states.findMany({
            where: {
                status: 'active',
            }
        });
        const states_list = states.map(type => ({
            value: type.id,
            label: type.name
        }));

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'states fetched successfully',
            states: states_list
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}

const getGooglePlaces = async (req, res) => {
    const { input, type } = req.query;
    try {
        let params = {
            key: apiKey,
            input: input,
        };

        const response = await client.textSearch({ params });
        let places = [];
        const uniquePlaces = new Set();
        if (response.data.results.length > 0) {
            response.data.results.map(element => {
                if (element.formatted_address.includes("India")) {
                    if (!uniquePlaces.has(element.name)) {
                        uniquePlaces.add(element.name);
                        places.push({
                            value: element.formatted_address,
                            label: element.formatted_address,
                            placeId: element.place_id,
                            latlng: element.geometry.location,
                        });
                    }
                }
            });
        } else {
            places = [];
        }

        res.status(200).json({
            status: 'success',
            message: 'Data found',
            places,
        });
    } catch (error) {
        console.error('Error fetching place suggestions:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching data',
            error: error.message,
        });
    }
};

const getCityCenterCoordinates = async (cityName) => {
    const response = await client.geocode({
        params: {
            address: cityName,
            key: apiKey,
        },
    });

    // Assuming the first result is the most relevant one
    const cityLocation = response.data.results[0]?.geometry.location;
    if (!cityLocation) {
        throw new Error("City not found.");
    }
    return cityLocation;
};

const getLocalitiesByCity = async (req, res) => {
    const { city_id } = req.query;
    if (!city_id) {
        return res.status(400).json({
            status: "error",
            message: "City parameter is required",
        });
    }

    try {

        const city = await prisma.cities.findFirst({
            where: {
                id: parseInt(city_id),
            }
        });

        if (!city) {
            return res.status(404).json({
                status: "error",
                message: "City not found",
            });
        }

        const cityName = city.name;
        const locations = await prisma.locations.findMany({
            where: {
                city_id: parseInt(city_id),
            }
        });

        let allLocations = [];
        locations.map(location => {
            allLocations.push({
                value: location.name,
                label: location.name,
            });
        });

        const uniqueLocations = [...new Set(allLocations)];

        // Step 1: Get city coordinates
        const cityCenter = await getCityCenterCoordinates(cityName);
        const radius = 90000; // 90 km radius for nearby locations
        let nextPageToken = null;
        const allResults = [];

        // Step 2: Fetch places with pagination
        do {
            const placesResponse = await client.placesNearby({
                params: {
                    location: cityCenter,
                    radius: radius,
                    key: apiKey,
                    pagetoken: nextPageToken,
                },
            });

            allResults.push(...placesResponse.data.results);
            nextPageToken = placesResponse.data.next_page_token;

            // Avoid rate limit by waiting before making the next request
            if (nextPageToken) {
                await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay
            }
        } while (nextPageToken);

        // Step 3: Format the results
        const uniqueResults = Array.from(new Map(allResults.map(item => [item.place_id, item])).values());
        if (uniqueResults.length === 0) {
            return res.status(200).json({
                status: "error",
                message: "No localities found",
                localities: [],
            });
        }

        const localities = uniqueResults.map(item => ({
            value: item.name,
            label: item.name,
        }));

        const uniqueLocalities = [...new Set([...uniqueLocations, ...localities])];
        res.status(200).json({
            status: "success",
            message: "Localities fetched successfully",
            localities: uniqueLocalities,
        });
    } catch (error) {
        console.error("Error fetching localities:", error);
        res.status(500).json({
            status: "error",
            message: "Error fetching localities",
            error: error.message,
        });
    }
};

const getLocalitiesByCityName = async (req, res) => {
    const { input, cityname } = req.query;

    try {
        if (!input || !cityname) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required parameters: input and cityname',
            });
        }

        // Step 1: Get City Coordinates & Determine Search Radius
        let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityname)}&region=in&key=${apiKey}`;
        let geocodeResponse = await axios.get(geocodeUrl);

        if (!geocodeResponse.data.results.length) {
            return res.status(404).json({
                status: 'error',
                message: `Could not find coordinates for city: ${cityname}`,
            });
        }

        const cityLocation = geocodeResponse.data.results[0].geometry.location;
        const stateName = geocodeResponse.data.results[0].address_components.find(comp => comp.types.includes("administrative_area_level_1"))?.long_name || "";

        let searchRadius = 35000; // 100 km for metros

        // Step 2: Get Place Suggestions (Restrict to city + strict bounds)
        const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=(regions)&location=${cityLocation.lat},${cityLocation.lng}&radius=${searchRadius}&strictbounds=true&components=country:IN&key=${apiKey}`;

        const autocompleteResponse = await axios.get(autocompleteUrl);
        let places = [];
        const uniquePlaces = new Set();

        if (autocompleteResponse.data.predictions.length > 0) {
            for (let place of autocompleteResponse.data.predictions) {
                if (!uniquePlaces.has(place.place_id) &&
                    (place.description.toLowerCase().includes(cityname.toLowerCase()) ||
                        place.description.toLowerCase().includes(stateName.toLowerCase()))) {

                    uniquePlaces.add(place.place_id);

                    // Fetch Detailed Place Info
                    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=formatted_address,address_components,geometry&key=${apiKey}`;
                    const detailsResponse = await axios.get(detailsUrl);
                    const addressComponents = detailsResponse.data.result.address_components;

                    // Extract Pincode
                    let pincode = addressComponents.find(comp => comp.types.includes("postal_code"))?.long_name || "N/A";

                    places.push({
                        value: place.description,
                        label: place.description,
                        placeId: place.place_id,
                        latlng: detailsResponse.data.result.geometry.location,
                        pincode: pincode,
                    });
                }
            }
        }

        // Step 3: Filter Out Results from Other States
        let filteredPlaces = places.filter(place =>
            place.value.toLowerCase().includes(cityname.toLowerCase()) ||
            place.value.toLowerCase().includes(stateName.toLowerCase())
        );

        if (filteredPlaces.length === 0) {
            return res.status(200).json({
                status: 'error',
                message: `No results found for ${input} in ${cityname}`,
                places: [],
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Data found',
            places: filteredPlaces,
        });
    } catch (error) {
        console.error('Error fetching place suggestions:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching data',
            error: error.message,
        });
    }
};

const getLocalitiesByCityNamenew = async (req, res) => {
    const { input, city_id } = req.query;

    try {
        if (!input || !city_id) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required parameters: input and city_id',
            });
        }

        // Fetch city details from database
        const city = await prisma.cities.findFirst({
            where: { id: parseInt(city_id) },
        });

        if (!city) {
            return res.status(404).json({
                status: "error",
                message: "City not found",
            });
        }

        const cityname = city.name;

        // Step 1: Get City Coordinates & Determine Search Radius
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityname)}&region=in&key=${apiKey}`;
        const geocodeResponse = await axios.get(geocodeUrl);

        if (!geocodeResponse.data.results.length) {
            return res.status(404).json({
                status: 'error',
                message: `Could not find coordinates for city: ${cityname}`,
            });
        }

        const cityLocation = geocodeResponse.data.results[0].geometry.location;
        const stateName = geocodeResponse.data.results[0].address_components.find(comp => comp.types.includes("administrative_area_level_1"))?.long_name || "";

        // Adjust radius dynamically based on city type
        let searchRadius = 35000;

        // Step 2: Get Place Suggestions (Restrict search to city)
        const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=(regions)&location=${cityLocation.lat},${cityLocation.lng}&radius=${searchRadius}&strictbounds=true&components=country:IN&key=${apiKey}`;

        const autocompleteResponse = await axios.get(autocompleteUrl);
        let places = [];
        const uniquePlaces = new Set();

        if (autocompleteResponse.data.predictions.length > 0) {
            for (let place of autocompleteResponse.data.predictions) {
                if (!uniquePlaces.has(place.place_id) &&
                    (place.description.toLowerCase().includes(cityname.toLowerCase()) ||
                        place.description.toLowerCase().includes(stateName.toLowerCase()))) {

                    uniquePlaces.add(place.place_id);

                    // Fetch Detailed Place Info
                    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=formatted_address,address_components,geometry&key=${apiKey}`;
                    const detailsResponse = await axios.get(detailsUrl);
                    const addressComponents = detailsResponse.data.result.address_components;

                    // Extract Pincode
                    let pincode = addressComponents.find(comp => comp.types.includes("postal_code"))?.long_name || "N/A";

                    places.push({
                        value: place.description,
                        label: place.description,
                        placeId: place.place_id,
                        latlng: detailsResponse.data.result.geometry.location,
                        pincode: pincode,
                    });
                }
            }
        }

        // Step 3: Get Nearby Places (Metro Stations, Petrol Pumps, Banks, etc.)
        const categories = [
            "bank", "atm", "gas_station", "subway_station", "train_station", "bus_station", "tourist_attraction",
            "point_of_interest"
        ];

        for (let category of categories) {
            const categoryUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${cityLocation.lat},${cityLocation.lng}&radius=${searchRadius}&type=${category}&key=${apiKey}`;
            const categoryResponse = await axios.get(categoryUrl);

            if (categoryResponse.data.results.length > 0) {
                for (let place of categoryResponse.data.results) {
                    if (!uniquePlaces.has(place.place_id)) {
                        uniquePlaces.add(place.place_id);

                        let pincode = "N/A";
                        const addressComponents = place.vicinity.split(",");
                        if (addressComponents.length > 1) {
                            pincode = addressComponents[addressComponents.length - 1].trim();
                        }

                        places.push({
                            value: place.name + ", " + place.vicinity,
                            label: place.name + ", " + place.vicinity,
                            placeId: place.place_id,
                            latlng: place.geometry.location,
                            pincode: pincode,
                            category: category, // Added category
                        });
                    }
                }
            }
        }

        // Step 4: Filter Out Results from Other States
        let filteredPlaces = places.filter(place =>
            place.value.toLowerCase().includes(cityname.toLowerCase()) ||
            place.value.toLowerCase().includes(stateName.toLowerCase())
        );

        res.status(200).json({
            status: 'success',
            message: filteredPlaces.length > 0 ? 'Data found' : 'No results found for the specified city',
            places: filteredPlaces,
        });
    } catch (error) {
        console.error('Error fetching place suggestions:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching data',
            error: error.message,
        });
    }
};

exports.getCities = getCities;
exports.getStates = getStates;
exports.getGooglePlaces = getGooglePlaces;
exports.getLocalitiesByCity = getLocalitiesByCity;
exports.getLocalitiesByCityName = getLocalitiesByCityName;
exports.getLocalitiesByCityNamenew = getLocalitiesByCityNamenew;