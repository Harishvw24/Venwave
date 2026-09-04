const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const ProductController = require("../controllers/ProductController");

// Add a new product
router.post("/add",ProductController.addProduct);
// Get all products
router.get("/all", ProductController.getAllProducts);
// Get a product by ID
router.get("/get/:id", ProductController.getProductById);
// Update a product by ID
router.put("/update/:id", ProductController.updateProductById);
// Delete a product by ID
router.delete("/delete/:id", ProductController.deleteProductById);

module.exports = router;