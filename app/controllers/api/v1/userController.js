const bcrypt = require("bcryptjs");
const {
    users
} = require('../../../models')
const jwt = require('../../../helper/jwt')

const updateProfile = async (req, res, next) => {
    try {
        const data = await users.update({...req.body}, {where: {id: req.userlogin.id},returning: true})
        res.status(201).send({
            status: 201,
            message: 'Data user diupdate!',
            data: data
        })
    } catch (error) {
        res.status(500).send({
            error: "500"
        }
            
        )
    }
}

const login = async (req, res) => {
    try {
        const user = await users.findOne({where: {email: req.body.email}})
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
        const token = jwt.generateToken({email: user.email, password: user.password})
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
            role_id: 1,
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

const infoUser = async(req,res) =>{
    try{
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
    updateProfile,
    infoUser
    // getByEmail
};