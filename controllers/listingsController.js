
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllListings = async (req, res) => {
    const { page, limit, searchQuery, property_in, user_id, property_subtype, property_for, bedrooms, occupancy, unique_property_id, min_price_range, max_price_range } = req.query;
    try {

        if (!user_id) {
            return res.status(200).json({
                status: 'error',
                message: 'user_id is required',
            });
        }

        let offset = 0;
        if (page > 1) {
            offset = (page - 1) * limit;
        };

        const searchCondition = searchQuery
            ? { google_address: { contains: searchQuery.toLowerCase() } }
            : {};

        let bedroomsCondition = {};
        if (bedrooms) {
            if (bedrooms === "5") {
                bedroomsCondition = {
                    AND: [
                        { bedrooms: { not: null } },
                        { bedrooms: { gte: "5" } },
                    ],
                };
            } else {
                bedroomsCondition = { bedrooms: bedrooms.toString() };
            }
        }

        let propertySubtype_name;
        if (property_subtype) {
            const propertySubType = await prisma.sub_types.findFirst({
                where: {
                    id: parseInt(property_subtype),
                },
            });
            propertySubtype_name = propertySubType?.name;
        }

        let property_for_name;
        if (property_for) {
            const propertyFor = await prisma.property_for.findFirst({
                where: {
                    id: parseInt(property_for),
                },
            });
            property_for_name = propertyFor?.name;
        }
        let occupancy_name;
        if (occupancy) {
            const occupancyType = await prisma.occupancy.findFirst({
                where: {
                    id: parseInt(occupancy),
                },
            });
            occupancy_name = occupancyType?.name;
        }

        let priceRangeCondition = {};
        if (min_price_range && max_price_range) {
            if (property_for === "Sell") {
                priceRangeCondition = {
                    property_cost: {
                        gte: parseFloat(min_price_range),
                        lte: parseFloat(max_price_range),
                    },
                }
            } else if (property_for === "Rent") {
                priceRangeCondition = {
                    monthly_rent: {
                        gte: parseFloat(min_price_range),
                        lte: parseFloat(max_price_range),
                    },
                }
            } else {
                priceRangeCondition = {
                    OR: [
                        { property_cost: { gte: parseFloat(min_price_range), lte: parseFloat(max_price_range) } },
                        { monthly_rent: { gte: parseFloat(min_price_range), lte: parseFloat(max_price_range) } },
                    ],
                }
            }
        }

        // if user_id is not there return empty array
        if (!user_id) {
            return res.status(200).json({
                status: 'success',
                message: 'No user_id found',
                propertyLists: [],
                total_property_lists_count: 0,
                totalpages: 0,
                currentpage: 1,
            });
        }

        const propertyLists = await prisma.properties.findMany({
            where: {
                user_id: user_id ? parseInt(user_id) : undefined,
                property_in: property_in,
                ...(searchCondition ? searchCondition : {}),
                ...(propertySubtype_name ? { sub_type: propertySubtype_name } : {}),
                ...(property_for_name ? { property_for: property_for_name } : {}),
                ...(bedroomsCondition ? bedroomsCondition : {}),
                ...(occupancy_name ? { occupancy: occupancy_name } : {}),
                ...(unique_property_id ? { unique_property_id: unique_property_id } : {}),
                ...(priceRangeCondition ? priceRangeCondition : {}),
            },
            orderBy: {
                id: 'desc',
            },
            take: parseInt(limit),
            skip: offset,
        });

        let propertyListsData = [];

        for (const property of propertyLists) {
            // Await both count queries
            const contact_seller_count = await prisma.contact_seller.count({
                where: {
                    unique_property_id: property.unique_property_id,
                },
            });

            const searched_properties_count = await prisma.searched_properties.count({
                where: {
                    property_id: property.unique_property_id,
                },
            });
            const allEnquiresCount = contact_seller_count + searched_properties_count;

            propertyListsData.push({
                id: property.id,
                unique_property_id: property.unique_property_id,
                property_for: property.property_for,
                property_in: property.property_in,
                property_name: property.property_name,
                last_added_date: property.updated_date,
                bhk: property.bedrooms,
                furnished_status: property.furnished_status,
                image: property?.image ? `${process.env.API_URL}/uploads/${property.image}` : null,
                description: property.description,
                price: property.price,
                facing: property.facing,
                property_subtype: property.sub_type,
                property_cost: property.property_cost,
                monthly_rent: property.monthly_rent,
                expiry_date: property.expiry_date,
                property_status: property.property_status,
                all_enquires_count: allEnquiresCount,
            });
        }
        const total_property_lists_count = await prisma.properties.count({
            where: {
                user_id: user_id ? parseInt(user_id) : undefined,
                property_in: property_in,
                ...(searchCondition ? searchCondition : {}),
                ...(propertySubtype_name ? { sub_type: propertySubtype_name } : {}),
                ...(property_for_name ? { property_for: property_for_name } : {}),
                ...(bedroomsCondition ? bedroomsCondition : {}),
                ...(occupancy_name ? { occupancy: occupancy_name } : {}),
                ...(unique_property_id ? { unique_property_id: unique_property_id } : {}),
                ...(priceRangeCondition ? priceRangeCondition : {}),
            },
        });

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            propertyLists: propertyListsData,
            total_property_lists_count: total_property_lists_count,
            totalpages: Math.ceil(total_property_lists_count / limit),
            currentpage: parseInt(page),
        });
    } catch (error) {
        await prisma.$disconnect();
        return res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

const propertiesCount = async (req, res) => {
    const { user_id } = req.query;
    try {
        // need count whwre property_for = rent

        const propertiesForRentCount = await prisma.properties.count({
            where: {
                user_id: parseInt(user_id),
                property_for: 'Rent',
            },
        });

        const propertiesForSellCount = await prisma.properties.count({
            where: {
                user_id: parseInt(user_id),
                property_for: 'Sell',
            },
        });

        const propertiesForPGCount = await prisma.properties.count({
            where: {
                user_id: parseInt(user_id),
                property_for: 'PG/Co-living',
            },
        });

        const apartmentsCount = await prisma.properties.count({
            where: {
                user_id: parseInt(user_id),
                sub_type: 'Apartment',
            },
        });

        const independentHouseCount = await prisma.properties.count({
            where: {
                user_id: parseInt(user_id),
                sub_type: 'Independent House',
            },
        });

        const independentVillaCount = await prisma.properties.count({
            where: {
                user_id: parseInt(user_id),
                sub_type: 'Independent Villa',
            },
        });

        const propertiesCount = {
            properties_for_rent: propertiesForRentCount,
            properties_for_sell: propertiesForSellCount,
            properties_for_pg: propertiesForPGCount,
            apartments: apartmentsCount,
            independent_house: independentHouseCount,
            independent_villa: independentVillaCount,
        }

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            propertiesCount: propertiesCount,
        });
    } catch (error) {
        await prisma.$disconnect();
        return res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

// for dasboard
const getAllProperties = async (req, res) => {
    const { user_id } = req.query;
    try {

        if (!user_id) {
            return res.status(200).json({
                status: 'error',
                message: 'user_id is required',
            });
        }

        const properties = await prisma.properties.findMany({
            where: {
                user_id: parseInt(user_id),
            },
            orderBy: {
                id: 'desc',
            },
        });

        let propertiesData = [];
        properties.map((property) => {
            propertiesData.push({
                id: property.id,
                unique_property_id: property.unique_property_id,
                property_for: property.property_for,
                property_in: property.property_in,
                property_name: property.property_name,
                last_added_date: property.updated_date,
                bhk: property.bedrooms,
                furnished_status: property.furnished_status,
                image: property?.image ? `${process.env.API_URL}/uploads/${property.image}` : null,
                description: property.description,
                price: property.price,
                facing: property.facing,
                property_subtype: property.sub_type,
                property_cost: property.property_cost,
                monthly_rent: property.monthly_rent,
                expiry_date: property.expiry_date,
                google_address: property.google_address,
                area_units: property.area_units,
                builtup_area: property.builtup_area,
                carpet_area: property.carpet_area,
                length_area: property.length_area,
                width_area: property.width_area,
            });
        });

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            propertiesData: propertiesData,
        });
    } catch (error) {
        await prisma.$disconnect();
        return res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

const getLatestProperties = async (req, res) => {
    const { limit, type_of_property, city_id, locality_search_name } = req.query;
    try {

        if (!city_id) {
            return res.status(200).json({
                status: 'error',
                message: 'city_id is required',
            });
        }

        // get city name
        const city = await prisma.cities.findFirst({
            where: {
                id: parseInt(city_id),
            },
        });

        if (!city) {
            return res.status(200).json({
                status: 'error',
                message: 'City not found',
            });
        }

        const city_name = city.name;

        let updated_locality_serach_name;
        if (locality_search_name) {
            updated_locality_serach_name = locality_search_name?.split(", ")[0];
        }

        const properties = await prisma.properties.findMany({
            orderBy: {
                id: 'desc',
            },
            take: parseInt(limit),
            where: {
                property_status: 1,
                ...(type_of_property ? { property_for: type_of_property } : {}),
                ...(city_name ? { google_address: { contains: city_name } } : {}),
                ...(updated_locality_serach_name ? { google_address: { contains: updated_locality_serach_name } } : {}),
            }
        });

        let propertiesData = [];
        properties.map((property) => {
            propertiesData.push({
                id: property.id,
                unique_property_id: property.unique_property_id,
                property_for: property.property_for,
                property_in: property.property_in,
                property_name: property.property_name,
                last_added_date: property.updated_date,
                bedrooms: property.bedrooms,
                bathrooms: property.bathroom,
                car_parking: property.car_parking,
                furnished_status: property.furnished_status,
                // image: property?.image ? `${process.env.API_URL}/uploads/${property.image}` : null,
                image: property?.image || null,
                description: property.description,
                price: property.price,
                facing: property.facing,
                property_subtype: property.sub_type,
                property_cost: property.property_cost,
                monthly_rent: property.monthly_rent,
                expiry_date: property.expiry_date,
                google_address: property.google_address,
                area_units: property.area_units,
                builtup_area: property.builtup_area,
                carpet_area: property.carpet_area,
                length_area: property.length_area,
                width_area: property.width_area,
            });
        });

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            propertiesData: propertiesData,
        });
    } catch (error) {
        await prisma.$disconnect();
        return res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
}

