

const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

//@route POST / api/products
// @desc Create a new Product
// @access Private (admin)

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
        const createdProduct = await product.save();
        res.status(201).json(createdProduct)
    } catch (error) {
        console.error("Create error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

//@route PUT /api/products/:id
// @desc update the existing product by id
//@access priate (admin)

router.put("/:id", protect, admin, async (req, res) => {
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
        // find the product in the db using the id in the url

        const product = await Product.findById(req.params.id);

        if (product) {
            //update the product feild
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.gender = gender || product.gender;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.images = images || product.images;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;


            // save the product to db

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product Not Found" })
        }

    } catch (error) {
        console.error("update error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// @route DELETE /api/products/:id
//@desc delete the product by its id by its db
//@access private(admin)

router.delete("/:id", protect, admin, async (req, res) => {
    try {
        //find the product by the id
        const product = await Product.findById(req.params.id);
        if (product) {
            //remove it 
            await product.deleteOne();
            res.json({ message: "Product Removed" })
        } else {
            res.status(404).json({ message: "Product Not Found" })
        }

    } catch (error) {
        console.error("deletion error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});
// @route DELETE /api/admin/products
// @desc Delete all products (admin only)
// @access Private (Admin)
router.delete("/", protect, admin, async (req, res) => {
    try {
        const result = await Product.deleteMany({});
        res.json({
            message: `🧹 ${result.deletedCount} products deleted successfully!`,
        });
    } catch (error) {
        console.error("Bulk deletion error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});


//@route GET /api/products
//@desc get all the products with optinal query filter
//@acess public

router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      material,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      brand,
      limit,
    } = req.query;

    let query = {};

    // ✅ Normalization mappings
    if (req.query.gender) {
      const genderMap = {
        male: "Men",
        men: "Men",
        female: "Women",
        women: "Women",
      };
      query.gender =
        genderMap[req.query.gender.toLowerCase()] || req.query.gender;
    }

    if (req.query.category) {
      const categoryMap = {
        "top class": "Top Wear",
        "bottom class": "Bottom Wear",
      };
      query.category =
        categoryMap[req.query.category.toLowerCase()] || req.query.category;
    }

    // Existing filter logic
    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collections = collection;
    }
    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category;
    }
    if (material) {
      query.material = { $in: material.split(",") };
    }
    if (brand) {
      query.brand = { $in: brand.split(",") };
    }
    if (size) {
      query.size = { $in: size.split(",") };
    }
    if (color) {
      query.colors = { $in: [color] };
    }
    if (gender && gender.toLowerCase() !== "all") {
      query.gender = gender;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
      query.description = { $regex: search, $options: "i" };
    }

    console.log("🧩 Final Query Object:", query);

    let productQuery = Product.find(query);

    // Sorting
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
        case "price_low_high":
          productQuery = productQuery.sort({ price: 1 });
          break;
        case "priceDesc":
        case "price_high_low":
          productQuery = productQuery.sort({ price: -1 });
          break;
        case "newest":
          productQuery = productQuery.sort({ createdAt: -1 });
          break;
        case "oldest":
          productQuery = productQuery.sort({ createdAt: 1 });
          break;
      }
    }

    if (limit) {
      productQuery = productQuery.limit(Number(limit));
    }

    const products = await productQuery;
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

//@route GET /api/product/best-seller
// @desc Retrieve the Product with the highest Rating
//@access public

router.get("/best-seller", async (req, res) => {
    try {
        const bestSeller = await Product.findOne().sort({ rating: -1 });
        if (bestSeller) {
            res.json(bestSeller)
        } else {
            res.status(404).json({ message: "No Best Seller Found" })
        }
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
})

//@route GET /api/products/new-Arrivals
//@desc Retrieve latest 8 products -creation date
// @access Public

router.get("/new-arrivals", async (req, res) => {
    //fetch latest products using created at dates
    try {
        const newArrival = await Product.find().sort({ createdAt: -1 }).limit(8);
        res.json(newArrival);
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
})

//@route GET /api/products/:id
//@desc get a single product by id
//@access public

router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ message: "Product not found" })
        }
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

//@route GET /api/product/similar/:id
//@desc retrieve similar products based on the current products gender and category
//@access public
router.get('/similar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" })

        const similarProducts = await Product.find({
            _id: { $ne: id }, //exclude the current product id
            gender: product.gender,
            category: product.category,
        }).limit(4);
        res.json(similarProducts);
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }

});



module.exports = router;