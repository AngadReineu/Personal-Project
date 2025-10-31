const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {protect} = require("../middleware/authMiddleware")


const router = express.Router();

//@route POST /api/users/register
// @desc Register a new user
//@access public

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        //registration logic
        let user = await User.findOne({ email }) //if the user already exist
        if (user) return res.status(400).json({ message: "User Already Exist with this Email" })

        //if user does not exist then 
        user = new User({ name, email, password });
        await user.save();

        //creating JWT Token payload(info about the user)
        const payload = { user: { id: user._id, role: user.role } };

        // sign and return the token along withthe user data

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;

            // send the user and token in response

            res.status(201).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            })
        })

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });

    }
});

//@route for login POST /appi/users/login
//@desc authenticate user
// @accress Public

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        //Find the user by email
        let user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Invalid Credentails" });
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentails" })

        //creating JWT Token payload(info about the user)
        const payload = { user: { id: user._id, role: user.role } };

        // sign and return the token along withthe user data

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;

            // send the user and token in response

            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            })
        })

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
})


// route for USer profile
//@route GET /api/users/profile
//@desc Get logged in user profiles (Protexted Route)
// @access Private

router.get("/profile", protect, async(req,res)=>{
    res.json(req.user);
});

module.exports = router;