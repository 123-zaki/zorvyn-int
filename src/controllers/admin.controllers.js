import mongoose from "mongoose";
import User from "../models/user.model.js";

export const blockUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid id" });
    }

    try {
        if (req.user._id.toString() === id) {
            return res.status(400).json({
                message: "You cannot block yourself"
            });
        }

        const user = await User.findById(new mongoose.Types.ObjectId(id));
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }


        if (user.role === 'admin') {
            return res.status(403).json({
                message: "You cannot block other admin"
            });
        }

        if (!user.isActive) {
            return res.status(409).json({ message: "User already blocked" });
        }

        user.isActive = false;
        await user.save();

        return res.status(200).json({
            data: {
                email: user.email,
                name: user.name
            },
            message: "User blocked successfully"
        });
    } catch (error) {
        console.log(`Error while blocking user: ${error}`);
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
}

export const unblockUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid id" });
    }

    try {

        if (req.user._id.toString() === id) {
            return res.status(400).json({
                message: "You cannot unblock yourself"
            });
        }

        const user = await User.findById(new mongoose.Types.ObjectId(id));
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        if (user.role === 'admin') {
            return res.status(403).json({
                message: "You cannot unblock other admin"
            });
        }

        if (user.isActive) {
            return res.status(409).json({ message: "User is already active" });
        }

        user.isActive = true;
        await user.save();

        return res.status(200).json({
            data: {
                email: user.email,
                name: user.name
            },
            message: "User unblocked successfully"
        });
    } catch (error) {
        console.log(`Error while unblocking user: ${error}`);
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const updateUserRole = async (req, res) => {
    const { role } = req.body;
    const { id } = req.params;

    if (!role) {
        return res.status(400).json({ message: 'Role is required' });
    }

    if (!['viewer', 'analyst', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid user role' });
    }

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid id' });
    }

    try {
        if (req.user._id.toString() === id.toString()) {
            return res.status(403).json({ message: 'You can not update your own role' });
        }
        const user = await User.findById(new mongoose.Types.ObjectId(id));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'You can not update role of another admin' });
        }

        if (user.role === role) {
            return res.status(409).json({
                message: "User already has this role"
            });
        }

        user.role = role;
        await user.save();

        return res.status(200).json({
            data: {
                id: user._id,
                role: user.role
            },
            message: 'User role updated successfully'
        });
    } catch (error) {
        console.log(`Error while updating user's role: ${error}`);
        return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
};