const Product = require('../models/productModel');

// Add a new product
const addProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: "Product added successfully", product });

    }
    catch (error) {
    console.error("Error adding stock item:", error.message);
    res.status(500).json({ message: "Server Error" });
    }
}

// Get a product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
    res.status(200).json({message: "Product fetched successfully", product });
    }
    catch (error) {
        console.error("Error fetching product:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ message: "Products fetched successfully", products });
    }
    catch (error) {
        console.error("Error fetching stock items:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

// Update a product by ID
const updateProductById = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product updated successfully", product });
    }
    catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

// Delete a product by ID
const deleteProductById = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

module.exports = {
    addProduct,
    getProductById,
    getAllProducts,
    updateProductById,
    deleteProductById
};