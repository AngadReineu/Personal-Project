const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");
const { route } = require("./ProductRoutes");


const router = express.Router();

// this is the helper function to get a cart by user id or guest Id
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });

    } else if (guestId) {
        return await Cart.findOne({ guestId })
    }
    return null;
};


//@route PPOST/api/cart
// @desc Add a product to the cart for a guest  or User logged in
//@access public

router.post("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "No Product Found" });

        // determin the user is logged in or guest

        let cart = await getCart(userId, guestId);

        // if the cart exist, update it .
        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) => p.productId.toString() === productId &&
                    p.size === size &&
                    p.color === color
            );

            if (productIndex > -1) {
                //this means that product already exists, update the quantity
                cart.products[productIndex].quantity += quantity;

            } else {
                //add new product
                cart.products.push({
                    productId,
                    name: product.name,
                    images: product.images[0],
                    price: product.price,
                    size,
                    color,
                    quantity,
                });
            }

            // recalculate the total price

            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);


        } else {
            //create a new cart or the guest or user
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [{
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity
                },],
                totalPrice: product.price * quantity
            });
            return res.status(201).json(newCart)
        }


    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

//@route PUT /api/cart
//@desc Update product quantity in the cart for a guest or logged in user
//@access public

router.put("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        // 1️⃣ Get the user's or guest's cart
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "No Cart Found" });

        // 2️⃣ Find the product in the cart
        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            // 3️⃣ Update or remove the product
            if (quantity > 0) {
                cart.products[productIndex].quantity = Number(quantity);
            } else {
                // remove the product if quantity is 0
                cart.products.splice(productIndex, 1);
            }

            // 4️⃣ FIXED: use `cart.products` not `cart.product`
            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            // 5️⃣ Save updated cart
            await cart.save();

            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.error("Update cart error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

//@route DELETE /api/cart
// @desc Remove a product from the cart
// @access Public

router.delete("/", async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;

    try {
        // 1️⃣ Find the cart for the user or guest
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "No Cart Found" });

        // 2️⃣ Find the index of the product to delete
        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        // 3️⃣ If product exists, remove it
        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);

            // 4️⃣ Recalculate total price
            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            // 5️⃣ Save and return updated cart
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res
                .status(404)
                .json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.error("Delete cart error:", error);
        res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
});

//@route GET  /api/cart
//@desc Get logged-in users or guest users cart
//@access public
router.get("/", async (req, res) => {
    const { userId, guestId } = req.query;

    try {

        const cart = await getCart(userId, guestId);

        if (!cart) {
            return res.status(404).json({ message: "No Cart Found" });
        }

        return res.status(200).json(cart);
    } catch (error) {
        console.error("Get cart error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

//Aroute POST /api/cart
// @desc Merge guest cart into user cart on login
// @access private

router.post("/merge", protect, async (req, res) => {
    const { guestId } = req.body;

    try {
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: req.user._id });

        if (!guestCart) {
            if (guestCart && guestCart.products.length === 0) {
                return res.status(400).json({ message: "Guest cart Empty" });
            }
        }

        if (!userCart) {
            guestCart.user = req.user._id;
            guestCart.guestId = undefined;
            await guestCart.save();
            return res.status(200).json({
                message: "Guest cart merged into new user cart",
                cart: guestCart,
            });
        } else if (userCart) {
            // Merge guest cart products into user cart
            guestCart.products.forEach((guestItem) => {
                const productIndex = userCart.products.findIndex(
                    (p) =>
                        p.productId.toString() === guestItem.productId.toString() &&
                        p.size === guestItem.size &&
                        p.color === guestItem.color
                );

                if (productIndex > -1) {
                    // If item exists, add quantities
                    userCart.products[productIndex].quantity += guestItem.quantity;
                } else {
                    // Otherwise, add new product
                    userCart.products.push(guestItem);
                }
            });

            // Recalculate total price
            userCart.totalPrice = userCart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            // Save updated cart
            await userCart.save();

            // Remove guest cart safely after merging
            try {
                await Cart.findOneAndDelete({ guestId });
            } catch (error) {
                console.error("Error deleting guest cart:", error);
            }

            return res.status(200).json({
                message: "Guest cart merged successfully",
                cart: userCart,
            });
        } else {
            // fallback if neither cart found
            if (userCart) {
                return res.status(200).json(userCart);
            }
            return res.status(404).json({ message: "Guest cart not Found" });
        }
    } catch (error) {
        console.error("Merge cart error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});







module.exports = router