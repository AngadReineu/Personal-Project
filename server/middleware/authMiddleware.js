const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Check if the token exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract the token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user from the token payload (excluding password)
      req.user = await User.findById(decoded.user.id).select("-password");



      // Continue to the next middleware or route
      next();
    } catch (error) {
      console.error("Auth error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// middleware to check if the user is admin 

const admin = (req,res,next)=>{
  if(req.user && req.user.role === "admin"){
    next();
  } else{
    res.status(403).json({message: "Not Authorized as an ADMIN"})
  }
};


module.exports = {protect,admin};
