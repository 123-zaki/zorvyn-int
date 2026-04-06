import dotenv from "dotenv";
import User from "../models/user.model.js";
import { refreshAccessToken } from "../utils/refreshAcessToken.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

dotenv.config();

const isLoggedIn = async (req, res, next) => {
    try {
        const accessToken =
            req.cookies?.accessToken ||
            req.headers.authorization?.replace("Bearer ", "");

        if (accessToken) {
            const decoded = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET
            );

            const user = await User.findById(decoded._id);

            if (!user) {
                return res.status(401).json({
                    message: "Invalid token"
                });
            }

            req.user = user;
            return next();
        }

        // Try refresh token
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        try {
            const { newAccessToken, user } =
                await refreshAccessToken(refreshToken);

            req.user = user;
            // req.newAccessToken = newAccessToken;
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                maxAge: 15 * 60 * 1000, // 15 minutes
            });

            return next();
        } catch (err) {
            return res.status(401).json({
                message: "Invalid or expired refresh token"
            });
        }

    } catch (error) {
        console.error("Auth middleware error:", error.message);

        return res.status(401).json({
            message: "Authentication failed"
        });
    }
};

export { isLoggedIn };