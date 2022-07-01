const {
    trancsaction,
    product
} = require('../../../models')

const firstOffer = async (req, res) => {
    try {
        const sourceProduct = await product.findOne({
            where: {
                id: req.params.id
            }
        })

        const first = await trancsaction.create({
            product_id: req.params.id,
            seller_id: sourceProduct.seller_id,
            buyer_id: req.userlogin.id,
            status: 1,
            offer: req.body.offer
        })

        res.status(201).send({
            status: 201,
            message: 'Berhasil Menawar!',
            data: first
        })
    } catch (error) {
        res.status(402).json({
            status: "FAIL",
            message: error.message,
        });
    }
}

const acceptedOffer = async (req, res) => {
    try {
        const OnGoingoffer = await trancsaction.findOne({
            where: {
                product_id: req.params.id,
                buyer_id: req.params.buyer_id
            }
        })

        const accept = OnGoingoffer.update({
            status: 2,
            available: false
        })
        res.status(201).send({
            status: 201,
            message: 'Penawaran Diterima!',
            data: OnGoingoffer
        })
    } catch (error) {
        res.status(400).send({
            status: "FAIL",
            message: error.message,
        })
    }
}

module.exports = {
    firstOffer,
    acceptedOffer
};