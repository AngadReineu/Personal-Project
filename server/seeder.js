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
        // // clear the prev data
        // await Product.deleteMany();
        // await User.deleteMany();
        // await Cart.deleteMany();
        //create a default admin user

        const createdUser = await User.create({
            name: "Admin User",
            email:"admin@example.com",
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
// const seedData = async () => {
//   try {
//     // check if admin already exists
//     const existingAdmin = await User.findOne({ email: "admin@example.com" });
//     if (existingAdmin) {
//       console.log("Admin already exists");
//       process.exit();
//     }

//     // create admin
//     const createdUser = await User.create({
//       name: "Admin User",
//       email: "admin@example.com",
//       password: "admin@123",
//       role: "admin",
//     });

//     console.log("✅ Admin user created:", createdUser.email);
//     process.exit();
//   } catch (error) {
//     console.error("❌ Seeding error:", error);
//     process.exit(1);
//   }
// };

// seedData();