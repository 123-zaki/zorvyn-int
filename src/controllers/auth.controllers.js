import mongoose from "mongoose";
import User from "../models/user.model.js";
import { forgotPasswordMailGenContent, sendEmail, verificationMailGenContent } from "../utils/mail.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const register = async (req, res) => {
    // step-1: take input data
    const { email, password, name } = req.body;

    try {
        // step-2: check if user with this email already exists in DB
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        // generate random 4 digit otp
        let verificationOtp = "";
        for (let i = 0; i < 4; i++) {
            verificationOtp += Math.floor(Math.random() * 10);
        }

        // step-3: if user not exist, create new one
        const newUser = await User.create({
            email,
            password,
            verificationOtp,
            name,
            verificationOtpExpiry: new Date(Date.now() + 15 * 60 * 1000),       // 15 minutes
        });

        if (!newUser) {
            return res.status(500).json({
                message: "Something went wrong, user creation failed"
            });
        }

        // send email for verification
        const verificationUrl = `${process.env.BASE_URL}/api/v1/auth/verify/${newUser._id}/${verificationOtp}`;

        const options = {
            email: newUser.email,
            subject: 'Verification Email',
            mailGenContent: verificationMailGenContent(newUser.name, verificationUrl)
        }

        await sendEmail(options);

        // send response with user and successful message
        return res.status(201).json({
            data: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            },
            message: "User registered successfully"
        });
    } catch (error) {
        console.log(`Something went wrong while registering user: ${error.message}`);
        return res.status(500).json({
            message: error.message || "Internal server error"
        });
    }
};

export const verify = async (req, res) => {
    const { otp, userId } = req.params;

    try {
        const user = await User.findById(new mongoose.Types.ObjectId(userId));
        if (!user) {
            return res.status(404).json({
                message: 'User not found!'
            });
        }

        if (user.isActive) {
            return res.status(400).json({
                message: "User already verified"
            });
        }

        if (!user.verificationOtp ||
            !user.verificationOtpExpiry || user.verificationOtp !== String(otp) || !(user.verificationOtpExpiry > Date.now())) {
            return res.status(400).json({
                message: 'Invalid or expired verification otp'
            });
        }

        user.isActive = true;
        user.verificationOtp = null;
        user.verificationOtpExpiry = null;

        await user.save();

        return res.status(200).json({
            verifiedUser: {
                name: user.name,
                email: user.email,
                role: user.role
            },
            message: 'User verified successfully'
        });
    } catch (error) {
        console.log("Error while verifying user: ", error.message);

        return res.status(error.status || 500).json({
            error: error.message || "Internal server error"
        });
    }
};

export const login = async (req, res) => {
    // step-1: Take input data from req.body
    const { email, password, role } = req.body;

    try {
        // step-2: Check for user existance
        const existingUser = await User.findOne({ email }).select('+password');
        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found!'
            });
        }

        // step-3: check for password correctness
        const ispasswordCorrect = await existingUser.isPasswordCorrect(password);
        if (!ispasswordCorrect) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // step-4: match role
        if (existingUser.role !== role) {
            return res.status(401).json({
                message: 'Invalid user role'
            });
        }

        // step-5: check if user is active
        if (existingUser.isActive === false) {
            return res.status(403).json({
                message: 'User is not verified'
            });
        }

        // if password is correct
        // ---> A. create refresh token and access token
        const refreshToken = jwt.sign(
            {
                _id: existingUser._id,
                email: existingUser.email,
                role: existingUser.role,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: '7d'
            }
        );

        const accessToken = jwt.sign(
            {
                _id: existingUser._id,
                email: existingUser.email,
                role: existingUser.role,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '15m'
            }
        );

        // ----> B. set refresh token in cookie
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        }

        existingUser.refreshToken = refreshToken;
        await existingUser.save();

        res.status(200).cookie('refreshToken', refreshToken, cookieOptions).cookie('accessToken', accessToken, cookieOptions).json({
            user: {
                email: existingUser.email,
                username: existingUser.name,
                role: existingUser.role,
            },
            message: 'User logged in successfully'
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.message || "Internal server error"
        });
    }
};

