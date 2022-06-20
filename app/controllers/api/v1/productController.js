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

const updateProductById = async (req, res) => {
    try {
        await product.findOne({
            where: {
                id: req.params.id,
            },
        }).then((updatedProduct) => {
            if (!updatedProduct) return res.status(404).send();
            updatedProduct.update({
                product_name: req.body.product_name,
                price: req.body.price,
                category: req.body.category,
                updatedAt: new Date(),
            });
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

const deleteProductById = async (req, res) => {
    try {
        await product.findOne({
            where: {
                id: req.params.id,
            },
        }).then((deletedProduct) => {
            if (!deletedProduct) return res.status(404).send();
            deletedProduct.update({
                updatedAt: new Date(),
            });
        });
        res.status(200).json({
            message: "Product Deleted",
            data: product,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

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