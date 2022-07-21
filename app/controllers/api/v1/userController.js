const bcrypt = require("bcryptjs");
const {
    users
} = require('../../../models');
const jwt = require('../../../helper/jwt');
const {
    promisify
} = require("util");
const cloudinary = require("../../../../utils/cloudinary");
const cloudinaryUpload = promisify(cloudinary.uploader.upload);
const cloudinaryDestroy = promisify(cloudinary.uploader.destroy);

const getUsers = async (req, res) => {
    try {
        const result = await users.findAll();
        res.status(200).json({
            status: 200,
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

const getUserById = async (req, res) => {
    const cekData = await users.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!cekData) {
        res.status(400).send({
            status: 400,
            message: "User tidak ditemukan!",
        });
    } else {
        try {
            const result = await users.findAll({
                where: {
                    id: req.params.id
                },
            });
            res.status(200).json({
                status: 200,
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }
}

const updateProfile = async (req, res) => {
    try {
        // const {
        //     seller_id,
        //     username,
        //     name,
        //     address,
        //     contact,
        //     city
        // } = req.body;
        // let fotoProfile;
        // let fileBase64;
        // let file;

        // const user = await users.findByPk(seller_id);
        // const user_data = JSON.parse(JSON.stringify(user));

        // if (req.file) {
        //     // Delete Image from Cloudinary
        //     if (user.profile_img !== null) {
        //         let cloudImage = user_data.profile_img.substring(62, 82);
        //         cloudinaryDestroy(cloudImage);
        //     }
        //     // Upload New Image to Cloudinary
        //     fileBase64 = req.file.buffer.toString("base64");
        //     file = `data:${req.file.mimetype};base64,${fileBase64}`;
        //     const resultImage = await cloudinaryUpload(file);
        //     fotoProfile = resultImage.secure_url;
        //     await users.update(seller_id, {
        //         username,
        //         name,
        //         alamat,
        //         address,
        //         contact,
        //         city,
        //         profile_img: fotoProfile,
        //     });
        //     return res.status(200).json({
        //         status: "OK",
        //         message: "Profile berhasil diperbarui",
        //         data: JSON.parse(JSON.stringify(user)),
        //     });
        // }

        // await users.update(seller_id, {
        //     username,
        //     name,
        //     alamat,
        //     address,
        //     contact,
        //     city,
        // });

        // res.status(200).json({
        //     status: "OK",
        //     message: "Profile berhasil diperbarui",
        //     data: JSON.parse(JSON.stringify(user)),
        // });
        const result = await cloudinaryUpload(req.file.path);
        const data = await users.update({
            username: req.body.username,
            address: req.body.address,
            contact: req.body.contact,
            profile_img: result.secure_url,
            city: req.body.city,
            name: req.body.name
        }, {
            where: {
                id: req.userlogin.id
            },
            returning: true
        })

        const userInfo = await users.findOne({
            where: {
                id: req.userlogin.id
            }
        })

        if (
            userInfo.name == null ||
            userInfo.address == null ||
            userInfo.contact == null ||
            userInfo.city == null
        ) {
            return (
                res.status(201).send({
                    status: 201,
                    message: 'Data user diupdate!',
                    data: data
                })
            )
        } else {
            const sellerChange = await users.update({
                role_id: 2
            }, {
                where: {
                    id: req.userlogin.id
                },
                returning: true
            })
            return (
                res.status(201).send({
                    status: 201,
                    message: 'Data user diupdate dan anda menjadi seller!',
                    data: sellerChange
                })
            )
        }
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }

}


const login = async (req, res) => {
    try {
        const user = await users.findOne({
            where: {
                email: req.body.email
            }
        })
        if (!user) {
            res.status(404).send({
                status: 404,
                message: 'user not found!',
            })
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user.password)

        if (!isValidPassword) {
            res.status(404).send({
                status: 400,
                message: 'Email and password not match!',
            })
        }
        const token = jwt.generateToken({
            email: user.email,
            password: user.password
        })
        const secureuser = user.dataValues
        delete secureuser.password

        res.status(200).send({
            status: 200,
            message: 'Login success',
            data: {
                token: token,
                user: secureuser
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

const createUser = async (req, res) => {
    try {
        const email = req.body.email.toLowerCase();
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await users.findOne({
            where: {
                email,
            }
        });
        if (user) {
            res.status(400).json({
                message: "Email already exists"
            });
            return;
        }

        const newUser = await users.create({
            username: req.body.username,
            email,
            password: hashedPassword,
            name: null,
            address: null,
            contact: null,
            city: null,
            profile_img: null,
            role_id: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const user_data = JSON.parse(JSON.stringify(newUser));

        delete user_data.password;

        res.status(201).json({
            message: "User Created",
            data: user_data,
        });
    } catch (err) {
        res.status(400).json({
            status: "FAIL",
            message: err.message,
        });
    }
}
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     users.create({
//             email: req.body.email,
//             password: hashedPassword,
//             username: req.body.username,
//             createdAt: new Date(),
//             updatedAt: new Date(),

//         })
//         .then((users) => {
//             res.status(201).json({
//                 status: "OK",
//                 data: users,
//             });
//         })
//         .catch((err) => {
//             res.status(201).json({
//                 status: "FAIL",
//                 message: err.message,
//             });
//         });
// };

const infoUser = async (req, res) => {
    try {
        res.status(200).send({
            status: 200,
            message: 'Data User Ditemukan!',
            data: req.userlogin
        })
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}


module.exports = {
    createUser,
    updateProfile,
    login,
    infoUser,
    getUsers,
    getUserById
    // getByEmail
};