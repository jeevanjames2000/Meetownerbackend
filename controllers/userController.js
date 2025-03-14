
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const multiparty = require('multiparty');
const fs = require('fs');
const path = require('path');

const getUsertypes = async (req, res) => {
    try {
        const usertypes = await prisma.user_types.findMany();
        const neUserTypes = usertypes.map((usertype) => {
            return {
                value: usertype.login_type_id,
                label: usertype.login_type,
            }
        });
        return res.status(200).json({
            status: 'success',
            message: 'User types fetched successfully',
            usertypes: neUserTypes
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error fetching user types'
        });
    }
}

const getUserDetails = async (req, res) => {
    const { user_id, user_type } = req.query;
    try {
        if (!user_id) {
            return res.status(200).json({
                status: 'error',
                message: 'User ID is required'
            });
        }
        const user = await prisma.users.findUnique({
            where: {
                id: parseInt(user_id),
                user_type: parseInt(user_type)
            }
        });

        const user_type_name = await prisma.user_types.findUnique({
            where: {
                login_type_id: parseInt(user_type)
            }
        });

        // fetch city_id from the cities table
        const city = await prisma.cities.findFirst({
            where: {
                name: user?.city
            }
        });

        const state = await prisma.states.findFirst({
            where: {
                name: user.state
            }
        });

        const userDetails = {
            user_id: user.id,
            user_type: user_type_name?.login_type,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            photo: user?.photo ? `${process.env.API_URL}/uploads/${user.photo}` : null,
            address: user.address,
            city: user.city,
            city_id: city?.id,
            state: user.state,
            state_id: state?.id,
            status: user.status,
            pincode: user.pincode,
            gst_number: user.gst_number,
            rera_number: user.rera_number
        }
        return res.status(200).json({
            status: 'success',
            message: 'User details fetched successfully',
            userDetails: userDetails
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error fetching user details'
        });
    }
}

const updateUserDetails = async (req, res) => {
    const { user_id, user_type, name, email, mobile, address, city, state, pincode, gst_number, rera_number } = req.body;
    try {
        // check user exists
        const userExists = await prisma.users.findFirst({
            where: {
                id: parseInt(user_id),
                user_type: parseInt(user_type)
            }
        });

        if (!userExists) {
            return res.status(200).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // get city_name state_name from city_id and state_id

        const cityData = await prisma.cities.findFirst({
            where: {
                id: parseInt(city)
            }
        });

        const stateData = await prisma.states.findFirst({
            where: {
                id: parseInt(state)
            }
        });


        const user = await prisma.users.update({
            where: {
                id: parseInt(user_id),
                user_type: parseInt(user_type)
            },
            data: {
                name: name,
                email: email,
                mobile: mobile,
                address: address,
                city: cityData?.name,
                state: stateData?.name,
                pincode: pincode,
                gst_number: gst_number,
                rera_number: rera_number
            }
        });

        return res.status(200).json({
            status: 'success',
            message: 'User details updated successfully',
            userDetails: user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error updating user details'
        });
    }
}

const updateUserPhoto = async (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }

        const { user_id, user_type } = fields;

        try {
            if (!user_id || !user_type) {
                return res.status(400).json({ status: 'error', message: 'User ID or type is missing' });
            }

            const user = await prisma.users.findUnique({
                where: {
                    id: parseInt(user_id),
                    user_type: parseInt(user_type),
                },
            });

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found',
                });
            }

            const uploadedFiles = files.photo;
            if (!uploadedFiles) {
                return res.status(400).json({ status: 'error', message: 'No file uploaded' });
            }

            const maindir = path.join(__dirname, '..', 'uploads');
            if (!fs.existsSync(maindir)) {
                fs.mkdirSync(maindir, { recursive: true });
            }

            const tempPath = uploadedFiles[0].path;
            const originalFilename = uploadedFiles[0].originalFilename;
            const ext = path.extname(originalFilename);
            const timestamp = Date.now();
            const newFilename = `${path.basename(originalFilename, ext)}_${timestamp}${ext}`;
            const targetPath = path.join(maindir, newFilename);

            fs.copyFileSync(tempPath, targetPath);
            fs.unlinkSync(tempPath);

            // Delete the old photo if it exists
            const imagePath = user.photo ? path.join(__dirname, '..', 'uploads', user.photo) : null;
            if (imagePath && fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            // Update user photo in the database
            await prisma.users.update({
                where: {
                    id: parseInt(user_id),
                    user_type: parseInt(user_type),
                },
                data: {
                    photo: newFilename,
                    uploaded_from_seller_panel: 'Yes',
                },
            });

            return res.status(200).json({
                status: 'success',
                message: 'Profile photo updated successfully',
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 'error',
                message: 'Error updating profile photo',
            });
        }
    });
};

const updateUserPhotomain = async (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }

        const user_id = fields.user_id?.[0];

        try {
            const user = await prisma.users.findUnique({
                where: { id: parseInt(user_id) },
            });

            if (!user) {
                return res.status(404).json({ status: 'error', message: 'User not found' });
            }

            const uploadedFiles = files.photo;
            if (!uploadedFiles || uploadedFiles.length === 0) {
                return res.status(400).json({ status: 'error', message: 'No file uploaded' });
            }

            const maindir = path.join(__dirname, '..', 'uploads');
            if (!fs.existsSync(maindir)) {
                fs.mkdirSync(maindir, { recursive: true });
            }

            const tempPath = uploadedFiles[0].path;
            const originalFilename = uploadedFiles[0].originalFilename;
            const ext = path.extname(originalFilename);
            const timestamp = Date.now();
            const newFilename = `${path.basename(originalFilename, ext)}_${timestamp}${ext}`;
            const targetPath = path.join(maindir, newFilename);

            // Validate temp file existence before proceeding
            if (!fs.existsSync(tempPath)) {
                return res.status(400).json({ status: 'error', message: 'Uploaded file not found' });
            }

            // Move the file to the uploads directory
            fs.copyFileSync(tempPath, targetPath);
            fs.unlinkSync(tempPath);

            // Delete the old photo if it exists
            const oldPhotoPath = user.photo ? path.join(maindir, user.photo) : null;
            if (oldPhotoPath && fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath);
            }

            // Update user photo in the database
            await prisma.users.update({
                where: { id: parseInt(user_id) },
                data: {
                    photo: newFilename,
                    uploaded_from_seller_panel: 'Yes',
                },
            });

            return res.status(200).json({
                status: 'success',
                message: 'Profile photo updated successfully',
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 'error',
                message: 'Error updating profile photo',
            });
        }
    });
};

exports.getUsertypes = getUsertypes;
exports.getUserDetails = getUserDetails;
exports.updateUserDetails = updateUserDetails;
exports.updateUserPhoto = updateUserPhoto;
exports.updateUserPhotomain = updateUserPhotomain;