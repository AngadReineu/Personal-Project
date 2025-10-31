const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const products = require("./data/products");


dotenv.config();

mongoose.connect(process.env.MONGO_URI);

// function to seed data

const seedData = async ()=>{
    try {
        // clear the prev data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();
        //create a default admin user

        const createdUser = await User.create({
            name: "Admin User",
            email:"admin@exmaple.com",
            password: "admin@123",
            role: "admin",
        });


        // Assign default user id to each products
        const userID = createdUser._id;
        const sampleProducts= products.map((product)=>{
            return {...product,user: userID};
        });

        // insert the products in th db

        await Product.insertMany(sampleProducts)
        console.log("product seeded successfully");
        process.exit();
        
    } catch (error) {
        console.error("seeding error:", error);
        process.exit(1);
    
        
    };

};

seedData()