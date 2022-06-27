const bcrypt = require("bcryptjs");
const {
    users
} = require('../../../models')
const jwt = require('../../../helper/jwt')

const updateProfile = async (req, res) => {
    try {
        const data = await users.update({
            username: req.body.username,
            profile_img: req.file.filename,
            address: req.body.address,
            contact: req.body.contact,
            name: req.body.name,
            city: req.body.city}, {where: {id: req.userlogin.id},returning: true})

        const userInfo = await users.findOne({where:{id:req.userlogin.id}})
        if (
            userInfo.name== null ||
            userInfo.address==null ||
            userInfo.contact==null ||
            userInfo.city==null ||
            userInfo.profile_img== null 
        ) {
            return(
                res.status(201).send({
                    status: 201,
                    message: 'Data user diupdate!',
                    data: data
                })
            )
        }else{
            const sellerChange = await users.update({role_id:2}, {where: {id: req.userlogin.id},returning: true})
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
            status: "FAIL",
            message: error.message,
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
            role_id: 1,
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
    infoUser
    // getByEmail
};