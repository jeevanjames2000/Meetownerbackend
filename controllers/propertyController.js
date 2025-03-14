const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multiparty = require('multiparty');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

const addBasicdetails = async (req, res) => {
    const { property_in, property_for, transaction_type, user_id, unique_property_id, user_type, google_address } = req.body;
    try {

        if (!user_id) {
            return res.status(200).json({
                status: 'error',
                message: 'User id is required, please login and try again'
            });
        }

        let property_for_name;
        if (property_for) {
            const property_for_data = await prisma.property_for.findFirst({
                where: {
                    id: property_for
                }
            });
            if (property_for_data) {
                property_for_name = property_for_data.name;
            }
        }

        let property_in_name;
        if (property_in) {
            const property_in_data = await prisma.property_in.findFirst({
                where: {
                    id: property_in
                }
            });
            if (property_in_data) {
                property_in_name = property_in_data.name;
            }
        }

        let transaction_type_name;
        if (transaction_type) {
            const transaction_type_data = await prisma.transaction_type.findFirst({
                where: {
                    id: transaction_type
                }
            });
            if (transaction_type_data) {
                transaction_type_name = transaction_type_data.name;
            }
        }

        const updated_date = new Date().toISOString();
        // if unique_property_id is there then update the data based on the unqiue_property_id otherwise create a new record
        if (unique_property_id) {
            const property = await prisma.properties.findFirst({
                where: {
                    user_id: parseInt(user_id),
                    unique_property_id: unique_property_id
                }
            });

            if (!property) {
                return res.status(200).json({
                    status: 'error',
                    message: 'Property not found'
                });
            }

            const updated_property = await prisma.properties.update({
                where: {
                    id: property.id
                },
                data: {
                    property_in: property_in_name,
                    property_for: property_for_name,
                    transaction_type: transaction_type_name,
                    user_type: user_type,
                    google_address: google_address,
                    updated_date: updated_date
                }
            });

            const property_details = {
                property_id: updated_property.id,
                unique_property_id: updated_property.unique_property_id,
                property_in: updated_property.property_in,
                property_for: updated_property.property_for,
                transaction_type: updated_property.transaction_type,
                user_type: updated_property.user_type,
                updated_date: updated_property.updated_date
            }
            await prisma.$disconnect();
            return res.status(200).json({
                status: 'success',
                message: 'Property details updated successfully',
                property: property_details
            });
        }

        const uniquepropertyid = 'MO-' + Math.floor(100000 + Math.random() * 900000);
        const property = await prisma.properties.create({
            data: {
                user_id: user_id,
                unique_property_id: uniquepropertyid,
                property_in: property_in_name,
                property_for: property_for_name,
                transaction_type: transaction_type_name,
                user_type: user_type,
                google_address: google_address,
                updated_date: updated_date,
            }
        });

        const property_details = {
            property_id: property.id,
            unique_property_id: property.unique_property_id,
            property_in: property.property_in,
            property_for: property.property_for,
            transaction_type: property.transaction_type,
            user_type: property.user_type,
        }

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'Property details added successfully',
            property: property_details
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

const getBasicdetails = async (req, res) => {
    const { user_id, unique_property_id } = req.query;
    try {
        const property = await prisma.properties.findFirst({
            where: {
                user_id: parseInt(user_id),
                unique_property_id: unique_property_id
            }
        });

        if (!property) {
            return res.status(200).json({
                status: 'error',
                message: 'Property not found'
            });
        }

        let property_for_id;
        if (property?.property_for) {
            const property_for_data = await prisma.property_for.findFirst({
                where: {
                    name: property.property_for
                }
            });
            if (property_for_data) {
                property_for_id = property_for_data.id;
            }
        }

        let property_in_id;
        if (property?.property_in) {
            const property_in_data = await prisma.property_in.findFirst({
                where: {
                    name: property.property_in
                }
            });
            if (property_in_data) {
                property_in_id = property_in_data.id;
            }
        }

        let transaction_type_id;
        if (property?.transaction_type) {
            const transaction_type_data = await prisma.transaction_type.findFirst({
                where: {
                    name: property.transaction_type
                }
            });
            if (transaction_type_data) {
                transaction_type_id = transaction_type_data.id;
            }
        }

        const property_details = {
            property_id: property.id,
            unique_property_id: property.unique_property_id,
            property_in: property_in_id,
            property_for: property_for_id,
            transaction_type: transaction_type_id,
            google_address: property.google_address
        }
        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'Property details fetched successfully',
            property: property_details
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

const addPropertyDetails = async (req, res) => {
    const {
        sub_type, rera_approved,
        occupancy, bedrooms, bathroom, balconies, furnished_status,
        passenger_lifts, service_lifts, stair_cases, private_parking, public_parking, private_washrooms, public_washrooms, available_from,
        property_age, under_construction, monthly_rent, maintenance, security_deposit, lock_in, brokerage_charge,
        types, area_units, builtup_area, carpet_area, length_area, width_area,
        plot_area, total_project_area, pent_house, builtup_unit, property_cost, possession_status, ownership_type, facilities, other_info,
        unit_flat_house_no, plot_number, business_types, zone_types, investor_property, builder_plot, loan_facility,
        facing, car_parking, bike_parking, open_parking, servant_room, pantry_room, description,
        google_address, user_id, unique_property_id, total_places_around_property
    } = req.body;

    try {
        if (unique_property_id) {
            const property = await prisma.properties.findFirst({
                where: {
                    user_id: parseInt(user_id),
                    unique_property_id: unique_property_id
                }
            });

            if (!property) {
                return res.status(200).json({
                    status: 'error',
                    message: 'Property not found'
                });
            }
            let new_rera_approved;
            if (rera_approved === 'Yes') {
                new_rera_approved = 1;
            } else {
                new_rera_approved = 0;
            }

            let buisness_type_name;
            if (business_types) {
                const business_type = await prisma.business_types.findFirst({
                    where: {
                        id: business_types
                    }
                });
                if (business_type) {
                    buisness_type_name = business_type.name;
                }
            }

            let facing_name;
            if (facing) {
                const facing_type = await prisma.facing.findFirst({
                    where: {
                        id: facing
                    }
                });
                if (facing_type) {
                    facing_name = facing_type.name;
                }
            }

            let furnished_status_name;
            if (furnished_status) {
                const furnished_status_type = await prisma.furnished.findFirst({
                    where: {
                        id: furnished_status
                    }
                });
                if (furnished_status_type) {
                    furnished_status_name = furnished_status_type.name;
                }
            }

            let occupancy_name;
            if (occupancy) {
                const occupancy_type = await prisma.occupancy.findFirst({
                    where: {
                        id: occupancy
                    }
                });
                if (occupancy_type) {
                    occupancy_name = occupancy_type.name;
                }
            }

            let ownership_type_name;
            if (ownership_type) {
                const ownership_type_data = await prisma.ownership_type.findFirst({
                    where: {
                        id: ownership_type
                    }
                });
                if (ownership_type_data) {
                    ownership_type_name = ownership_type_data.name;
                }
            }

            let zone_types_name;
            if (zone_types) {
                const zone_types_data = await prisma.zone_types.findFirst({
                    where: {
                        id: zone_types
                    }
                });
                if (zone_types_data) {
                    zone_types_name = zone_types_data.name;
                }
            }

            let types_name;
            if (types) {
                const types_data = await prisma.types.findFirst({
                    where: {
                        id: types
                    }
                });
                if (types_data) {
                    types_name = types_data.name;
                }
            }

            let area_units_name;
            if (area_units) {
                const area_units_data = await prisma.area_units.findFirst({
                    where: {
                        id: parseInt(area_units)
                    }
                });
                if (area_units_data) {
                    area_units_name = area_units_data.name;
                }
            }

            const updated_date = new Date().toISOString();
            const updated_property = await prisma.properties.update({
                where: {
                    id: property.id
                },
                data: {
                    sub_type: sub_type,
                    rera_approved: new_rera_approved,
                    occupancy: occupancy_name,
                    bedrooms: bedrooms.toString(),
                    bathroom: parseInt(bathroom),
                    balconies: parseInt(balconies),
                    furnished_status: furnished_status_name,
                    property_age: parseFloat(property_age),
                    area_units: area_units_name,
                    builtup_area: parseFloat(builtup_area),
                    carpet_area: parseFloat(carpet_area),
                    property_cost: parseFloat(property_cost),
                    facilities: facilities,
                    other_info: other_info,
                    builtup_unit: builtup_unit,
                    monthly_rent: parseFloat(monthly_rent),
                    maintenance: maintenance?.toString(),
                    lock_in: lock_in,
                    brokerage_charge: parseFloat(brokerage_charge),
                    security_deposit: parseFloat(security_deposit),
                    under_construction: under_construction,
                    types: types_name,
                    // additional details
                    facing: facing_name,
                    open_parking: open_parking,
                    car_parking: parseInt(car_parking),
                    bike_parking: parseInt(bike_parking),
                    passenger_lifts: parseInt(passenger_lifts),
                    service_lifts: parseInt(service_lifts),
                    stair_cases: parseInt(stair_cases),
                    private_parking: parseInt(private_parking),
                    public_parking: parseInt(public_parking),
                    private_washrooms: parseInt(private_washrooms),
                    public_washrooms: parseInt(public_washrooms),
                    available_from: available_from,
                    ownership_type: ownership_type_name,
                    plot_area: plot_area,
                    zone_types: zone_types_name,
                    business_types: buisness_type_name,
                    length_area: length_area,
                    width_area: width_area,
                    google_address: google_address,
                    description: description,
                    unit_flat_house_no: unit_flat_house_no,
                    plot_number: plot_number?.toString(),
                    pent_house: pent_house,
                    total_project_area: total_project_area,
                    possession_status: possession_status,
                    servant_room: servant_room,
                    pantry_room: pantry_room,
                    investor_property: investor_property,
                    builder_plot: builder_plot,
                    loan_facility: loan_facility,
                    updated_date: updated_date
                }
            });

            // total_places_around_property is an array of objects 
            // each object contains placeid, place, distance
            // add only if placeid is null

            if (total_places_around_property) {
                for (let i = 0; i < total_places_around_property.length; i++) {
                    if (!total_places_around_property[i].placeid) {
                        await prisma.around_this_property.create({
                            data: {
                                unique_property_id: unique_property_id,
                                title: total_places_around_property[i].place,
                                distance: total_places_around_property[i].distance
                            }
                        });
                    }
                }
            }

            const property_details = {
                property_id: updated_property.id,
                unique_property_id: updated_property.unique_property_id,
                sub_type: updated_property.sub_type,
                rera_approved: updated_property.rera_approved,
                occupancy: updated_property.occupancy,
                bedrooms: updated_property.bedrooms,
                bathroom: updated_property.bathroom,
                balconies: updated_property.balconies,
                furnished_status: updated_property.furnished_status,
                monthly_rent: parseInt(updated_property?.monthly_rent),
                open_parking: updated_property?.open_parking,
                maintenance: parseInt(updated_property.maintenance),
                lock_in: updated_property.lock_in,
                brokerage_charge: updated_property.brokerage_charge,
                builtup_area: updated_property.builtup_area,
                carpet_area: updated_property.carpet_area,
                length_area: updated_property.length_area,
                width_area: updated_property.width_area,
                facing: updated_property.facing,
                google_address: updated_property.google_address,
                description: updated_property.description,
                area_units: updated_property.area_units,
                property_cost: updated_property.property_cost,
                facilities: updated_property.facilities,
                other_info: updated_property.other_info,
                under_construction: updated_property.under_construction,
                types: updated_property.types,
                // additional details
                passenger_lifts: updated_property.passenger_lifts,
                service_lifts: updated_property.service_lifts,
                stair_cases: updated_property.stair_cases,
                private_parking: updated_property.private_parking,
                public_parking: updated_property.public_parking,
                private_washrooms: updated_property.private_washrooms,
                public_washrooms: updated_property.public_washrooms,
                available_from: updated_property.available_from,
                ownership_type: updated_property.ownership_type,
                plot_area: updated_property.plot_area,
                zone_types: updated_property.zone_types,
                business_types: updated_property.business_types,
                builtup_unit: updated_property.builtup_unit,
                unit_flat_house_no: updated_property.unit_flat_house_no,
                pent_house: updated_property.pent_house,
                total_project_area: updated_property.total_project_area,
                possession_status: updated_property.possession_status,
                servant_room: updated_property.servant_room,
                pantry_room: updated_property.pantry_room,
                investor_property: updated_property.investor_property,
                builder_plot: updated_property.builder_plot,
                loan_facility: updated_property.loan_facility,
                updated_date: updated_property.updated_date,
            }
            await prisma.$disconnect();
            return res.status(200).json({
                status: 'success',
                message: 'Property details updated successfully',
                property: property_details
            });
        } else {
            return res.status(200).json({
                status: 'error',
                message: 'basic details need to fill first before adding property details'
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

const deleteplacesaroundproperty = async (req, res) => {
    const { placeid, unique_property_id } = req.body;
    try {
        const place = await prisma.around_this_property.findFirst({
            where: {
                id: placeid,
                unique_property_id: unique_property_id
            }
        });

        if (!place) {
            return res.status(200).json({
                status: 'error',
                message: 'Place not found'
            });
        }

        await prisma.around_this_property.delete({
            where: {
                id: placeid,
                unique_property_id: unique_property_id
            }
        });

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'Place deleted successfully'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

const getPropertyDetails = async (req, res) => {
    const { user_id, unique_property_id } = req.query;
    try {
        const property = await prisma.properties.findFirst({
            where: {
                user_id: parseInt(user_id),
                unique_property_id: unique_property_id
            }
        });

        if (!property) {
            return res.status(200).json({
                status: 'error',
                message: 'Property not found'
            });
        }

        let new_rera_approved;
        if (property.rera_approved === 1) {
            new_rera_approved = 'Yes';
        } else if (property.rera_approved === 2) {
            new_rera_approved = 'No';
        }

        let business_type_id;
        if (property?.business_types) {
            const business_type = await prisma.business_types.findFirst({
                where: {
                    name: property.business_types
                }
            });
            if (business_type) {
                business_type_id = business_type.id;
            }
        }

        let facing_id;
        if (property?.facing) {
            const facing_type = await prisma.facing.findFirst({
                where: {
                    name: property.facing
                }
            });
            if (facing_type) {
                facing_id = facing_type.id;
            }
        }

        let furnished_status_id;
        if (property?.furnished_status) {
            const furnished_status_type = await prisma.furnished.findFirst({
                where: {
                    name: property.furnished_status
                }
            });
            if (furnished_status_type) {
                furnished_status_id = furnished_status_type.id;
            }
        }

        let occupancy_id;
        if (property?.occupancy) {
            const occupancy_type = await prisma.occupancy.findFirst({
                where: {
                    name: property.occupancy
                }
            });
            if (occupancy_type) {
                occupancy_id = occupancy_type.id;
            }
        }

        let ownership_type_id;
        if (property?.ownership_type) {
            const ownership_type_data = await prisma.ownership_type.findFirst({
                where: {
                    name: property.ownership_type
                }
            });
            if (ownership_type_data) {
                ownership_type_id = ownership_type_data.id;
            }
        }

        let zone_types_id;
        if (property?.zone_types) {
            const zone_types_data = await prisma.zone_types.findFirst({
                where: {
                    name: property.zone_types
                }
            });
            if (zone_types_data) {
                zone_types_id = zone_types_data.id;
            }
        }

        let types_id;
        if (property?.types) {
            const types_data = await prisma.types.findFirst({
                where: {
                    name: property.types
                }
            });
            if (types_data) {
                types_id = types_data.id;
            }
        }

        let area_units_id;
        if (property?.area_units) {
            const area_units_data = await prisma.area_units.findFirst({
                where: {
                    name: property.area_units
                }
            });
            if (area_units_data) {
                area_units_id = area_units_data.id;
            }
        }

        // get the total places around the property
        const total_places_around_property = await prisma.around_this_property.findMany({
            where: {
                unique_property_id: unique_property_id
            }
        });

        const updated_total_places_around_property = total_places_around_property.map(place => ({
            placeid: place.id,
            place: place.title,
            distance: place.distance
        }));

        const property_details = {
            property_id: property.id,
            unique_property_id: property.unique_property_id,
            sub_type: property.sub_type,
            rera_approved: new_rera_approved,
            occupancy: occupancy_id,
            bedrooms: parseInt(property?.bedrooms),
            bathroom: property?.bathroom?.toString(),
            balconies: property?.balconies,
            furnished_status: furnished_status_id,
            property_age: property?.property_age?.toString(),
            area_units: area_units_id,
            area_units_name: property.area_units,
            builtup_area: property?.builtup_area?.toString(),
            carpet_area: property?.carpet_area?.toString(),
            property_cost: property?.property_cost?.toString(),
            facilities: property.facilities,
            other_info: property.other_info,
            facing: facing_id,
            open_parking: property.open_parking,
            car_parking: property?.car_parking?.toString(),
            bike_parking: property?.bike_parking?.toString(),
            builtup_unit: property?.builtup_unit,
            security_deposit: property?.security_deposit?.toString(),
            monthly_rent: parseInt(property?.monthly_rent),
            maintenance: parseInt(property?.maintenance),
            lock_in: property?.lock_in,
            brokerage_charge: property?.brokerage_charge?.toString(),
            under_construction: property.under_construction,
            length_area: property.length_area,
            width_area: property.width_area,
            passenger_lifts: property.passenger_lifts,
            service_lifts: property.service_lifts,
            stair_cases: property.stair_cases,
            private_parking: property.private_parking,
            public_parking: property.public_parking,
            private_washrooms: property.private_washrooms,
            public_washrooms: property.public_washrooms,
            available_from: property.available_from,
            ownership_type: ownership_type_id,
            plot_area: property.plot_area,
            zone_types: zone_types_id,
            builtup_unit: property.builtup_unit,
            google_address: property.google_address,
            description: property.description,
            business_types: business_type_id,
            unit_flat_house_no: property.unit_flat_house_no,
            total_project_area: property.total_project_area,
            pent_house: property.pent_house,
            types: types_id,
            possession_status: property.possession_status,
            servant_room: property.servant_room,
            pantry_room: property.pantry_room,
            investor_property: property.investor_property,
            builder_plot: property.builder_plot,
            loan_facility: property.loan_facility,
            plot_number: parseInt(property?.plot_number),
            total_places_around_property: updated_total_places_around_property
        }
        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'Property details fetched successfully',
            property: property_details
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

const addAddressDetails = async (req, res) => {
    const { city_id, unit_flat_house_no, floors, total_floors, unique_property_id, property_name, location_id, plot_number } = req.body;
    try {
        // get projects from projects table
        const allProjects = await prisma.projects.findMany();
        // check if the project is already exists in the projects table with property name
        if (property_name) {
            const project = allProjects.find(project => project?.project_name === property_name);
            // if project is not exists then create a new project
            if (!project) {
                await prisma.projects.create({
                    data: {
                        project_name: property_name
                    }
                });
            }
        }

        if (unique_property_id) {
            const property = await prisma.properties.findFirst({
                where: {
                    unique_property_id: unique_property_id
                }
            });

            if (!property) {
                return res.status(200).json({
                    status: 'error',
                    message: 'Property not found'
                });
            }

            const citiesData = await prisma.cities.findFirst({
                where: {
                    id: city_id
                }
            });

            let city_name = citiesData.name;

            const updated_date = new Date().toISOString();

            const updated_property = await prisma.properties.update({
                where: {
                    id: property.id
                },
                data: {
                    city_id: city_name,
                    property_name: property_name,
                    unit_flat_house_no: unit_flat_house_no,
                    floors: floors,
                    total_floors: total_floors,
                    location_id: location_id,
                    plot_number: plot_number.toString(),
                    updated_date: updated_date
                }
            });

            const property_details = {
                property_id: updated_property.id,
                unique_property_id: updated_property.unique_property_id,
                property_name: updated_property.property_name,
                city_id: updated_property.city_id,
                unit_flat_house_no: updated_property.unit_flat_house_no,
                floors: updated_property.floors,
                total_floors: updated_property.total_floors,
                location_id: updated_property.location_id,
                plot_number: updated_property.plot_number,
                updated_date: updated_property.updated_date
            }
            await prisma.$disconnect();
            return res.status(200).json({
                status: 'success',
                message: 'Property details updated successfully',
                property: property_details
            });
        } else {
            return res.status(200).json({
                status: 'error',
                message: 'basic details need to fill first before adding property details'
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

const getAddressDetails = async (req, res) => {
    const { user_id, unique_property_id } = req.query;
    try {
        const property = await prisma.properties.findFirst({
            where: {
                user_id: parseInt(user_id),
                unique_property_id: unique_property_id
            }
        });

        if (!property) {
            return res.status(200).json({
                status: 'error',
                message: 'Property not found'
            });
        }

        const citiesData = await prisma.cities.findFirst({
            where: {
                name: property.city_id
            }
        });

        let city_id = citiesData?.id;


        const property_details = {
            property_id: property.id,
            unique_property_id: property.unique_property_id,
            property_name: property.property_name,
            city_id: city_id,
            unit_flat_house_no: property.unit_flat_house_no,
            floors: property.floors,
            total_floors: property.total_floors,
            location_id: property.location_id,
            plot_number: parseInt(property.plot_number)
        }
        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'Property details fetched successfully',
            property: property_details
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

// const addPhotosVideos = async (req, res) => {
//     const form = new multiparty.Form();

//     form.parse(req, async (err, fields, files) => {

//         if (err) {
//             console.error("Form parsing error:", err);
//             return res.status(500).json({ status: 'error', message: 'Error parsing the form data' });
//         }

//         try {
//             const userId = fields.user_id?.[0];
//             const uniquePropertyId = fields.unique_property_id?.[0];
//             const uploadedFiles = files.photo || []; // Ensure it's an array
//             const imageIds = fields.image_id || [];
//             const selectedFeaturedImage = files.featured_image?.[0];
//             const uploadedVideoFiles = files.video || [];
//             const videoTypes = fields.video_type || [];
//             const videoIds = fields.video_id || [];

//             if (!userId || !uniquePropertyId) {
//                 return res.status(400).json({
//                     status: 'error',
//                     message: 'Missing required fields: user_id or unique_property_id',
//                 });
//             }

//             const property = await prisma.properties.findFirst({
//                 where: {
//                     user_id: parseInt(userId),
//                     unique_property_id: uniquePropertyId,
//                 },
//             });

//             if (!property) {
//                 return res.status(404).json({
//                     status: 'error',
//                     message: 'Property not found',
//                 });
//             }

//             const uploadDir = path.join(__dirname, '..', 'uploads');

//             if (!fs.existsSync(uploadDir)) {
//                 fs.mkdirSync(uploadDir, { recursive: true });
//             }

//             const uploadedFileNames = [];
//             let featuredImage = null;

//             for (let i = 0; i < uploadedFiles.length; i++) {
//                 const file = uploadedFiles[i];
//                 const tempPath = file.path;
//                 const originalFilename = file.originalFilename;
//                 const ext = path.extname(originalFilename).toLowerCase();

//                 // Validate file extension
//                 const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
//                 if (!allowedExtensions.includes(ext)) {
//                     fs.unlinkSync(tempPath);
//                     continue;
//                 }

//                 const isFeaturedImage = selectedFeaturedImage?.originalFilename === originalFilename;
//                 const priority = isFeaturedImage ? 1 : 0;

//                 // set featured image in properties table
//                 if (isFeaturedImage) {
//                     featuredImage = originalFilename;
//                 }
//                 // update the priority of the image
//                 if (imageIds[i]) {
//                     if (imageIds[i] && imageIds[i] !== 'null') {
//                         await prisma.properties_gallery.update({
//                             where: {
//                                 id: parseInt(imageIds[i]),
//                             },
//                             data: {
//                                 priority,
//                             },
//                         });
//                         continue;
//                     }
//                 }

//                 if (imageIds[i] && imageIds[i] !== 'null') {
//                     fs.unlinkSync(tempPath);
//                     continue;
//                 }

//                 // Generate a unique filename
//                 const timestamp = Date.now();
//                 const newFilename = `${path.basename(originalFilename, ext)}_${timestamp}${ext}`;
//                 const targetPath = path.join(uploadDir, newFilename);

//                 // Move file to upload directory
//                 fs.copyFileSync(tempPath, targetPath);
//                 fs.unlinkSync(tempPath);

//                 // Insert into the database
//                 try {
//                     const galleryEntry = await prisma.properties_gallery.create({
//                         data: {
//                             property_id: property.unique_property_id,
//                             image: newFilename,
//                             priority,
//                         },
//                     });
//                     console.log(`Inserted image into properties_gallery: ${galleryEntry}`);
//                     uploadedFileNames.push(newFilename);
//                 } catch (error) {
//                     console.error(`Failed to insert image into database: ${error.message}`);
//                 }
//             }

//             for (let i = 0; i < uploadedVideoFiles.length; i++) {
//                 const videoFile = uploadedVideoFiles[i];
//                 const tempPath = videoFile.path;
//                 const originalFilename = videoFile.originalFilename;
//                 const ext = path.extname(originalFilename).toLowerCase();

//                 const allowedExtensions = ['.mp4', '.avi', '.mov', '.flv', '.wmv'];
//                 if (!allowedExtensions.includes(ext)) {
//                     fs.unlinkSync(tempPath);
//                     continue;
//                 }

//                 if (videoIds[i] && videoIds[i] !== 'undefined') {
//                     fs.unlinkSync(tempPath);
//                     continue;
//                 }

//                 const timestamp = Date.now();
//                 const newFilename = `${path.basename(originalFilename, ext)}_${timestamp}${ext}`;
//                 const targetPath = path.join(uploadDir, newFilename);

//                 fs.copyFileSync(tempPath, targetPath);
//                 fs.unlinkSync(tempPath);

//                 await prisma.propertiesvideos.create({
//                     data: {
//                         property_id: property.unique_property_id,
//                         video_url: newFilename,
//                         type: videoTypes[i],
//                     },
//                 });

//                 uploadedFileNames.push(newFilename);
//             }

//             if (featuredImage) {
//                 await prisma.properties.update({
//                     where: {
//                         unique_property_id: uniquePropertyId,
//                     },
//                     data: {
//                         image: featuredImage,
//                     },
//                 });
//             }

//             await prisma.$disconnect();
//             return res.status(200).json({
//                 status: 'success',
//                 message: 'Photos and videos uploaded successfully',
//                 data: {
//                     uploadedFiles: uploadedFileNames,
//                     featuredImage,
//                 },
//             });
//         } catch (error) {
//             console.error("Error processing upload:", error);
//             return res.status(500).json({
//                 status: 'error',
//                 message: error.message,
//             });
//         }
//     });
// };

const addPhotosVideos = async (req, res) => {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Form parsing error:", err);
            return res.status(500).json({ status: 'error', message: 'Error parsing the form data' });
        }

        try {
            const userId = fields.user_id?.[0];
            const uniquePropertyId = fields.unique_property_id?.[0];
            const uploadedFiles = files.photo || [];
            const imageIds = fields.image_id || [];
            const selectedFeaturedImage = files.featured_image?.[0];
            const uploadedVideoFiles = files.video || [];
            const videoTypes = fields.video_type || [];
            const videoIds = fields.video_id || [];

            if (!userId || !uniquePropertyId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Missing required fields: user_id or unique_property_id',
                });
            }

            const property = await prisma.properties.findFirst({
                where: {
                    user_id: parseInt(userId),
                    unique_property_id: uniquePropertyId,
                },
            });

            if (!property) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Property not found',
                });
            }

            const uploadDir = path.join(__dirname, '..', 'uploads');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

            const uploadedFileNames = [];
            let featuredImage = null;

            for (let i = 0; i < uploadedFiles.length; i++) {
                const file = uploadedFiles[i];
                const tempPath = file.path;
                const originalFilename = file.originalFilename;
                const ext = path.extname(originalFilename).toLowerCase();

                // Validate file extension
                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
                if (!allowedExtensions.includes(ext)) {
                    fs.unlinkSync(tempPath);
                    continue;
                }

                const isFeaturedImage = selectedFeaturedImage?.originalFilename === originalFilename;
                const priority = isFeaturedImage ? 1 : 0;

                if (imageIds[i] && imageIds[i] !== 'null') {
                    try {
                        await prisma.properties_gallery.update({
                            where: { id: parseInt(imageIds[i]) },
                            data: {
                                priority,
                                uploaded_from_seller_panel: 'Yes',
                            },
                        });
                        if (isFeaturedImage) featuredImage = originalFilename;
                    } catch (error) {
                        console.error(`Failed to update image: ${error.message}`);
                    }
                    fs.unlinkSync(tempPath);
                    continue;
                }

                const timestamp = Date.now();
                const newFilename = `${path.basename(originalFilename, ext)}_${timestamp}${ext}`;
                const targetPath = path.join(uploadDir, newFilename);

                fs.copyFileSync(tempPath, targetPath);
                fs.unlinkSync(tempPath);

                try {
                    const galleryEntry = await prisma.properties_gallery.create({
                        data: {
                            property_id: property.unique_property_id,
                            image: newFilename,
                            priority,
                            uploaded_from_seller_panel: 'Yes',
                        },
                    });
                    uploadedFileNames.push(newFilename);
                    if (isFeaturedImage) featuredImage = newFilename;
                } catch (error) {
                    console.error(`Failed to insert image: ${error.message}`);
                }
            }

            // update property_status
            // try {
            //     await prisma.properties.update({
            //         where: { unique_property_id: uniquePropertyId },
            //         data: {
            //             property_status: 1, // Active
            //         },
            //     });
            // } catch (error) {
            //     console.error(`Failed to update property status: ${error.message}`);
            // }

            for (let i = 0; i < uploadedVideoFiles.length; i++) {
                const videoFile = uploadedVideoFiles[i];
                const tempPath = videoFile.path;
                const originalFilename = videoFile.originalFilename;
                const ext = path.extname(originalFilename).toLowerCase();

                const allowedExtensions = ['.mp4', '.avi', '.mov', '.flv', '.wmv'];
                if (!allowedExtensions.includes(ext)) {
                    fs.unlinkSync(tempPath);
                    continue;
                }

                if (videoIds[i] && videoIds[i] !== 'undefined') {
                    fs.unlinkSync(tempPath);
                    continue;
                }

                const timestamp = Date.now();
                const newFilename = `${path.basename(originalFilename, ext)}_${timestamp}${ext}`;
                const targetPath = path.join(uploadDir, newFilename);

                fs.copyFileSync(tempPath, targetPath);
                fs.unlinkSync(tempPath);

                try {
                    await prisma.propertiesvideos.create({
                        data: {
                            property_id: property.unique_property_id,
                            video_url: newFilename,
                            type: videoTypes[i],
                            uploaded_from_seller_panel: 'Yes',
                        },
                    });
                    uploadedFileNames.push(newFilename);
                } catch (error) {
                    console.error(`Failed to insert video: ${error.message}`);
                }
            }

            if (featuredImage) {
                try {
                    await prisma.properties.update({
                        where: { unique_property_id: uniquePropertyId },
                        data: {
                            image: featuredImage,
                            uploaded_from_seller_panel: 'Yes',
                        },
                    });
                } catch (error) {
                    console.error(`Failed to update property: ${error.message}`);
                }
            }

            return res.status(200).json({
                status: 'success',
                message: 'Photos and videos uploaded successfully',
                data: {
                    uploadedFiles: uploadedFileNames,
                    featuredImage,
                },
            });
        } catch (error) {
            console.error("Error processing upload:", error);
            return res.status(500).json({
                status: 'error',
                message: error.message,
            });
        } finally {
            await prisma.$disconnect();
        }
    });
};

const addFloorplans = async (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Form parsing error:", err);
            return res.status(500).json({ status: 'error', message: 'Error parsing the form data' });
        }

        try {
            const userId = fields.user_id?.[0];
            const uniquePropertyId = fields.unique_property_id?.[0];
            const uploadedFiles = files.photo || [];
            const imageIds = fields.image_id || [];
            if (!userId || !uniquePropertyId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Missing required fields: user_id or unique_property_id',
                });
            }

            const property = await prisma.properties.findFirst({
                where: {
                    user_id: parseInt(userId),
                    unique_property_id: uniquePropertyId,
                },
            });

            if (!property) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Property not found',
                });
            }

            const uploadDir = path.join(__dirname, '..', 'uploads');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

            const uploadedFileNames = [];

            for (let i = 0; i < uploadedFiles.length; i++) {
                const file = uploadedFiles[i];
                const tempPath = file.path;
                const originalFilename = file.originalFilename;
                const ext = path.extname(originalFilename).toLowerCase();

                // Validate file extension
                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
                if (!allowedExtensions.includes(ext)) {
                    fs.unlinkSync(tempPath);
                    continue;
                }

                if (imageIds[i] && imageIds[i] !== 'null') {
                    try {
                        await prisma.properties_floorplans_gallery.update({
                            where: { id: parseInt(imageIds[i]) },
                            data: {
                                uploaded_from_seller_panel: 'Yes',
                            },
                        });
                    } catch (error) {
                        console.error(`Failed to update image: ${error.message}`);
                    }
                    fs.unlinkSync(tempPath);
                    continue;
                }

                const timestamp = Date.now();
                const newFilename = `${path.basename(originalFilename, ext)}_${timestamp}${ext}`;
                const targetPath = path.join(uploadDir, newFilename);

                fs.copyFileSync(tempPath, targetPath);
                fs.unlinkSync(tempPath);

                try {
                    const galleryEntry = await prisma.properties_floorplans_gallery.create({
                        data: {
                            property_id: property.unique_property_id,
                            image: newFilename,
                            priority: 0,
                            uploaded_from_seller_panel: 'Yes',
                        },
                    });
                    uploadedFileNames.push(newFilename);
                } catch (error) {
                    console.error(`Failed to insert image: ${error.message}`);
                }
            }
            // update property_status
            // try {
            //     await prisma.properties.update({
            //         where: { unique_property_id: uniquePropertyId },
            //         data: {
            //             property_status: 1, // Active
            //         },
            //     });
            // } catch (error) {
            //     console.error(`Failed to update property status: ${error.message}`);
            // }

            return res.status(200).json({
                status: 'success',
                message: 'Floor plans uploaded successfully',
                data: {
                    uploadedFiles: uploadedFileNames,
                },
            });
        } catch (error) {
            console.error("Error processing upload:", error);
            return res.status(500).json({
                status: 'error',
                message: error.message,
            });
        } finally {
            await prisma.$disconnect();
        }
    });
}

const propertyWithoutPhotos = async (req, res) => {
    const { user_id, unique_property_id } = req.body;
    try {
        const property = await prisma.properties.findFirst({
            where: {
                user_id: parseInt(user_id),
                unique_property_id: unique_property_id
            }
        });

        if (!property) {
            return res.status(200).json({
                status: 'error',
                message: 'Property not found'
            });
        }

        // update property_status to 0 (Pending)
        await prisma.properties.update({
            where: {
                unique_property_id: unique_property_id
            },
            data: {
                property_status: 0 //Pending
            }
        });

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'Property status updated successfully'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

const getPhotos = async (req, res) => {
    const { user_id, unique_property_id } = req.query;

    try {
        const property_images = await prisma.properties_gallery.findMany({
            where: {
                property_id: unique_property_id
            }
        });

        if (!property_images) {
            return res.status(200).json({
                status: 'error',
                message: 'Property not found'
            });
        }

        // Create an array of image URLs
        const images = property_images.map(image =>
            `${process.env.API_URL}/uploads/${image.image}`
        );

        for (let i = 0; i < property_images.length; i++) {
            images[i] = {
                id: property_images[i].id,
                url: images[i]
            }
        }

        const featuredImage = property_images.find(image => image.priority === 1);

        // featuredImage index 
        const featuredImageIndex = property_images.findIndex(image => image.priority === 1);

        // Disconnect from the database
        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'Property images fetched successfully',
            images: images,
            featuredImage: featuredImage ? `${process.env.API_URL}/uploads/${featuredImage.image}` : null,
            featuredImageIndex: featuredImageIndex
        });
    } catch (error) {
        console.error("Error fetching property images:", error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const getFloorplansPhotos = async (req, res) => {
    const { user_id, unique_property_id } = req.query;

    try {
        const floorplan_images = await prisma.properties_floorplans_gallery.findMany({
            where: {
                property_id: unique_property_id
            }
        });

        if (!floorplan_images) {
            return res.status(200).json({
                status: 'error',
                message: 'Property not found'
            });
        }

        // Create an array of image URLs
        const images = floorplan_images.map(image =>
            `${process.env.API_URL}/uploads/${image.image}`
        );

        for (let i = 0; i < floorplan_images.length; i++) {
            images[i] = {
                id: floorplan_images[i].id,
                url: images[i]
            }
        }

        // Disconnect from the database
        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'Property floor plan images fetched successfully',
            images: images,
        });
    } catch (error) {
        console.error("Error fetching property images:", error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

const deletePropertyPhoto = async (req, res) => {
    const { user_id, unique_property_id, photo_id } = req.body;

    try {
        const property_image = await prisma.properties_gallery.findFirst({
            where: {
                id: parseInt(photo_id),
                property_id: unique_property_id
            }
        });

        if (!property_image) {
            return res.status(200).json({
                status: 'error',
                message: 'Property image not found'
            });
        }

        const uploadDir = path.join(__dirname, '..', 'uploads');
        const imagePath = path.join(uploadDir, property_image.image);

        // Delete the image file from the server
        fs.unlinkSync(imagePath);

        // Delete the image from the database
        await prisma.properties_gallery.delete({
            where: {
                id: parseInt(photo_id)
            }
        });

        // Disconnect from the database
        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'Property image deleted successfully'
        });
    } catch (error) {
        console.error("Error deleting property image:", error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const deleteFloorplanPhoto = async (req, res) => {
    const { user_id, unique_property_id, photo_id } = req.body;

    try {
        const property_floorplan_image = await prisma.properties_floorplans_gallery.findFirst({
            where: {
                id: parseInt(photo_id),
                property_id: unique_property_id
            }
        });

        if (!property_floorplan_image) {
            return res.status(200).json({
                status: 'error',
                message: 'Property floor plan image not found'
            });
        }

        const uploadDir = path.join(__dirname, '..', 'uploads');
        const imagePath = path.join(uploadDir, property_floorplan_image.image);

        // Delete the image file from the server
        fs.unlinkSync(imagePath);

        // Delete the image from the database
        await prisma.properties_floorplans_gallery.delete({
            where: {
                id: parseInt(photo_id)
            }
        });

        // Disconnect from the database
        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'Property floor plan image deleted successfully'
        });
    } catch (error) {
        console.error("Error deleting property image:", error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

const getPropertyVideos = async (req, res) => {
    const { user_id, unique_property_id } = req.query;

    try {
        const property_videos = await prisma.propertiesvideos.findMany({
            where: {
                property_id: unique_property_id
            }
        });

        if (!property_videos) {
            return res.status(200).json({
                status: 'error',
                message: 'Property not found'
            });
        }

        // Create an array of video URLs and add the type also
        const videos = property_videos.map(video =>
            `${process.env.API_URL}/uploads/${video.video_url}`
        );

        // append the video type to the videos array
        for (let i = 0; i < property_videos.length; i++) {
            videos[i] = {
                // pass the id also
                id: property_videos[i].id,
                url: videos[i],

                type: property_videos[i].type
            }
        }

        // Disconnect from the database
        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'Property videos fetched successfully',
            videos: videos,
        });
    } catch (error) {
        console.error("Error fetching property videos:", error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const deletePropertyVideo = async (req, res) => {
    const { user_id, unique_property_id, video_id } = req.body;

    try {
        const property_video = await prisma.propertiesvideos.findFirst({
            where: {
                id: parseInt(video_id),
                property_id: unique_property_id
            }
        });

        if (!property_video) {
            return res.status(200).json({
                status: 'error',
                message: 'Property video not found'
            });
        }

        const uploadDir = path.join(__dirname, '..', 'uploads');
        const videoPath = path.join(uploadDir, property_video.video_url);

        // Delete the video file from the server
        fs.unlinkSync(videoPath);

        // Delete the video from the database
        await prisma.propertiesvideos.delete({
            where: {
                id: parseInt(video_id)
            }
        });

        // Disconnect from the database
        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'Property video deleted successfully'
        });
    } catch (error) {
        console.error("Error deleting property video:", error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const getSinglePropertyDetails = async (req, res) => {
    const { user_id, unique_property_id } = req.query;

    try {
        // Fetch the property details
        const property = await prisma.properties.findFirst({
            where: {
                // user_id: parseInt(user_id),
                unique_property_id: unique_property_id
            }
        });

        // If the property does not exist, return an error response
        if (!property) {
            return res.status(404).json({
                status: 'error',
                message: 'Property not found'
            });
        }

        // Fetch related images
        const property_images = await prisma.properties_gallery.findMany({
            where: {
                property_id: unique_property_id
            }
        });

        // Create an array of image URLs
        const images = property_images.map(image =>
            `${process.env.API_URL}/uploads/${image.image}`
        );

        // Fetch property_flooplans images
        const property_floorplans_images = await prisma.properties_floorplans_gallery.findMany({
            where: {
                property_id: unique_property_id
            }
        });

        // Create an array of image URLs
        const floorplans_images = property_floorplans_images.map(image =>
            `${process.env.API_URL}/uploads/${image.image}`
        );

        // fetch videos
        const property_videos = await prisma.propertiesvideos.findMany({
            where: {
                property_id: unique_property_id
            }
        });

        const videos = property_videos?.map(video =>
            `${process.env.API_URL}/uploads/${video.video_url}`
        );

        // get the total places around the property
        const total_places_around_property = await prisma.around_this_property.findMany({
            where: {
                unique_property_id: unique_property_id
            }
        });

        const updated_total_places_around_property = total_places_around_property.map(place => ({
            placeid: place.id,
            place: place.title,
            distance: place.distance
        }));

        // Construct the property details object
        const property_details = {
            property_id: property.id,
            unique_property_id: property.unique_property_id,
            property_in: property.property_in,
            property_for: property.property_for,
            transaction_type: property.transaction_type,
            sub_type: property.sub_type,
            occupancy: property.occupancy,
            bedrooms: property.bedrooms,
            bathroom: property.bathroom,
            balconies: property.balconies,
            furnished_status: property.furnished_status,
            monthly_rent: property.monthly_rent,
            open_parking: property.open_parking,
            maintenance: property.maintenance,
            lock_in: property.lock_in,
            brokerage_charge: property?.brokerage_charge?.toString(),
            area_units: property.area_units,
            builtup_area: property.builtup_area,
            carpet_area: property.carpet_area,
            length_area: property.length_area,
            width_area: property.width_area,
            facing: property.facing,
            google_address: property.google_address,
            description: property.description,
            city_id: property.city_id,
            unit_flat_house_no: property.unit_flat_house_no,
            floors: property.floors,
            total_floors: property.total_floors,
            image: images,
            videos: videos,
            floorplans_images: floorplans_images,
            available_from: property.available_from,
            property_name: property.property_name,
            property_cost: property.property_cost,
            passenger_lifts: property.passenger_lifts,
            service_lifts: property.service_lifts,
            stair_cases: property.stair_cases,
            private_parking: property.private_parking,
            public_parking: property.public_parking,
            private_washrooms: property.private_washrooms,
            public_washrooms: property.public_washrooms,
            age_of_property: property?.property_age?.toString(),
            possession_end_date: property.under_construction,
            security_deposit: property?.security_deposit?.toString(),
            prefered_tenant_types: property.types,
            pent_house: property.pent_house,
            possession_status: property.possession_status,
            ownership_type: property.ownership_type,
            plot_number: property.plot_number,
            total_project_area: property.total_project_area,
            business_types: property.business_types,
            zone_types: property.zone_types,
            investor_property: property.investor_property,
            loan_facility: property.loan_facility,
            car_parking: property?.car_parking,
            bike_parking: property?.bike_parking,
            servant_room: property.servant_room,
            pantry_room: property.pantry_room,
            facilities: property.facilities,
            total_places_around_property: updated_total_places_around_property
        };

        // Disconnect from the database
        await prisma.$disconnect();

        // Send a success response
        return res.status(200).json({
            status: 'success',
            message: 'Property details fetched successfully',
            property: property_details
        });
    } catch (error) {
        console.error("Error fetching property details:", error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const deleteProperty = async (req, res) => {
    const { user_id, unique_property_id } = req.body;

    try {
        // Fetch the property details
        const property = await prisma.properties.findFirst({
            where: {
                user_id: parseInt(user_id),
                unique_property_id: unique_property_id
            }
        });

        // If the property does not exist, return an error response
        if (!property) {
            return res.status(404).json({
                status: 'error',
                message: 'Property not found'
            });
        }

        // Delete the property from the database
        await prisma.properties.delete({
            where: {
                id: property.id
            }
        });

        // also delete the property images in the server uploads folder
        const uploadDir = path.join(__dirname, '..', 'uploads');
        const property_images = await prisma.properties_gallery.findMany({
            where: {
                property_id: unique_property_id
            }
        });

        for (const image of property_images) {
            const imagePath = path.join(uploadDir, image.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(image ? imagePath : '');
            }
        }

        // also delete the property images
        await prisma.properties_gallery.deleteMany({
            where: {
                property_id: unique_property_id
            }
        });

        // also delete the propertyvideos in the server uploads folder
        const property_videos = await prisma.propertiesvideos.findMany({
            where: {
                property_id: unique_property_id
            }
        });

        for (const video of property_videos) {
            const videoPath = path.join(uploadDir, video.video_url);
            if (fs.existsSync(videoPath)) {
                fs.unlinkSync(video ? videoPath : '');
            }
        }

        // also delete the propertyvideos
        await prisma.propertiesvideos.deleteMany({
            where: {
                property_id: unique_property_id
            }
        });


        // Disconnect from the database
        await prisma.$disconnect();
        res.status(200).json({
            status: 'success',
            message: 'Property deleted successfully'
        });
    } catch (error) {
        console.error("Error deleting property:", error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const getPropertySubType = async (req, res) => {
    const { user_id, property_in } = req.query;
    try {
        const property_sub_type = await prisma.sub_types.findMany({
            where: {
                property_in: property_in,
                status: 1
            }
        });

        const property_sub_types = property_sub_type.map(sub_type => ({
            value: sub_type.id,
            name: sub_type.name
        }));

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'Property sub types fetched successfully',
            property_sub_type: property_sub_types
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

const getPreferedTenantTypes = async (req, res) => {
    try {
        const prefered_tenant_types = await prisma.types.findMany({
            where: {
                status: 1
            }
        });
        const prefered_tenant_types_list = prefered_tenant_types.map(type => ({
            value: type.id,
            name: type.name
        }));

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'prefered tenant types fetched successfully',
            prefered_tenant_types: prefered_tenant_types_list
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

const getBalcanies = async (req, res) => {
    try {
        const balconies = await prisma.balconies.findMany({
            where: {
                status: 1
            }
        });

        // if balcanies length greater than four then take upto 4 and add last object as '4plus'
        if (balconies.length > 4) {
            balconies.splice(4, balconies.length - 4);
            balconies.push({ id: 5, name: '4+' });
        }

        const balconies_list = balconies.map(balcony => ({
            value: balcony.id,
            name: balcony.name
        }));

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'balconies fetched successfully',
            balconies: balconies_list
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

const getBedroomTypes = async (req, res) => {
    try {
        const bedrooms = await prisma.bed_room_types.findMany({
            where: {
                status: 1
            }
        });
        // iflength greater than four then take upto 4 and add last object as '4plus'
        if (bedrooms.length > 4) {
            bedrooms.splice(4, bedrooms.length - 4);
            bedrooms.push({ id: 5, name: '4+' });
        }

        const bedrooms_list = bedrooms.map(bedroom => ({
            value: bedroom.id,
            name: bedroom.name
        }));

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'bedrooms fetched successfully',
            bedrooms: bedrooms_list
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

const getBusinessTypes = async (req, res) => {
    try {
        const business_types = await prisma.business_types.findMany({
            where: {
                status: 1
            }
        });
        const business_types_list = business_types.map(business_type => ({
            value: business_type.id,
            label: business_type.name
        }));

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'business types fetched successfully',
            business_types: business_types_list
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

const getFaclities = async (req, res) => {
    try {
        const facilities = await prisma.facilities.findMany({
            where: {
                status: 1
            }
        });

        const facilitiesObject = facilities.reduce((acc, facility) => {
            acc[facility.name] = false;
            return acc;
        }, {});

        // add additional facilities None option
        facilitiesObject['None'] = false;

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'facilities fetched successfully',
            facilities: facilitiesObject,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};

const getFacing = async (req, res) => {
    try {
        const facing = await prisma.facing.findMany({
            where: {
                status: 1
            }
        });
        const facing_list = facing.map(facing => ({
            value: facing.id,
            name: facing.name
        }));

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'facing fetched successfully',
            facing: facing_list
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

const getFloors = async (req, res) => {
    try {
        const floors = await prisma.floors.findMany({
            where: {
                status: 1
            },
            orderBy: {
                order_no: 'asc'
            }
        });
        const floors_list = floors.map(floor => ({
            value: floor.id,
            name: floor.name
        }));

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'floors fetched successfully',
            floors: floors_list
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

const getFurnishedStatus = async (req, res) => {
    try {
        const furnished_status = await prisma.furnished.findMany({
            where: {
                status: 1
            }
        });
        const furnished_status_list = furnished_status.map(status => ({
            value: status.id,
            name: status.name
        }));

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'furnished status fetched successfully',
            furnished_status: furnished_status_list
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

const getOccupancy = async (req, res) => {
    try {
        const occupancy = await prisma.occupancy.findMany({
            where: {
                status: 1
            }
        });
        const occupancy_list = occupancy.map(occupancy => ({
            value: occupancy.id,
            name: occupancy.name
        }));

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'occupancy fetched successfully',
            occupancy: occupancy_list
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

const getOwnerShipType = async (req, res) => {
    try {
        const ownership_type = await prisma.ownership_type.findMany({
            where: {
                status: 1
            }
        });
        const ownership_type_list = ownership_type.map(type => ({
            value: type.id,
            name: type.name
        }));

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'ownership type fetched successfully',
            ownership_type: ownership_type_list
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

const getPropertyFor = async (req, res) => {
    try {
        const property_for = await prisma.property_for.findMany({
            where: {
                status: 1
            }
        });
        const property_for_list = property_for.map(property => ({
            value: property.id,
            name: property.name
        }));

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'property for fetched successfully',
            property_for: property_for_list
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

const getPropertyIn = async (req, res) => {
    try {
        const property_in = await prisma.property_in.findMany({
            where: {
                status: 1
            }
        });
        const property_in_list = property_in.map(property => ({
            value: property.id,
            name: property.name
        }));

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'property in fetched successfully',
            property_in: property_in_list
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

const getTransactionType = async (req, res) => {
    try {
        const transaction_type = await prisma.transaction_type.findMany({
            where: {
                status: 1
            }
        });
        const transaction_type_list = transaction_type.map(type => ({
            value: type.id,
            label: type.name
        }));

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'transaction type fetched successfully',
            transaction_type: transaction_type_list
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

const getZoneTypes = async (req, res) => {
    try {
        const zone_types = await prisma.zone_types.findMany({
            where: {
                status: 1
            }
        });
        const zone_types_list = zone_types.map(type => ({
            value: type.id,
            label: type.name
        }));

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'Zone type fetched successfully',
            zone_types: zone_types_list
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

const getProjects = async (req, res) => {
    try {
        const allprojects = await prisma.projects.findMany();
        const projects_list = allprojects.map(project => ({
            value: project.project_name,
            label: project.project_name
        }));

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'Projects fetched successfully',
            projects: projects_list
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

const getAreaunits = async (req, res) => {
    try {
        const areaunits = await prisma.area_units.findMany({
            where: {
                status: 1
            }
        });
        const areaunits_list = areaunits.map(areaunit => ({
            value: areaunit.id,
            label: areaunit.name
        }));

        await prisma.$disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'Area units fetched successfully',
            areaunits: areaunits_list
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

exports.addBasicdetails = addBasicdetails;
exports.getBasicdetails = getBasicdetails;
exports.addPropertyDetails = addPropertyDetails;
exports.getPropertyDetails = getPropertyDetails;
exports.addAddressDetails = addAddressDetails;
exports.getAddressDetails = getAddressDetails;
exports.getSinglePropertyDetails = getSinglePropertyDetails;
exports.addPhotosVideos = addPhotosVideos;
exports.addFloorplans = addFloorplans
exports.getPhotos = getPhotos;
exports.getFloorplansPhotos = getFloorplansPhotos;
exports.deletePropertyPhoto = deletePropertyPhoto;
exports.getPropertyVideos = getPropertyVideos;
exports.deletePropertyVideo = deletePropertyVideo;
exports.deleteFloorplanPhoto = deleteFloorplanPhoto;
exports.getPropertySubType = getPropertySubType;
exports.getPreferedTenantTypes = getPreferedTenantTypes;
exports.getBalcanies = getBalcanies;
exports.getBedroomTypes = getBedroomTypes;
exports.getBusinessTypes = getBusinessTypes;
exports.getFaclities = getFaclities;
exports.getFacing = getFacing;
exports.getFloors = getFloors;
exports.getFurnishedStatus = getFurnishedStatus;
exports.getOccupancy = getOccupancy;
exports.getOwnerShipType = getOwnerShipType;
exports.getPropertyFor = getPropertyFor;
exports.getPropertyIn = getPropertyIn;
exports.getTransactionType = getTransactionType;
exports.getZoneTypes = getZoneTypes;
exports.deleteProperty = deleteProperty;
exports.getProjects = getProjects;
exports.deleteplacesaroundproperty = deleteplacesaroundproperty;
exports.propertyWithoutPhotos = propertyWithoutPhotos;
exports.getAreaunits = getAreaunits;