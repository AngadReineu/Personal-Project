const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { protect } = require("../middleware/authMiddleware")
const dotenv = require("dotenv");


const router = express.Router();

dotenv.config();

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
//@route /forgot-password POST
//@desc forgot pass route for customers 
//@access public 
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log("Forgot password request received for:", email); 

  try {
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });

    if (!user) {
      console.log("User not found for email:", email);
      return res.json({ message: "If this email is registered, a reset link has been sent." });
    }

    console.log("✅ User found:", user.email);

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();
    console.log("✅ Token saved to DB");

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    console.log("✅ Reset URL:", resetUrl);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = {
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset.</p>
        <p>Click below to reset your password:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>This link is valid for 15 minutes.</p>
      `,
    };

    console.log("📧 Sending reset email to:", user.email);
    await transporter.sendMail(message);
    console.log("✅ Email sent to:", user.email);

    res.json({ message: "Reset email sent successfully" });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route for login POST /appi/users/login
//@desc authenticate user
// @accress Public

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        //Find the user by email
        let user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });


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
});
// @route PUT /api/users/reset-password/:token
// @desc Reset password
// @access Public
router.put("/reset-password/:token", async (req, res) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });


        if (!user) {
            return res.json({ message: "If this email is registered, a reset link has been sent." });
        }

        user.password = req.body.password;
        user.markModified("password");
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// route for USer profile
//@route GET /api/users/profile
//@desc Get logged in user profiles (Protexted Route)
// @access Private

router.get("/profile", protect, async (req, res) => {
    res.json(req.user);
});

module.exports = router;