// for mobile application
const getAllPropertiesnew = async (req, res) => {
    const { searched_location, searched_city, searched_property_for, searched_property_sub, searched_beds, searched_occupancy, searched_min_price, searched_max_price, page, limit } = req.query;

    try {
        // if searched_location is empty
        if (searched_location === '') {

            if (!searched_city) {
                return res.status(200).json({
                    status: 'error',
                    message: 'City is required',
                });
            }

            const city_name = await prisma.cities.findFirst({
                where: {
                    id: parseInt(searched_city)
                },
                select: {
                    name: true
                }
            });

            if (!city_name) {
                return res.status(200).json({
                    status: 'error',
                    message: 'City not found',
                });
            }

            let priceRangeCondition = {};
            if (searched_min_price && searched_max_price) {
                if (searched_property_for === "Sell") {
                    priceRangeCondition = {
                        property_cost: {
                            gte: parseFloat(searched_min_price),
                            lte: parseFloat(searched_max_price),
                        },
                    };
                } else if (searched_property_for === "Rent") {
                    priceRangeCondition = {
                        monthly_rent: {
                            gte: parseFloat(searched_min_price),
                            lte: parseFloat(searched_max_price),
                        },
                    };
                } else {
                    priceRangeCondition = {
                        OR: [
                            { property_cost: { gte: parseFloat(searched_min_price), lte: parseFloat(searched_max_price) } },
                            { monthly_rent: { gte: parseFloat(searched_min_price), lte: parseFloat(searched_max_price) } },
                        ],
                    };
                }
            }

            const properties = await prisma.properties.findMany({
                where: {
                    city_id: city_name?.name,
                    ...(searched_property_for ? { property_for: searched_property_for } : {}),
                    ...(searched_property_sub ? { sub_type: searched_property_sub } : {}),
                    ...(searched_beds ? { bedrooms: searched_beds } : {}),
                    ...(searched_occupancy ? { occupancy: searched_occupancy } : {}),
                    ...priceRangeCondition,
                },
                orderBy: {
                    id: 'desc',
                },
                take: parseInt(limit),
                skip: (parseInt(page) - 1) * parseInt(limit),
            });

            if (properties.length === 0) {
                await prisma.$disconnect();
                return res.status(200).json({
                    status: 'error',
                    message: 'No properties found.',
                    propertiesData: [],
                });
            }

            let propertiesData = [];
            properties.map((property) => {
                propertiesData.push({
                    id: property.id.toString(),
                    unique_property_id: property.unique_property_id,
                    property_name: property.property_name,
                    user_id: property.user_id,
                    expiry_date: property.expiry_date,
                    property_type: property.property_type,
                    sub_type: property.sub_type,
                    property_for: property.property_for,
                    unit_flat_house_no: property.unit_flat_house_no,
                    state_id: property.state_id,
                    city_id: property.city_id,
                    location_id: property.location_id,
                    street: property.street,
                    address: property.address,
                    zipcode: property.zipcode,
                    latitude: property.latitude,
                    longitude: property.longitude,
                    bedrooms: property.bedrooms,
                    builtup_area: property.builtup_area,
                    builtup_unit: property.builtup_unit,
                    additional_amount: property.additional_amount,
                    property_cost: property.property_cost,
                    bathroom: property.bathroom,
                    balconies: property.balconies,
                    property_in: property.property_in,
                    facing: property.facing,
                    car_parking: property.car_parking,
                    bike_parking: property.bike_parking,
                    facilities: property.facilities,
                    floors: property.floors,
                    furnished_status: property.furnished_status,
                    transaction_type: property.transaction_type,
                    owner_name: property.owner_name,
                    mobile: property.mobile,
                    whatsapp: property.whatsapp,
                    landline: property.landline,
                    email: property.email,
                    occupancy: property.occupancy,
                    description: property.description,
                    video_link: property.video_link,
                    property_status: property.property_status,
                    admin_approved_status: property.admin_approved_status,
                    posted_by: property.posted_by,
                    paid_details: property.paid_details,
                    other_info: property.other_info,
                    created_date: property.created_date,
                    created_time: property.created_time,
                    updated_date: property.updated_date,
                    updated_time: property.updated_time,
                    admin_approval_date: property.admin_approval_date,
                    image: property.image,
                    google_address: property.google_address,
                    user_type: property.user_type,
                    total_floors: property.total_floors,
                    open_parking: property.open_parking,
                    carpet_area: property.carpet_area,
                    under_construction: property.under_construction,
                    ready_to_move: property.ready_to_move,
                    updated_from: property.updated_from,
                    property_age: property.property_age,
                    types: property.types,
                    available_from: property.available_from,
                    monthly_rent: property.monthly_rent,
                    security_deposit: property.security_deposit,
                    maintenance: property.maintenance,
                    lock_in: property.lock_in,
                    brokerage_charge: property.brokerage_charge,
                    plot_area: property.plot_area,
                    ownership_type: property.ownership_type,
                    length_area: property.length_area,
                    width_area: property.width_area,
                    zone_types: property.zone_types,
                    business_types: property.business_types,
                    rera_approved: property.rera_approved,
                    passenger_lifts: property.passenger_lifts,
                    service_lifts: property.service_lifts,
                    stair_cases: property.stair_cases,
                    private_parking: property.private_parking,
                    public_parking: property.public_parking,
                    private_washrooms: property.private_washrooms,
                    public_washrooms: property.public_washrooms,
                    area_units: property.area_units,
                    pent_house: property.pent_house,
                    servant_room: property.servant_room,
                    builder_plot: property.builder_plot,
                    loan_facility: property.loan_facility,
                    investor_property: property.investor_property,
                    pantry_room: property.pantry_room,
                    plot_number: property.plot_number,
                    possession_status: property.possession_status,
                    uploaded_from_seller_panel: property.uploaded_from_seller_panel,
                    featured_property: property.featured_property,
                    total_project_area: property.total_project_area,
                });
            });

            await prisma.$disconnect();
            return res.status(200).json({
                status: 'success',
                propertiesData: propertiesData,
            });
        } else {
            // search with city name and location

            const city_name = await prisma.cities.findFirst({
                where: {
                    id: parseInt(searched_city)
                },
                select: {
                    name: true
                }
            });

            if (!city_name) {
                return res.status(200).json({
                    status: 'error',
                    message: 'City not found',
                });
            }

            let priceRangeCondition = {};
            if (searched_min_price && searched_max_price) {
                if (searched_property_for === "Sell") {
                    priceRangeCondition = {
                        property_cost: {
                            gte: parseFloat(searched_min_price),
                            lte: parseFloat(searched_max_price),
                        },
                    };
                } else if (searched_property_for === "Rent") {
                    priceRangeCondition = {
                        monthly_rent: {
                            gte: parseFloat(searched_min_price),
                            lte: parseFloat(searched_max_price),
                        },
                    };
                } else {
                    priceRangeCondition = {
                        OR: [
                            { property_cost: { gte: parseFloat(searched_min_price), lte: parseFloat(searched_max_price) } },
                            { monthly_rent: { gte: parseFloat(searched_min_price), lte: parseFloat(searched_max_price) } },
                        ],
                    };
                }
            }

            const properties = await prisma.properties.findMany({
                where: {
                    AND: [
                        city_name?.name ? { city_id: city_name?.name } : {},
                        // searched_location ? { google_address: { contains: searched_location } } : {},
                        { OR: [{ google_address: { contains: searched_location } }, { location_id: { contains: searched_location } }] },
                    ],
                    ...(searched_property_for ? { property_for: searched_property_for } : {}),
                    ...(searched_property_sub ? { sub_type: searched_property_sub } : {}),
                    ...(searched_beds ? { bedrooms: searched_beds } : {}),
                    ...(searched_occupancy ? { occupancy: searched_occupancy } : {}),
                    ...priceRangeCondition,
                },
                orderBy: {
                    id: 'desc',
                },
                take: parseInt(limit),
                skip: (parseInt(page) - 1) * parseInt(limit),
            });

            let propertiesData = [];

            ///city name and search location
            if (properties?.length !== 0) {
                properties.map((property) => {
                    propertiesData.push({
                        id: property.id.toString(),
                        unique_property_id: property.unique_property_id,
                        property_name: property.property_name,
                        user_id: property.user_id,
                        expiry_date: property.expiry_date,
                        property_type: property.property_type,
                        sub_type: property.sub_type,
                        property_for: property.property_for,
                        unit_flat_house_no: property.unit_flat_house_no,
                        state_id: property.state_id,
                        city_id: property.city_id,
                        location_id: property.location_id,
                        street: property.street,
                        address: property.address,
                        zipcode: property.zipcode,
                        latitude: property.latitude,
                        longitude: property.longitude,
                        bedrooms: property.bedrooms,
                        builtup_area: property.builtup_area,
                        builtup_unit: property.builtup_unit,
                        additional_amount: property.additional_amount,
                        property_cost: property.property_cost,
                        bathroom: property.bathroom,
                        balconies: property.balconies,
                        property_in: property.property_in,
                        facing: property.facing,
                        car_parking: property.car_parking,
                        bike_parking: property.bike_parking,
                        facilities: property.facilities,
                        floors: property.floors,
                        furnished_status: property.furnished_status,
                        transaction_type: property.transaction_type,
                        owner_name: property.owner_name,
                        mobile: property.mobile,
                        whatsapp: property.whatsapp,
                        landline: property.landline,
                        email: property.email,
                        occupancy: property.occupancy,
                        description: property.description,
                        video_link: property.video_link,
                        property_status: property.property_status,
                        admin_approved_status: property.admin_approved_status,
                        posted_by: property.posted_by,
                        paid_details: property.paid_details,
                        other_info: property.other_info,
                        created_date: property.created_date,
                        created_time: property.created_time,
                        updated_date: property.updated_date,
                        updated_time: property.updated_time,
                        admin_approval_date: property.admin_approval_date,
                        image: property.image,
                        google_address: property.google_address,
                        user_type: property.user_type,
                        total_floors: property.total_floors,
                        open_parking: property.open_parking,
                        carpet_area: property.carpet_area,
                        under_construction: property.under_construction,
                        ready_to_move: property.ready_to_move,
                        updated_from: property.updated_from,
                        property_age: property.property_age,
                        types: property.types,
                        available_from: property.available_from,
                        monthly_rent: property.monthly_rent,
                        security_deposit: property.security_deposit,
                        maintenance: property.maintenance,
                        lock_in: property.lock_in,
                        brokerage_charge: property.brokerage_charge,
                        plot_area: property.plot_area,
                        ownership_type: property.ownership_type,
                        length_area: property.length_area,
                        width_area: property.width_area,
                        zone_types: property.zone_types,
                        business_types: property.business_types,
                        rera_approved: property.rera_approved,
                        passenger_lifts: property.passenger_lifts,
                        service_lifts: property.service_lifts,
                        stair_cases: property.stair_cases,
                        private_parking: property.private_parking,
                        public_parking: property.public_parking,
                        private_washrooms: property.private_washrooms,
                        public_washrooms: property.public_washrooms,
                        area_units: property.area_units,
                        pent_house: property.pent_house,
                        servant_room: property.servant_room,
                        builder_plot: property.builder_plot,
                        loan_facility: property.loan_facility,
                        investor_property: property.investor_property,
                        pantry_room: property.pantry_room,
                        plot_number: property.plot_number,
                        possession_status: property.possession_status,
                        uploaded_from_seller_panel: property.uploaded_from_seller_panel,
                        featured_property: property.featured_property,
                        total_project_area: property.total_project_area,
                    });
                });
            } else {
                //search location split with , 
                let newsearchlocation = searched_location.split(",")[0];

                const properties = await prisma.properties.findMany({
                    where: {
                        AND: [
                            city_name?.name ? { city_id: city_name?.name } : {},
                            // newsearchlocation ? { google_address: { contains: newsearchlocation } } : {},
                            { OR: [{ google_address: { contains: newsearchlocation } }, { location_id: { contains: newsearchlocation } }] },
                        ],
                        ...(searched_property_for ? { property_for: searched_property_for } : {}),
                        ...(searched_property_sub ? { sub_type: searched_property_sub } : {}),
                        ...(searched_beds ? { bedrooms: searched_beds } : {}),
                        ...(searched_occupancy ? { occupancy: searched_occupancy } : {}),
                        ...priceRangeCondition,
                    },
                    orderBy: {
                        id: 'desc',
                    },
                    take: parseInt(limit),
                    skip: (parseInt(page) - 1) * parseInt(limit),
                });

                if (properties.length === 0) {
                    await prisma.$disconnect();
                    return res.status(200).json({
                        status: 'error',
                        message: 'No properties found.',
                        propertiesData: [],
                    });
                }

                properties.map((property) => {
                    propertiesData.push({
                        id: property.id.toString(),
                        unique_property_id: property.unique_property_id,
                        property_name: property.property_name,
                        user_id: property.user_id,
                        expiry_date: property.expiry_date,
                        property_type: property.property_type,
                        sub_type: property.sub_type,
                        property_for: property.property_for,
                        unit_flat_house_no: property.unit_flat_house_no,
                        state_id: property.state_id,
                        city_id: property.city_id,
                        location_id: property.location_id,
                        street: property.street,
                        address: property.address,
                        zipcode: property.zipcode,
                        latitude: property.latitude,
                        longitude: property.longitude,
                        bedrooms: property.bedrooms,
                        builtup_area: property.builtup_area,
                        builtup_unit: property.builtup_unit,
                        additional_amount: property.additional_amount,
                        property_cost: property.property_cost,
                        bathroom: property.bathroom,
                        balconies: property.balconies,
                        property_in: property.property_in,
                        facing: property.facing,
                        car_parking: property.car_parking,
                        bike_parking: property.bike_parking,
                        facilities: property.facilities,
                        floors: property.floors,
                        furnished_status: property.furnished_status,
                        transaction_type: property.transaction_type,
                        owner_name: property.owner_name,
                        mobile: property.mobile,
                        whatsapp: property.whatsapp,
                        landline: property.landline,
                        email: property.email,
                        occupancy: property.occupancy,
                        description: property.description,
                        video_link: property.video_link,
                        property_status: property.property_status,
                        admin_approved_status: property.admin_approved_status,
                        posted_by: property.posted_by,
                        paid_details: property.paid_details,
                        other_info: property.other_info,
                        created_date: property.created_date,
                        created_time: property.created_time,
                        updated_date: property.updated_date,
                        updated_time: property.updated_time,
                        admin_approval_date: property.admin_approval_date,
                        image: property.image,
                        google_address: property.google_address,
                        user_type: property.user_type,
                        total_floors: property.total_floors,
                        open_parking: property.open_parking,
                        carpet_area: property.carpet_area,
                        under_construction: property.under_construction,
                        ready_to_move: property.ready_to_move,
                        updated_from: property.updated_from,
                        property_age: property.property_age,
                        types: property.types,
                        available_from: property.available_from,
                        monthly_rent: property.monthly_rent,
                        security_deposit: property.security_deposit,
                        maintenance: property.maintenance,
                        lock_in: property.lock_in,
                        brokerage_charge: property.brokerage_charge,
                        plot_area: property.plot_area,
                        ownership_type: property.ownership_type,
                        length_area: property.length_area,
                        width_area: property.width_area,
                        zone_types: property.zone_types,
                        business_types: property.business_types,
                        rera_approved: property.rera_approved,
                        passenger_lifts: property.passenger_lifts,
                        service_lifts: property.service_lifts,
                        stair_cases: property.stair_cases,
                        private_parking: property.private_parking,
                        public_parking: property.public_parking,
                        private_washrooms: property.private_washrooms,
                        public_washrooms: property.public_washrooms,
                        area_units: property.area_units,
                        pent_house: property.pent_house,
                        servant_room: property.servant_room,
                        builder_plot: property.builder_plot,
                        loan_facility: property.loan_facility,
                        investor_property: property.investor_property,
                        pantry_room: property.pantry_room,
                        plot_number: property.plot_number,
                        possession_status: property.possession_status,
                        uploaded_from_seller_panel: property.uploaded_from_seller_panel,
                        featured_property: property.featured_property,
                        total_project_area: property.total_project_area,
                    });
                });

            }

            await prisma.$disconnect();
            return res.status(200).json({
                status: 'success',
                propertiesData: propertiesData,
            });


        }
    } catch (error) {
        await prisma.$disconnect();
        return res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
}

const getSingleProperty = async (req, res) => {
    const { unique_property_id } = req.query;
    try {
        const property = await prisma.properties.findFirst({
            where: {
                unique_property_id: unique_property_id,
            },
        });

        if (!property) {
            await prisma.$disconnect();
            return res.status(200).json({
                status: 'error',
                message: 'Property not found',
            });
        }

        // need user details based on the user_id

        const seller_details = await prisma.users.findFirst({
            where: {
                id: property?.user_id,
            },
            select: {
                name: true,
                email: true,
                mobile: true,
            }
        });

        let property_details = {
            id: property?.id?.toString(),
            unique_property_id: property.unique_property_id,
            property_name: property.property_name,
            user_id: property.user_id?.toString(),
            expiry_date: property.expiry_date,
            property_type: property.property_type,
            sub_type: property.sub_type,
            property_for: property.property_for,
            unit_flat_house_no: property.unit_flat_house_no,
            state_id: property.state_id,
            city_id: property.city_id,
            location_id: property.location_id,
            street: property.street,
            address: property.address,
            zipcode: property.zipcode,
            latitude: property.latitude,
            longitude: property.longitude,
            bedrooms: property.bedrooms,
            builtup_area: property.builtup_area,
            builtup_unit: property.builtup_unit,
            additional_amount: property.additional_amount,
            property_cost: property.property_cost,
            bathroom: property.bathroom,
            balconies: property.balconies,
            property_in: property.property_in,
            facing: property.facing,
            car_parking: property.car_parking,
            bike_parking: property.bike_parking,
            facilities: property.facilities,
            floors: property.floors,
            furnished_status: property.furnished_status,
            transaction_type: property.transaction_type,
            owner_name: property.owner_name,
            mobile: property.mobile,
            whatsapp: property.whatsapp,
            landline: property.landline,
            email: property.email,
            occupancy: property.occupancy,
            description: property.description,
            video_link: property.video_link,
            property_status: property.property_status,
            admin_approved_status: property.admin_approved_status,
            posted_by: property.posted_by,
            paid_details: property.paid_details,
            other_info: property.other_info,
            created_date: property.created_date,
            created_time: property.created_time,
            updated_date: property.updated_date,
            updated_time: property.updated_time,
            admin_approval_date: property.admin_approval_date,
            image: property.image,
            google_address: property.google_address,
            user_type: property.user_type,
            total_floors: property.total_floors,
            open_parking: property.open_parking,
            carpet_area: property.carpet_area,
            under_construction: property.under_construction,
            ready_to_move: property.ready_to_move,
            updated_from: property.updated_from,
            property_age: property.property_age,
            types: property.types,
            available_from: property.available_from,
            monthly_rent: property.monthly_rent,
            security_deposit: property.security_deposit,
            maintenance: property.maintenance,
            lock_in: property.lock_in,
            brokerage_charge: property.brokerage_charge,
            plot_area: property.plot_area,
            ownership_type: property.ownership_type,
            length_area: property.length_area,
            width_area: property.width_area,
            zone_types: property.zone_types,
            business_types: property.business_types,
            rera_approved: property.rera_approved,
            passenger_lifts: property.passenger_lifts,
            service_lifts: property.service_lifts,
            stair_cases: property.stair_cases,
            private_parking: property.private_parking,
            public_parking: property.public_parking,
            private_washrooms: property.private_washrooms,
            public_washrooms: property.public_washrooms,
            area_units: property.area_units,
            pent_house: property.pent_house,
            servant_room: property.servant_room,
            builder_plot: property.builder_plot,
            loan_facility: property.loan_facility,
            investor_property: property.investor_property,
            pantry_room: property.pantry_room,
            plot_number: property.plot_number,
            possession_status: property.possession_status,
            uploaded_from_seller_panel: property.uploaded_from_seller_panel,
            featured_property: property.featured_property,
            total_project_area: property.total_project_area,
            seller_details: seller_details
        }

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            property_details: property_details,
        });
    } catch (error) {
        await prisma.$disconnect();
        return res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
}

exports.getAllListings = getAllListings;
exports.propertiesCount = propertiesCount;
exports.getAllProperties = getAllProperties;
exports.getLatestProperties = getLatestProperties;
exports.getAllPropertiesnew = getAllPropertiesnew;
exports.getSingleProperty = getSingleProperty;