export const logout = async (req, res) => {

    try {
        const user = await User.findById(new mongoose.Types.ObjectId(req.user._id));
        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized access'
            });
        }

        // If user exist then clear cookies and refresh token in database
        await User.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    refreshToken: null,
                }
            },
            {
                new: true,
            }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        }

        return res.status(200).clearCookie('refreshToken', cookieOptions).clearCookie('accessToken', cookieOptions).json({
            message: 'User logged out successfully'
        });
    } catch (error) {
        console.error("Logout error:", error.message);
        return res.status(500).json({
            message: error.message || "Internal server error"
        });
    }
};

export const resetPassword = async (req, res) => {
    // step-1: Take token as input from params
    const { token } = req.params;
    // Password (new password) from body
    const { password } = req.body;

    try {
        // step-2: Find user based on reset password token
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({ resetPasswordToken: hashedToken }).select("+password");
        if (!user) {
            return res.status(404).json({
                message: 'User not found, invalid token'
            });
        }

        // step-3: check validity of token
        if (!(Date.now() < user.resetPasswordTokenExpiry)) {
            return res.status(400).json({
                message: 'Invalid or expired token'
            });
        }

        // step-4: if user exist (token is correct) then change password
        user.password = password;
        // step-5: clear resetPasswordToken and resetPasswordTokenExpiry in DB (invalidate session)
        user.resetPasswordToken = null;
        user.resetPasswordTokenExpiry = null;

        await user.save();

        return res.status(200).json({
            user: {
                email: user.email,
                name: user.name
            },
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.log(`Error while reseting password: ${error.message}`);
        return res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};

export const forgotPassword = async (req, res) => {
    // step-1: Take email as input from body
    const { email } = req.body;

    try {
        // step-2: Find user based on email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({
                message: 'If the email exists, a reset link has been sent'
            });
        }

        // step-3: If user exists then create a resetPasswordToken and save in DB (create session)
        const resetPasswordToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetPasswordToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordTokenExpiry = new Date(Date.now() + 10 * 60 * 1000)  // 10 minutes

        await user.save();

        //  step-4: Send an email with reset password link and token
        const resetPasswordUrl = `${process.env.BASE_URL}/api/v1/auth/reset-password/${resetPasswordToken}`
        const options = {
            email: user.email,
            subject: 'Reset Password',
            mailGenContent: forgotPasswordMailGenContent(user.name, resetPasswordUrl)
        };

        await sendEmail(options);

        return res.status(200).json({
            message: 'If the email exists, a reset link has been sent'
        });
    } catch (error) {
        console.log(`Error while forgot password request: ${error.message}`);
        return res.status(error.status || 500).json({
            error: error.message || "Internal server error"
        });
    }
};

export const changePassword = async (req, res) => {
    // step-1: Take old and passwords from body
    const { oldPassword, newPassword } = req.body;
    if (oldPassword === newPassword) {
        return res.status(400).json({
            message: "New password must be different from old password"
        });
    }

    try {
        // step-2: Find user based on jwt token user (attached through auth middleware - isLoggedIn)
        const user = await User.findById(new mongoose.Types.ObjectId(req.user._id)).select("+password");
        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized request!'
            });
        }

        // step-2: match old password
        const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);
        if (!isOldPasswordCorrect) {
            return res.status(401).json({
                message: 'Unauthorized - Old password is incorrect!'
            });
        }

        // step-3: if old password matches, then update password with new password in DB and also invalidate session
        user.password = newPassword;
        user.refreshToken = null;
        await user.save();

        return res.status(200).json({
            user: {
                email: user.email,
                name: user.name,
            },
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.log(`Error while changing password: ${error.message}`);
        return res.status(error.status || 500).json({
            error: error.message || "Internal server error"
        });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-verificationOtp");
        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized Access!'
            });
        }
        res.status(200).json({
            user: {
                email: user.email,
                name: user.name,
                role: user.role,
            },
            message: "Current user fetched successfully"
        });
    } catch (error) {
        console.log("Error while fetching current user: ", error.message);
        return res.status(error.status || 500).json({
            error: error.message || "Internal server error"
        });
    }
};