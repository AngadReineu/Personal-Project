const express = require("express");
const Order = require("../models/Order");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

//@router GET /api/orders/my-order
// @desc get Logged-in user's Orders
//@access Private

router.get("/my-orders", protect,async(req,res)=>{
    try {
        //find order for authenticated user
        const orders = (await Order.find({user: req.user._id})).sort({
            createAt:-1,
        }); //sort by most recent order
        res.json(orders)
    } catch (error) {
        res.status(500).json({message:"Server Error"});
    }
});

//@route GET /api/order/:id
//@desc GET order details by ID
//@access Private

router.get("/:id", protect,async(req,res)=>{
    try{
        const order = await Order.findById(req.params.id).populate("user","name email");
        if(!order){
            return res.status(404).json({mesasge:"order not found"})
        }
        // return the full order details
        res.json(order)
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
});
module.exports = router;