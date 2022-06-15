const bcrypt = require("bcryptjs");
const {users} = require('../../../models/users')

const updateProfile = async (req,res,next)=>{
    try {
        const data = await users.update(
            {
                ...req.body
            },
            {
                where: {id: req.params.id},returning: true
            }
        )
    } catch (error) {
        res.status(500).send(err)
    }
}


const getByEmail = async (req, res, email) => {
    return User.findOne({
        where: {
            email,
        },
    });
};

const createUser = async (req, res) => {
    const existedUser = await getByEmail(req.body.email);
    if (existedUser) {
        return res.status(400).send({
            message: "Email has been used",
        });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    User.create({
            email: req.body.email,
            password: hashedPassword,
            username: req.body.username,
            name: req.body.name,
            address: req.body.address,
            contact: req.body.contact,
            city: req.body.string,
            profileImg: req.body.profileImg,
            roleId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),

        })
        .then((user) => {
            res.status(201).json({
                status: "OK",
                data: user,
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
    getByEmail,
    updateProfile
    
};
