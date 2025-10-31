const express = require("express");
const Product = require("../models/Product.js");
const { protect, admin } = require("../middleware/authMiddleware.js");

const router = express.Router();

// POST /api/products  → Add new product (Admin only)
router.post("/", protect, admin, async (req, res) => {
    try {
        const { name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            gender,
            sizes,
            colors,
            collections,
            material,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku

        } = req.body;

        const product = new Product({
                   name,
                   description,
                   price,
                   discountPrice,
                   countInStock,
                   category,
                   brand,
                   gender,
                   sizes,
                   colors,
                   collections,
                   material,
                   images,
                   isFeatured,
                   isPublished,
                   tags,
                   dimensions,
                   weight,
                   sku,
                   user: req.user._id // reference to the admin person creating the product
       
               });

        await product.save();
        res.status(201).json({ message: "✅ Product added successfully", product });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "❌ Error adding product", error: error.message });
    }
});

module.exports = router