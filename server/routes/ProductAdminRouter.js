const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/products
// @desc Get all products (Admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/admin/products/:id
// @desc Update a product (Admin only)
// @access Private/Admin

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Safe field assignment
    const updates = req.body;

    // Fix gender casing safely here
    if (updates.gender) {
      updates.gender =
        updates.gender.charAt(0).toUpperCase() +
        updates.gender.slice(1).toLowerCase();
    }

    Object.assign(product, updates);

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("🔥 Product update error:", error);
    res.status(500).json({ message: "Error updating product", error });
  }
});


module.exports = router;
