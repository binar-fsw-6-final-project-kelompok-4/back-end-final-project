const jwt = require('../helper/jwt')
const { users } = require('../models')

module.exports = async (req, res, next) => {
    try {
        const payload = jwt.verifyToken(req.headers.token)
        if (!payload) {
            res.status(404).send({ message: 'user not found' })
        }
        const seller = await users.findOne({
            where: { email: payload.email, password: payload.password },
        })
        if (!seller) {
            res.status(404).send({ message: 'user not found' })
        } else if (seller.dataValues.role_id==2){
            req.userlogin = seller.dataValues
            next() 
        }else{
         res.status(404).send({ message: 'user not seller' })
        }
    } catch (err) {
        res.status(404).send({
            status: 404,
            message: 'User not found',
        })
    }
}
