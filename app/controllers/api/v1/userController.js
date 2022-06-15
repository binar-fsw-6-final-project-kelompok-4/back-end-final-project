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

module.exports = class {
    updateProfile
}
