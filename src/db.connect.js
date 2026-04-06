import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

const connectDB = async () => {
    try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
        const dbUrl = process.env.DB_URI;
        await mongoose.connect(dbUrl);
        console.log("DB connected successfully");
    } catch (error) {
        console.log(`Error while connecting DB: ${error}`);
        process.exit(1);           // end the process
    }
};

export {connectDB};