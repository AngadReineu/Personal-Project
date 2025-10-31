const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");


//@route POST /api/subscriber
//@desc handle newsletter Subscription
//@access public

router.post("/subscribe",async(req,res)=>{
    const{email} = req.body;

    if(!email) return res.status(400).json({message:"Email is Required"});

    try {
        // check if the emal is already subscribed

        let subscriber = await Subscriber.findOne({email})

        if(subscriber){
            return res.status(400).json({message: "email is already subscribed"})
        }

        // create a new sub

        subscriber = await new Subscriber({email});
        await subscriber.save();
        res.status(201).json({message:"Successfully Subscribed to the newsletter!"})
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"})
        
        
    }
});

module.exports = router;
