const {
    product
} = require('../../../models')

const createProduct = async (req, res) => {
    product.create({
        product_name: req.body.product_name,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description,
        product_img1: req.body.product_img1,
        product_img2: req.body.product_img2,
        product_img3: req.body.product_img3,
        product_img4: req.body.product_img4,
        seller_id : req.userlogin.id
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

const getProductbyId = async (req, res, next) => {
    product.findByPk(req.params.id)
        .then((product) => {
            if (product) {
                res.status(200).json({
                    data: product,
                });
            } 
            else {
                res.status(404).json({
                    status: "FAIL",
                    message: "Product not found!",
                });
            }
        })
        .catch((err) => {
            res.status(400).send
        })
    }

const filterProduct = async (req,res) =>{
    try {
        const data= product.findAll({where: {category: "filter"}})
    } catch (error) {
        
    }
}

const getAllUserProduct = async (req, res) => {
    product.findAll({where: {price: req.userlogin.id}})
    .then((product) => {
        if (product) {
            res.status(200).json({
                data: product,
            });
        } 
        else {
            res.status(404).json({
                status: "FAIL",
                message: "Product not found!",
            });
        }
    })
    .catch((err) => {
        res.status(400).send(err)
    });

};



module.exports = {
    createProduct,
    deleteProductById,
    updateProductById,
    setProduct,
    listAllProduct,
    getProductbyId
}