const bcrypt = require("bcryptjs");
const {
    users
} = require('../../../models/users')

const updateProfile = async (req, res, next) => {
    try {
        const data = await users.update({
            ...req.body
        }, {
            where: {
                id: req.params.id
            },
            returning: true
        })
    } catch (error) {
        res.status(500).send(err)
    }
}


// const getByEmail = async (req, res, email) => {
//     return users.findOne({
//         where: {
//             email,
//         },
//     });
// };

const createUser = async (req, res) => {
    // const existedUser = await getByEmail(req.body.email);
    // if (existedUser) {
    //     return res.status(400).send({
    //         message: "Email has been used",
    //     });
    // }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.create({
            email: req.body.email,
            password: hashedPassword,
            username: req.body.username,
            createdAt: new Date(),
            updatedAt: new Date(),

        })
        .then((users) => {
            res.status(201).json({
                status: "OK",
                data: users,
            });
        })
        .catch((err) => {
            res.status(201).json({
                status: "FAIL",
                message: err.message,
            });
        });
};

module.exports = {
    createUser,
    updateProfile
    // getByEmail
};