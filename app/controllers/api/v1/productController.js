const {
    product
} = require('../../../models')
const fs = require("fs");
const path = require("path");

const createProduct = async (req, res) => {
    try {
        await product.create({
            product_name: req.body.product_name,
            price: req.body.price,
            category: req.body.category,
            product_img1: req.file.filename,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        res.status(201).json({
            message: "Product Created",
            data: product,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

// const updateProductById = async (req, res) => {
//     try {
//         const {product_name, price, category} = req.body;
//         const product_img1 = req.file.filename;
//         const products = await product.findOne({
//             where: {id: req.params.id},
//         });
//         fs.unlink(path.join(__dirname, "../../../../uploads/" + products.product_img1), (err) => {
//             if (err) {
//                 console.log(err);
//             }
//         });
//         await product.update(
//             {
//                 product_name: product_name,
//                 price: price,
//                 category: category,
//                 product_img1: product_img1,
//             },
//             {
//                 where: {id: req.params.id},
//             }
//         );
//     } catch (error) {
//         res.status(500).json({error: error.message});
//     }
// };

const updateProductById = async (req, res) => {
    try {
        await product.findOne({
            where: {
                id: req.params.id,
            },
        });
        fs.unlink(path.join(__dirname, "../../../../uploads/" + product.product_img1), (err) => {
            if (err) {
                console.log(err);
            }
        });
        await product.update({
            product_name: req.body.product_name,
            price: req.body.price,
            category: req.body.category,
            product_img1: req.file.filename,
            updatedAt: new Date(),
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({
            message: "Product Updated",
            data: product,
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

// const deleteProductById = async (req, res) => {
//     try {
//         await product.findOne({
//             where: {
//                 id: req.params.id,
//             },
//         });
//         fs.unlinkSync(path.join(__dirname, "../../../../uploads/" + product.product_img1), (err) => {
//             if (err) {
//                 console.log(err);
//             }
//         });
//         await product.destroy(req.body);
//         res.status(200).json({
//             message: "Product Deleted",
//             data: product,
//         });
//     } catch (error) {
//         res.status(400).json({
//             error: error.message
//         });
//     }
// }

const deleteProductById = async (req, res) => {
    try {
        const products = await product.findOne({
            where: {
                id: req.params.id
            }
        });
        products.destroy(req.body);
        fs.unlinkSync(path.join(__dirname, "../../../../uploads/" + products.product_img1));
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const listAllProduct = async (req, res) => {
    try {
        const products = await product.findAll();
        res.status(200).json({
            status: "OK",
            products,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    deleteProductById,
    updateProductById,
    listAllProduct
}