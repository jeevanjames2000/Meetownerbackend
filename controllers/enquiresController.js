const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllenquires = async (req, res) => {
    const { user_id, page, limit, unique_property_id } = req.query;

    try {

        if (!user_id) {
            return res.status(200).json({
                status: 'error',
                message: 'user_id is required',
            });
        }

        // Get all properties associated with the provided user_id
        const allProperties = await prisma.properties.findMany({
            where: {
                user_id: parseInt(user_id),
            }
        });

        let propertiesData = [];

        allProperties.map((property) => {
            propertiesData.push({
                unique_property_id: property.unique_property_id,
            });
        })

        let contactsellerfilterCondition = {};
        let searchedPropertyFilterCondition = {};

        if (unique_property_id === undefined || unique_property_id === null || unique_property_id === '') {
            contactsellerfilterCondition = { unique_property_id: { in: propertiesData.map((property) => property.unique_property_id) } };
            searchedPropertyFilterCondition = { property_id: { in: propertiesData.map((property) => property.unique_property_id) } };
        } else {
            contactsellerfilterCondition = { unique_property_id: unique_property_id };
            searchedPropertyFilterCondition = { property_id: unique_property_id };
        }

        const contact_seller_data = await prisma.contact_seller.findMany({
            where: contactsellerfilterCondition
        });

        for (let i = 0; i < contact_seller_data.length; i++) {
            const propertyDetails = await prisma.properties.findUnique({
                where: {
                    unique_property_id: contact_seller_data[i].unique_property_id,
                },
            });
            contact_seller_data[i].name = contact_seller_data[i].fullname
            contact_seller_data[i].enquiry_from = "Contact Seller"; //contact seller

            // select few property details to send as response
            contact_seller_data[i].property_details = {
                unique_property_id: propertyDetails.unique_property_id,
                property_name: propertyDetails.property_name,
                property_for: propertyDetails.property_for,
                property_in: propertyDetails.property_in,
                sub_type: propertyDetails.sub_type,
                google_address: propertyDetails.google_address,
                property_cost: propertyDetails.property_cost,
                monthly_rent: propertyDetails.monthly_rent,
                builtup_area: propertyDetails.builtup_area,
                carpet_area: propertyDetails.carpet_area,
                length_area: propertyDetails.length_area,
                width_area: propertyDetails.width_area,
                area_units: propertyDetails.area_units,
                image: propertyDetails.image ? `${process.env.API_URL}/uploads/${propertyDetails.image}` : null,

            };

            const userDetails = await prisma.users.findUnique({
                where: {
                    id: contact_seller_data[i]?.user_id,
                },
                select: {
                    // id: true,
                    name: true,
                    user_type: true,
                    mobile: true,
                    email: true,
                }
            });
            contact_seller_data[i].user_details = userDetails;

        }

        const searched_property_data = await prisma.searched_properties.findMany({
            where: searchedPropertyFilterCondition,
        });

        for (let i = 0; i < searched_property_data.length; i++) {

            // get intresetd status from the searched_property table dynamically
            const interested_status = await prisma.searched_properties.findUnique({
                where: {
                    id: searched_property_data[i].id,
                },
                select: {
                    interested_status: true,
                }
            });

            let interestedStatus;
            if (interested_status.interested_status === 2) {
                interestedStatus = "Interested";
            } else if (interested_status.interested_status === 3) {
                interestedStatus = "Shedule Visit";
            } else {
                interestedStatus = "undefined";
            }

            searched_property_data[i].enquiry_from = interestedStatus;

            const propertyDetails = await prisma.properties.findUnique({
                where: {
                    unique_property_id: searched_property_data[i].property_id,
                },
            });

            // select few property details to send as response
            searched_property_data[i].property_details = {
                unique_property_id: propertyDetails.unique_property_id,
                property_name: propertyDetails.property_name,
                property_for: propertyDetails.property_for,
                property_in: propertyDetails.property_in,
                sub_type: propertyDetails.sub_type,
                google_address: propertyDetails.google_address,
                property_cost: propertyDetails.property_cost,
                monthly_rent: propertyDetails.monthly_rent,
                builtup_area: propertyDetails.builtup_area,
                carpet_area: propertyDetails.carpet_area,
                length_area: propertyDetails.length_area,
                width_area: propertyDetails.width_area,
                area_units: propertyDetails.area_units,
                image: propertyDetails.image ? `${process.env.API_URL}/uploads/${propertyDetails.image}` : null,
            };

            const userDetails = await prisma.users.findUnique({
                where: {
                    id: searched_property_data[i]?.user_id,
                },
                select: {
                    id: true,
                    name: true,
                    user_type: true,
                    mobile: true,
                    email: true,
                }
            });

            // searched_property_data[i].property_details = propertyDetails;
            searched_property_data[i].user_details = userDetails;
        }

        const allEnquires = [...contact_seller_data, ...searched_property_data];

        const offset = (page - 1) * limit;
        const updatedEnquires = allEnquires.slice(offset, parseInt(offset) + parseInt(limit));
        const totalCount = allEnquires.length;
        const totalPages = Math.ceil(totalCount / limit);

        await prisma.$disconnect();
        res.status(200).json({
            status: 'success',
            allEnquires: updatedEnquires,
            totalCount: totalCount,
            totalPages: totalPages,
        });

    } catch (error) {
        // Handle any errors and send the response
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

exports.getAllenquires = getAllenquires;
exports.getAllenquires = getAllenquires;