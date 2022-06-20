const {
    product
} = require('../../../models')

const createProduct = async (req, res) => {
    product.create({
            product_name: req.body.product_name,
            price: req.body.price,
            category: req.body.category,
            seller_id:req.userlogin.id,
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

const updateProductById = async (req, res) => {
    const product = req.product;
    product
        .update(req.body)
        .then(() => {
            res.status(200).json({
                status: "OK",
                data: product,
            });
        })
        .catch((err) => {
            res.status(422).json({
                status: "FAIL",
                message: err.message,
            });
        });
};

const deleteProductById = async (req, res) => {
    req.product
        .destroy()
        .then(() => {
            res.status(204).end();
        })
        .catch((err) => {
            res.status(422).json({
                status: "FAIL",
                message: err.message,
            });
        });
};

const setProduct = async (req, res, next) => {
    product.findByPk(req.params.id)
        .then((product) => {
            if (!product) {
                res.status(404).json({
                    status: "FAIL",
                    message: "Product not found!",
                });
                return;
            }
            req.product = product;
            next()
        })
        .catch((err) => {
            res.status(404).json({
                status: "FAIL",
                message: "Product not found!",
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

const getProduct = async (req,res)=>{
    try {
        const data = product.findOne({where : {id: req.params.id}})
        res.status(200).send({
            status: 200,
            message: 'Data Product Ditemukan!',
            data: data
        })
    } catch (error) {
        res.status(404).json({
            status : 404,
            error : "produk tidak ditemukan"
        })
    }
}

const filterProduct = async (req,res) =>{
    try {
        const data= product.findAll({where: {category: "filter"}})
    } catch (error) {
        
    }
}


module.exports = {
    createProduct,
    deleteProductById,
    updateProductById,
    setProduct,
    listAllProduct,
    getProduct
}