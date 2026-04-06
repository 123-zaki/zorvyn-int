import mongoose from "mongoose";
import {connectDB} from "../db.connect.js";
import User from "../models/user.model.js";

async function seedAdmin(data) {
    try {
        await connectDB();

        const existingAdmin = await User.findOne({email: data.email});
        if(existingAdmin) {
            throw new Error("user with this email already exists!");
        }
        const newAdmin = await User.create(data);
        console.log("Admin seeded successfully: ", newAdmin);
        process.exit(0);
    } catch (error) {
        console.log("Something went wrong while seeding admin: ", error);
        process.exit(1);
    }
}

seedAdmin({
    email: 'firstadmin@mailinator.com',
    password: 'Qwe@123123',
    role: 'admin',
    isActive: true,
    name: 'First Admin'
});