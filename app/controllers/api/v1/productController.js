const {
    product
} = require('../../../models')

const createProduct = async (req, res) => {
    product.create({
            product_name: req.body.product_name,
            price: req.body.price,
            category: req.body.category,
            createdAt: new Date(),
            updatedAt: new Date(),

        })
        .then((product) => {
            res.status(201).json({
                status: "OK",
                data: product,
            });
        })
        .catch((err) => {
            res.status(201).json({
                status: "FAIL",
                message: err.message,
            });
        });
};

const listAllProduct = async (req, res) => {

    product.findAll()
        .then((product) => {
            res.status(200).json({
                data: product,
            });
        })
        .catch((err) => {
            res.status(400).send(err)
        })


};

module.exports = {
    createProduct,
    listAllProduct
}