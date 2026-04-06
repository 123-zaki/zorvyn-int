import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
        index: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    name: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: false
    },
    verificationOtp: {
        type: String,
        match: [/^\d{4}$/, "Otp must be a 4-digit number"]
    },
    verificationOtpExpiry: {
        type: Date
    },
    refreshToken: {
        type: String,
        select: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordTokenExpiry: {
        type: Date
    },
    role: {
        type: String,
        enum: ["viewer", "analyst", "admin"],
        default: "viewer"
    }
}, {timestamps: true});

// pre hook (always run before saving to hash password)
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// to check whether passowrd is correct or not
userSchema.methods.isPasswordCorrect = async function(password) {
    const isCorrect = await bcrypt.compare(password, this.password);

    return isCorrect;
};

export default mongoose.model("User", userSchema);