const bcrypt = require("bcryptjs");
const {
    users
} = require('../../../models')
const jwt = require('../../../helper/jwt')

const updateProfile = async (req, res, next) => {
    const cekData = await users.findOne({
        where: {
            id: req.params.id,
        }
    });

    if (!cekData) {
        res.status(400).send({
            status: 400,
            message: "User tidak ditemukan!",
        });
    } else {
        try {
            const result = await users.update({
                username: req.body.username,
                profile_img: req.file.filename,
                address: req.body.address,
                contact: req.body.contact,
                city: req.body.city                
            }, {
                where: {
                    id: req.params.id,
                }
            });
            const dataUser = JSON.parse(JSON.stringify(result));
            res
                .status(201)
                .json({
                    status: 201,
                    message: "Data user telah diubah",
                    data: dataUser,
                })
                .end();
        } catch (err) {
            console.log(err);
            res.send(err);
        }
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
            message: 'Login succses',
            data: {
                admin: secureuser,
                token: token
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
            role_id: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const user_data = JSON.parse(JSON.stringify(newUser));

        delete user_data.password;

        res.status(201).json({
            user: user_data,
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

module.exports = {
    createUser,
    updateProfile,
    login
    // getByEmail
};