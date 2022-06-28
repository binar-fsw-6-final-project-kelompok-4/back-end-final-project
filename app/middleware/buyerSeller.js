const jwt = require('../helper/jwt')
const { users } = require('../models')

module.exports = async (req, res, next) => {
    try {
        const payload = jwt.verifyToken(req.headers.token)
        if (!payload) {
            res.status(404).send({ message: 'user not found' })
        }
        const user = await users.findOne({
            where: { email: payload.email, password: payload.password },
        })
        if (!user) {
            res.status(404).send({ message: 'user not found' })
        } else if (user.dataValues.role_id===2){
            req.userlogin = user.dataValues
            next() 
        } else if (user.dataValues.role_id===1){
            req.userlogin = user.dataValues
            next() 
        }else{
         res.status(404).send({ message: 'user not user' })
        }
    } catch (err) {
        res.status(404).send({
            status: 404,
            message: 'User not found',
        })
    }
}