const {
    trancsaction, product
} = require('../../../models')

const firstOffer= async (req,res) =>{
    try {
        const sourceProduct = await product.findOne({where: {id :req.params.id}})
        
        if (sourceProduct.seller_id == req.userlogin.id) {
            return(
            res.status(400).json({
                error: "Anda adalah pemmilik produk ini!"
            })
            )
        }

        if (req.body.offer > sourceProduct.price ) {
            return(
                res.status(500).json({
                    status: "Tawaran anda lebih tinggi dari harga awal",
                })
            )
        }
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
        res.status(201).json({
            status: "FAIL",
            message: error.message,
        });
    }
}

const updatOffer = async (req,res) =>{
    try {
        const sourceProduct = await trancsaction.findOne({where: {product_id :req.params.id}})
        const sourceTransaction = await sourceProduct.findOne({where: {buyer_id :req.userlogin.id}})
        if (req.userlogin.id == ) {
            
        }
    } catch (error) {
        
    }
}
module.exports = {
    firstOffer
};