const {
    trancsaction,
    product
} = require('../../../models')

const firstOffer = async (req, res) => {
    try {
        console.log("masuk controller ==================");
        const sourceProduct = await product.findOne({
            where: {
                id: req.params.id
            }
        });
        console.log("source product ==================");
        const verifProduct = await trancsaction.findOne({
            where: {
                product_id: req.params.id,
                buyer_id: req.userlogin.id
            }
        })
        // const verifBuyer = await verifProduct.findOne({where:{buyer_id : req.userlogin.id,product_id:req.params.id}})
        console.log("verif product ==================");
        if (sourceProduct.seller_id == req.userlogin.id) {
            return (
                res.status(400).json({
                    error: "Anda adalah pemmilik produk ini!"
                })
            )
        } else {
            if (verifProduct == null) {
                if (req.body.offer > sourceProduct.price) {
                    return (
                        res.status(500).json({
                            status: "Tawaran anda lebih tinggi dari harga awal",
                        })
                    )
                } else {
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
                }
            } else {
                return (
                    res.status(201).json({
                        error: "Anda sudah punya tawaran produk ini!",
                        data: verifProduct
                    })
                )
            }
        }



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

        const accept = await OnGoingoffer.update({
            status: 2,
            available: false
        })
        res.status(201).send({
            status: 201,
            message: 'Penawaran Diterima!',
            data: accept
        })
    } catch (error) {
        res.status(400).send({
            status: "FAIL",
            message: error.message,
        })
    }
}

const rejectedOffer = async (req, res) => {
    try {
        const OnGoingoffer = await trancsaction.findOne({
            where: {
                product_id: req.params.id,
                buyer_id: req.params.buyer_id
            },
        })
        const reject = await OnGoingoffer.update({
            status: 3
        })
        res.status(201).send({
            status: 201,
            message: 'Penawaran Ditolak!',
            data: reject
        })
    } catch (error) {
        res.status(400).send({
            status: "FAIL",
            message: error.message,
        })
    }
}

const getTransaction = async (req, res) => {
    try {
        const sourceTransaction = await trancsaction.findOne({
            where: {
                id: req.params.id
            },
            include: product
        })
        res.status(201).send({
            status: 201,
            data: sourceTransaction
        })
    } catch (error) {}
}

// const updateOffer = async (req,res) =>{
//     try {
//         const sourceTransaction = await trancsaction.findOne({where: {id :req.params.id}, include : product})
//         if (req.userlogin.id == sourceTransaction.buyer_id) {
//             const offer = await trancsaction.update({offer: req.body.offer},{where :{} })
//         }
//         else if (req.userlogin.id == sourceTransaction.product.seller_id){



// //     } catch (error) {
// //         res.status(500).send(error)
// //     }
//  }
module.exports = {
    firstOffer,
    acceptedOffer,
    rejectedOffer,
    getTransaction
};