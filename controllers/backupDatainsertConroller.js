const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const { parse } = require("path");
const exp = require("constants");

const prisma = new PrismaClient();

const states = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/states.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }

        const insertDataPromises = result.map(item => {
            return prisma.states.create({
                data: {
                    id: parseInt(item.id),
                    name: item.name,
                    status: item.status
                }
            });
        });

        await Promise.all(insertDataPromises);

        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
};

const cities = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/cities.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }

        const insertDataPromises = result.map(item => {
            return prisma.cities.create({
                data: {
                    id: parseInt(item.id),
                    state_id: parseInt(item.state_id),
                    name: item.name,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    mobile: item.mobile,
                    status: item.status,
                    city_meta_tags: item.city_meta_tags,
                    order_no: parseInt(item.order_no)
                }
            });
        });

        await Promise.all(insertDataPromises);
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const areaunits = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/area_units.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }

        const insertDataPromises = result.map(item => {
            return prisma.area_units.create({
                data: {
                    id: parseInt(item.id),
                    name: item.name,
                    order_no: parseInt(item.order_no),
                    status: parseInt(item.status)
                }
            });
        });

        await Promise.all(insertDataPromises);
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const balconies = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/balconies.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }

        const insertDataPromises = result.map(item => {
            return prisma.balconies.create({
                data: {
                    id: parseInt(item.id),
                    name: item.name,
                    order_no: parseInt(item.order_no),
                    status: parseInt(item.status)
                }
            });
        });

        await Promise.all(insertDataPromises);
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const bed_room_types = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/bed_room_types.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }

        const insertDataPromises = result.map(item => {
            return prisma.bed_room_types.create({
                data: {
                    id: parseInt(item.id),
                    name: item.name,
                    order_no: parseInt(item.order_no),
                    status: parseInt(item.status)
                }
            });
        });

        await Promise.all(insertDataPromises);
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const business_types = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/business_types.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }

        const insertDataPromises = result.map(item => {
            return prisma.business_types.create({
                data: {
                    id: parseInt(item.id),
                    name: item.name,
                    order_no: parseInt(item.order_no),
                    status: parseInt(item.status)
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const company_details = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/company_details.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }
        const insertDataPromises = result.map(item => {
            return prisma.company_details.create({
                data: {
                    id: parseInt(item.id),
                    title: item.title,
                    img: item.img,
                    home_page_slider_title: item.home_page_slider_title,
                    mobile: item.mobile,
                    land_line: item.land_line,
                    address: item.address,
                    city: item.city,
                    state: item.state,
                    country: item.country,
                    face_book: item.face_book,
                    twitter: item.twitter,
                    instagram: item.instagram,
                    email: item.email,
                    timings: item.timings,
                    about: item.about,
                    visits: parseInt(item.visits),
                    menu_notification: item.menu_notification,
                    services: item.services,
                    careers: item.careers
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const facilities = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/facilities.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }
        const insertDataPromises = result.map(item => {
            return prisma.facilities.create({
                data: {
                    id: parseInt(item.id),
                    name: item.name,
                    order_no: parseInt(item.order_no),
                    status: parseInt(item.status)
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const facing = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/facing.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }
        const insertDataPromises = result.map(item => {
            return prisma.facing.create({
                data: {
                    id: parseInt(item.id),
                    name: item.name,
                    order_no: parseInt(item.order_no),
                    status: parseInt(item.status)
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const floors = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/floors.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }
        const insertDataPromises = result.map(item => {
            return prisma.floors.create({
                data: {
                    id: parseInt(item.id),
                    name: item.name,
                    order_no: parseInt(item.order_no),
                    status: parseInt(item.status)
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const furnished = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/furnished.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }
        const insertDataPromises = result.map(item => {
            return prisma.furnished.create({
                data: {
                    id: parseInt(item.id),
                    name: item.name,
                    order_no: parseInt(item.order_no),
                    status: parseInt(item.status)
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const locations = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/locations.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }

        const insertDataPromises = result.map(item => {
            return prisma.locations.create({
                data: {
                    city_id: parseInt(item.city_id),
                    name: item.name,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    is_popular: parseInt(item.is_popular),
                    status: item?.status,
                    nearer_location_ids: item.nearer_location_ids,
                    led_available: parseInt(item.led_available),
                    mobilevan_available: parseInt(item.mobilevan_available),
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const occupancy = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/occupancy.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }
        const insertDataPromises = result.map(item => {
            return prisma.occupancy.create({
                data: {
                    id: parseInt(item.id),
                    name: item.name,
                    order_no: parseInt(item.order_no),
                    status: parseInt(item.status)
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const ownership_type = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/ownership_type.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }
        const insertDataPromises = result.map(item => {
            return prisma.ownership_type.create({
                data: {
                    id: parseInt(item.id),
                    name: item.name,
                    order_no: parseInt(item.order_no),
                    status: parseInt(item.status)
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const properties = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/properties.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }
        console.log(result);
        const insertDataPromises = result.map(item => {
            return prisma.properties.create({
                data: {
                    unique_property_id: item.unique_property_id,
                    property_name: item.property_name,
                    user_id: parseInt(item.user_id),
                    expiry_date: item.expiry_date === 'NULL' ? null : new Date(item.expiry_date),
                    property_type: item.property_type,
                    sub_type: item.sub_type,
                    property_for: item.property_for,
                    unit_flat_house_no: item.unit_flat_house_no,
                    state_id: item.state_id,
                    city_id: item.city_id,
                    location_id: item.location_id,
                    street: item.street,
                    address: item.address,
                    zipcode: parseInt(item.zipcode),
                    latitude: item.latitude,
                    longitude: item.longitude,
                    bedrooms: item.bedrooms,
                    builtup_area: parseFloat(item.builtup_area),
                    builtup_unit: parseFloat(item.builtup_unit),
                    additional_amount: parseFloat(item.additional_amount),
                    property_cost: parseFloat(item.property_cost),
                    bathroom: parseInt(item.bathroom),
                    balconies: parseInt(item.balconies),
                    property_in: item.property_in,
                    facing: item.facing,
                    car_parking: parseInt(item.car_parking),
                    bike_parking: parseInt(item.bike_parking),
                    facilities: item.facilities,
                    floors: item.floors,
                    furnished_status: item.furnished_status,
                    transaction_type: item.transaction_type,
                    owner_name: item.owner_name,
                    mobile: item.mobile,
                    whatsapp: item.whatsapp,
                    landline: item.landline,
                    email: item.email,
                    occupancy: item.occupancy,
                    description: item.description,
                    video_link: item.video_link,
                    property_status: parseInt(item.property_status),
                    admin_approved_status: parseInt(item.admin_approved_status),
                    posted_by: parseInt(item.posted_by),
                    paid_details: item.paid_details,
                    other_info: item.other_info,
                    // created_date: item.created_date === 'NULL' ? null : new Date(item.created_date),
                    // created_time: item.created_time,
                    // updated_date: item.updated_date === 'NULL' ? null : new Date(item.updated_date),
                    // updated_time: item.updated_time,
                    // admin_approval_date: item.admin_approval_date === 'NULL' ? null : new Date(item.admin_approval_date),

                    image: item.image,
                    google_address: item.google_address,
                    user_type: parseInt(item.user_type),
                    total_floors: item.total_floors,
                    open_parking: item.open_parking,
                    carpet_area: parseFloat(item.carpet_area),
                    // under_construction: item.under_construction === 'NULL' ? null : new Date(item.under_construction),

                    ready_to_move: item.ready_to_move,
                    updated_from: parseInt(item.updated_from),
                    property_age: parseFloat(item.property_age),
                    types: item.types,
                    // available_from: item.available_from === 'NULL' ? null : new Date(item.available_from),

                    monthly_rent: parseFloat(item.monthly_rent),
                    security_deposit: parseFloat(item.security_deposit),
                    maintenance: item.maintenance,
                    lock_in: item.lock_in,
                    brokerage_charge: parseFloat(item.brokerage_charge),
                    plot_area: parseFloat(item.plot_area),
                    ownership_type: item.ownership_type,
                    length_area: parseFloat(item.length_area),
                    width_area: parseFloat(item.width_area),
                    zone_types: item.zone_types,
                    business_types: item.business_types,
                    rera_approved: parseInt(item.rera_approved),
                    passenger_lifts: parseInt(item.passenger_lifts),
                    service_lifts: parseInt(item.service_lifts),
                    stair_cases: parseInt(item.stair_cases),
                    private_parking: parseInt(item.private_parking),
                    public_parking: parseInt(item.public_parking),
                    private_washrooms: parseInt(item.private_washrooms),
                    public_washrooms: parseInt(item.public_washrooms),
                    area_units: item.area_units,
                    pent_house: item.pent_house,
                    servant_room: item.servant_room,
                    possession_status: item.procession_status,
                    builder_plot: item.builder_plot,
                    investor_property: item.investor_plot,
                    loan_facility: item.loan_facility,
                    plot_number: item?.plot_number,
                    pantry_room: item?.pantry_room,

                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const properties_gallery = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/properties_gallery.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }

        const insertDataPromises = result.map(item => {
            return prisma.properties_gallery.create({
                data: {
                    id: parseInt(item.id),
                    property_id: item.property_id,
                    image: item.image,
                    priority: parseInt(item.priority),
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const property_for = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/property_for.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }

        const insertDataPromises = result.map(item => {
            return prisma.property_for.create({
                data: {
                    id: parseInt(item.id),
                    name: item.name,
                    order_no: parseInt(item.order_no),
                    status: parseInt(item.status),
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const property_in = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/property_in.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }

        const insertDataPromises = result.map(item => {
            return prisma.property_in.create({
                data: {
                    id: parseInt(item.id),
                    name: item.name,
                    order_no: parseInt(item.order_no),
                    status: parseInt(item.status),
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const sub_types = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/sub_types.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }

        const insertDataPromises = result.map(item => {
            return prisma.sub_types.create({
                data: {
                    id: parseInt(item.id),
                    name: item.name,
                    order_no: parseInt(item.order_no),
                    status: parseInt(item.status),
                    property_in: item.property_in,
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const transaction_type = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/transaction_type.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }

        const insertDataPromises = result.map(item => {
            return prisma.transaction_type.create({
                data: {
                    id: parseInt(item.id),
                    name: item.name,
                    order_no: parseInt(item.order_no),
                    status: parseInt(item.status),
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const types = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/types.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }

        const insertDataPromises = result.map(item => {
            return prisma.types.create({
                data: {
                    id: parseInt(item.id),
                    name: item.name,
                    order_no: parseInt(item.order_no),
                    status: parseInt(item.status),
                    property_for: item.property_for,
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const user_types = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/user_types.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }

        const insertDataPromises = result.map(item => {
            return prisma.user_types.create({
                data: {
                    login_type_id: parseInt(item.login_type_id),
                    login_type: item.login_type,
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const zone_types = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/zone_types.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }

        const insertDataPromises = result.map(item => {
            return prisma.zone_types.create({
                data: {
                    id: parseInt(item.id),
                    name: item.name,
                    order_no: parseInt(item.order_no),
                    status: parseInt(item.status),
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const searched_properties = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/searched_properties.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }

        // "id","property_id","user_id","name","mobile","email","searched_on_date","searched_on_time","interested_status","property_user_id","searched_filter_desc","shedule_date","shedule_time","view_status"

        const insertDataPromises = result.map(item => {
            return prisma.searched_properties.create({
                data: {
                    property_id: item.property_id === 'NULL' ? null : item.property_id,
                    user_id: parseInt(item.user_id),
                    name: item.name,
                    mobile: item.mobile,
                    email: item.email,
                    searched_on_date: null,
                    searched_on_time: null,
                    interested_status: parseInt(item.interested_status),
                    property_user_id: parseInt(item.property_user_id),
                    searched_filter_desc: item.searched_filter_desc,
                    shedule_date: null,
                    shedule_time: null,
                    view_status: parseInt(item.view_status),
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}

const contact_seller = async (req, res) => {
    try {
        let data = fs.readFileSync('dbbackup/contact_seller.csv', 'utf8');
        // if file is not found, return an error response
        if (!data) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Parse the data into an array, skipping the first row and grouping each line into an object
        let lines = data.split('\n');
        let result = [];
        let headers = lines[0].split(',');

        // Loop through each line of the CSV starting from the second row (data rows)
        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(',');

            // Skip empty lines
            if (currentline.length < headers.length) continue;

            for (let j = 0; j < headers.length; j++) {
                // Ensure currentline[j] exists and clean the value
                let value = currentline[j] ? currentline[j].replace(/"/g, '').trim() : '';
                let key = headers[j].replace(/"/g, '').trim();

                // Assign cleaned values to the object
                obj[key] = value;
            }

            result.push(obj);
        }

        // "id","property_id","user_id","name","mobile","email","message","contacted_on_date","contacted_on_time","view_status"

        const insertDataPromises = result.map(item => {
            return prisma.contact_seller.create({
                data: {
                    property_id: item.property_id === 'NULL' ? null : item.property_id,
                    user_id: parseInt(item.user_id),
                    name: item.name,
                    mobile: item.mobile,
                    email: item.email,
                    message: item.message,
                    contacted_on_date: null,
                    contacted_on_time: null,
                    view_status: parseInt(item.view_status),
                }
            });
        });

        await Promise.all(insertDataPromises);
        // disconnet the prisma client
        await prisma.$disconnect();
        res.json({ message: 'Data inserted successfully' });

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        res.status(500).json({ message: 'An error occurred while uploading the CSV.' });
    }
}


exports.states = states;
exports.cities = cities;
exports.areaunits = areaunits;
exports.balconies = balconies;
exports.bed_room_types = bed_room_types;
exports.business_types = business_types;
exports.company_details = company_details;
exports.facilities = facilities;
exports.facing = facing;
exports.floors = floors;
exports.furnished = furnished;
exports.locations = locations;
exports.occupancy = occupancy;
exports.ownership_type = ownership_type;
exports.properties = properties;
exports.properties_gallery = properties_gallery;
exports.property_for = property_for;
exports.property_in = property_in;
exports.sub_types = sub_types;
exports.transaction_type = transaction_type;
exports.types = types;
exports.user_types = user_types;
exports.zone_types = zone_types;
exports.searched_properties = searched_properties;
exports.contact_seller = contact_seller;
