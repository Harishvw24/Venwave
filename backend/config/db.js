require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers((process.env.DNS_SERVERS || "1.1.1.1,8.8.8.8").split(","));

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;