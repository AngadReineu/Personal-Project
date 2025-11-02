const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const connectDatabase = require('./config/database');
const userRoutes = require("./routes/UserRoutes")
const productRoute = require("./routes/ProductRoutes")
const cartRoute = require("./routes/CartRoutes")
const checkoutRoute = require("./routes/CheckoutRoute")
const orderRoute = require("./routes/OrderRoute")
const uploadRoute = require("./routes/uploadRoutes")
const subscriberRoute = require("./routes/subscriberRoute")
const AdminRoute = require("./routes/AdminRoute")
const productAdminRoute = require("./routes/ProductAdminRouter")
const AdminOrderRouter = require("./routes/AdminOrderRouter")
const AdminUpload = require("./routes/AdminUpload")
const razorpayRoutes = require("./routes/RazorPayRouter")

const app = express();
// 🧩 Use these BEFORE routes:
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json()) // our server is apble to work with the json data

app.use(cors()); // to communication with frontend port

dotenv.config();
//connecting to mongoDb
connectDatabase()

const PORT = process.env.PORT || 3000;

app.get("/", (req,res)=>{
    res.send("WELCOME TO THE WEBSITE API!")
})


// api routes starts here

app.use("/api/users", userRoutes)
app.use("/api/products", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/checkout", checkoutRoute)
app.use("/api/orders", orderRoute)
app.use("/api", subscriberRoute)
app.use("/api/razorpay", razorpayRoutes)


// api for admin routes

app.use("/api/admin/user", AdminRoute)
app.use("/api/admin/products", productAdminRoute)
app.use("/api/admin/orders", AdminOrderRouter)
app.use("/api/upload", uploadRoute)

app.use("/api/admin/products/upload", AdminUpload)

app.listen(PORT, ()=>{
    console.log(`Server is Running on https://localhost:${PORT}`);
    
})