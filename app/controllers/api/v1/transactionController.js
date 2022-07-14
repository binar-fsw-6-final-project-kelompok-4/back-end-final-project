const { Transaction } = require('sequelize/types');
const {
    trancsaction, product
} = require('../../../models')

const firstOffer= async (req,res) =>{
    try {
        const sourceProduct = await product.findOne({where: {id :req.params.id}});
        const verifProduct = await trancsaction.findOne({where:{product_id : req.params.id,buyer_id: req.userlogin.id}})
        // const verifBuyer = await verifProduct.findOne({where:{buyer_id : req.userlogin.id,product_id:req.params.id}})

        if (sourceProduct.seller_id == req.userlogin.id) {
            return(
            res.status(400).json({
                error: "Anda adalah pemmilik produk ini!"
            })
            )
        }

        if (verifProduct.buyer_id == req.userlogin.id && verifProduct.status == 1 ) {
            return(
                res.status(201).json({
                    error: "Anda sudah punya tawaran produk ini!",
                    data : verifProduct
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

const getTransaction = async (req,res) =>{
    try {
        const sourceTransaction = await trancsaction.findOne({where: {id :req.params.id}, include : product})
        res.status(201).send({
            status : 201,
            data : sourceTransaction
        })
    } catch (error) {
    }
}

// const updatOffer = async (req,res) =>{
//     try {
//         const buyerTransaction = await Trancsaction.findOne({where: {product_id :req.params.id,buyer_id:req.userlogin.id}, include : user})
//         const sellerTransaction = await Trancsaction.findOne({where: {product_id :req.params.id,seller_id:req.userlogin.id}, include : user})

//         if (buyerTransaction.buyer_id == req.userlogin.id) {
//             if 
//             const offer = await trancsaction.update({offer: req.body.offer},{where :{product_id :req.params.id,buyer_id:req.userlogin.id} })
//             return (
//                 res.status(201).send({
//                     status: 201,
//                     message: 'Tawaran dinaikan!',
//                     data: offer
//                 })
//             )
//         }
//         else if(sellerTransaction.seller_id == req.userlogin.id){
//             const offer = await trancsaction.update({offer: req.body.offer},{where :{product_id :req.params.id,seller_id:req.userlogin.id} })
//             return (
//                 res.status(201).send({
//                     status: 201,
//                     message: 'Tawaran diturunkan!',
//                     data: offer
//                 })
//             )
//         }
//         else{
//             return(
//                 res.status(500).send(error)
//             )
//         }

        

//     } catch (error) {
//         res.status(500).send(error)
//     }
// }
module.exports = {
    firstOffer,
    getTransaction,
};