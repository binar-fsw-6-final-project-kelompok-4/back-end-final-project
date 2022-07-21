const {
    product,
    users,
    image,
} = require('../../../models')
const fs = require("fs");
const path = require("path");
const {
    Op
} = require("sequelize");
const cloudinary = require("../../../../utils/cloudinary");
const {
    promisify
} = require('util');
const cloudinaryUpload = promisify(cloudinary.uploader.upload);
const cloudinaryDestroy = promisify(cloudinary.uploader.destroy);


const createProduct = async (req, res) => {
    try {
        let fotoProduk = [];
        let fileBase64 = [];
        let file = [];
        console.log(req.body, "=======================")
        const productCreated = await product.create({
            product_name: req.body.product_name,
            price: req.body.price,
            category: req.body.category,
            description : req.body.description,
            seller_id: req.userlogin.id,
            available: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        console.log("data created=======================")
        console.log(req.files, "===============req.files")
        for (var i = 0; i < req.files.length; i++) {
            fileBase64.push(req.files[i].buffer.toString("base64"));
            file.push(`data:${req.files[i].mimetype};base64,${fileBase64[i]}`);
            console.log(file[i], "=================file[i]")
            const result = await cloudinaryUpload(file[i]);
            console.log(result, "================result")
            fotoProduk.push(result.secure_url);
            await image.create({
                product_id: productCreated.id,
                img: fotoProduk[i],
            });
        }

        console.log("image created================")
        const response_data = await product.findByPk(productCreated.id, {
            include: [{
                model: image
            }]
        });

        res.status(201).send({
            message: "Product Created",
            data: response_data,
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
        let fotoProduk = [];
        let fileBase64 = [];
        let file = [];
        const id = req.params.id;
        const productUpdated = await product.update({
            product_name: req.body.product_name,
            price: req.body.price,
            category: req.body.category,
            updatedAt: new Date(),
        }, {
            where: {
                id
            }
        });
        const productPic = await image.findAll({
            where: {
                product_id: id
            }
        });
        let cloudImage;

        if (req.files.length > 0) {
            if (productPic.length > 0) {
                for (var i = 0; i < productPic.length; i++) {
                    cloudImage = productPic[i].img.substring(62, 82);
                    cloudinaryDestroy(cloudImage);
                }
            }
            await image.destroy({
                where: {
                    product_id: id
                }
            })
            for (var i = 0; i < req.files.length; i++) {
                fileBase64.push(req.files[i].buffer.toString("base64"));
                file.push(`data:${req.files[i].mimetype};base64,${fileBase64[i]}`);
                const result = await cloudinaryUpload(file[i]);
                fotoProduk.push(result.secure_url);
                await image.create({
                    product_id: id,
                    img: fotoProduk[i],
                });
            }
        }
        res.status(200).send({
            message: "Product Updated",
        })
    } catch (error) {
        res.status(400).send({
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
        const id = req.params.id;

        const productPic = await image.findAll({
            where: {
                product_id: id
            },
        });
        let cloudImage;

        if (productPic.length > 0) {
            for (var i = 0; i < productPic.length; i++) {
                cloudImage = productPic[i].img.substring(62, 82);
                cloudinaryDestroy(cloudImage);
            }
        }
        await image.destroy({
            where: {
                product_id: id
            }
        });
        await product.destroy({
            where: {
                id: req.params.id,
            }
        })

        res.status(200).json({
            message: "Product Deleted",
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const listAllProduct = async (req, res) => {
    try {
        const products = await product.findAll({
            include: [{
                model: image,
            }, ],
            order: [
                ["createdAt", "DESC"],
                [{
                    model: image
                }, "createdAt", "DESC"],
            ],
        });
        res.status(200).json({
            status: "OK",
            data: products
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

// const getProduct = async (req,res)=>{
//     try {
//         const data = product.findOne({where : {id: req.params.id}})
//         res.status(200).send({
//             status: 200,
//             message: 'Data Product Ditemukan!',
//             data: data
//         })
//     } catch (error) {
//         res.status(404).json({
//             status : 404,
//             error : "produk tidak ditemukan"
//         })
//     }
// }

// const filterProduct = async (req,res) =>{
//     try {
//         const data= product.findAll({where: {category: "filter"}})
//     } catch (error) {

//     }
// }


const getProductbyId = async (req, res, next) => {
    product.findOne({
            where: {
                id: req.params.id
            },
            include: users
        })
        .then((product) => {
            if (product) {
                res.status(200).json({
                    data: product,
                });
            } else {
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

const filterProduct = async (req, res) => {
    try {
        const data = product.findAll({
            where: {
                category: "filter"
            }
        })
    } catch (error) {
        res.status(400).send
    }
}

const getProductbyName = async (req, res) => {
    product.findAll({

            where: {

                product_name: {
                    [Op.like]: '%' + req.query.product_name.toLowerCase() + '%'

                }
            }

        }).then((product) => {
            if (product) {
                res.status(200).json({
                    data: product,
                });
            } else {
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

const getProductbyCategory = async (req, res) => {
    try {
        const result = await product.findAll({
            include: [{
                model: image,
            }, ],
            where: {
                category: req.body.category
            },
        });
        res.status(200).json({
            status: 200,
            data: result,
        });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}


const getAllUserProduct = async (req, res) => {
    product.findAll({
            where: {
                price: req.userlogin.id
            }
        })
        .then((product) => {
            if (product) {
                res.status(200).json({
                    data: product,
                });
            } else {
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
const softDelete = async (req, res) => {
    try {
        product.update({
            available: false
        }, {
            where: {
                id: req.params.id
            },
            returning: true
        })
    } catch (error) {

    }
}

module.exports = {
    createProduct,
    deleteProductById,
    updateProductById,
    listAllProduct,
    getProductbyId,
    getAllUserProduct,
    getProductbyCategory,
    softDelete,
    getProductbyName
}