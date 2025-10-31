
const express = require("express");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Checkout = require("../models/Checkout");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");


const router = express.Router();
//@route POST /api/checkout
//@desc Create a new CheckOUt Session
//@access Private

router.post("/", protect, async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;
    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: "No items to Checkout" })
    }
    try {
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid: false,
        }
        );
        console.log(`Checkout created for user:${req.user._id}`);
        res.status(201).json(newCheckout);


    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ message: "Server Error" })

    }
});


//@route PUT /api/checkout/:id/pay
//@desc Update checkout to mark as paid after successful payment
//@access private

router.put("/:id/pay", protect, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;

    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) return res.status(404).json({ message: "Checkout not Found" })
        if (paymentStatus === "paid") {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            await checkout.save();

            res.status(200).json(checkout);
        } else {
            res.status(400).json({
                message: "Invalid Payment Status"
            })
        }


    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ message: "Server Error" })

    }
})


//@route POST /api/checkout/:id/finalize
//@desc finalize checkout and convert to an order after payment congirmation 
//@access private

router.post("/:id/finalized", protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) return res.status(404).json({ message: "Checkout not Found" })

        if (checkout.isPaid && !checkout.isFinalized) {
            //cretae final order if true
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: checkout.paymentDetails
            });
            //finalized mark to avoid duplicate orders

            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now()
            await checkout.save();
            //delete once the order is finalized
            await Cart.findOneAndDelete({ user: checkout.user })
            res.status(201).json(finalOrder)
        } else if (checkout.isFinalized) {
            res.status(400).json({ message: "Checkout already Finalized" })
        } else {
            res.status(400).json({ message: "Checkout is Not PAID!" })
        }
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ message: "Server Error" })
    }
})

module.exports = router;