
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

router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    console.log("🧾 Finalizing checkout:", checkout._id);

    // If payment info is sent from frontend but DB not yet updated, mark paid
    if (!checkout.isPaid && req.body.paymentDetails) {
      checkout.isPaid = true;
      checkout.paidAt = new Date();
      checkout.paymentDetails = req.body.paymentDetails;
      await checkout.save();
      console.log("✅ Payment marked as paid in checkout");
    }

    // Proceed to finalize only if paid
    if (checkout.isPaid && !checkout.isFinalized) {
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems || [],
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod || "Razorpay",
        totalPrice: checkout.totalPrice || 0,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails || {},
      });

      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();

      // Clear user cart
      await Cart.findOneAndDelete({ user: checkout.user });

      console.log("🎉 Final order created successfully");
      return res.status(201).json({
        message: "Order finalized successfully",
        finalOrder,
      });
    } 
    else if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout already finalized" });
    } 
    else {
      return res.status(400).json({ message: "Checkout is not paid yet!" });
    }

  } catch (error) {
    console.error("❌ Error finalizing checkout:", error);
    res.status(500).json({
      message: "Server error while finalizing checkout",
      error: error.message,
    });
  }
});

module.exports = router;