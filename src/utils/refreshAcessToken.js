import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const refreshAccessToken = async (jwtToken) => {
    try {
        // step-1: decode jwtToken (refresh token)
        const decodedData = jwt.verify(jwtToken, process.env.REFRESH_TOKEN_SECRET);

        // step-2: find user based on the decoded data (user's _id => decodedData._id)
        const user = await User.findById(new mongoose.Types.ObjectId(decodedData._id)).select("+refreshToken");

        if(!user || user.refreshToken !== jwtToken) {
            throw new Error("Invalid or expired refresh token");
        }

        // step-3: generate new access token and return it
        const newAccessToken = jwt.sign({
            email: user.email,
            _id: user._id
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});

        return {newAccessToken, user};
    } catch (error) {
        console.log("Error in refreshAccessToken: ", error.message);
        
        throw new Error(error);
    }
};