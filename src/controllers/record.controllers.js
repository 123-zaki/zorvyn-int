import mongoose from "mongoose";
import Record from "../models/record.model.js";

export const createRecord = async (req, res) => {
    // const user = req.user;
    
    const { amount, type, category, note, date } = req.body;
    if ([amount, type, category].some(item => item === undefined)) {
        return res.status(400).json({ message: "Amount, type and category are required!" });
    }

    const parsedAmount = Number(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
    }

    if (date && isNaN(new Date(date))) {
        return res.status(400).json({
            message: "Invalid date"
        });
    }

    if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ message: "Invalid type" });
    }

    if (typeof category !== 'string' || category.trim() === '') {
        return res.status(400).json({ message: "Invalid or empty category" });
    }

    try {
        const record = await Record.create({
            amount: parsedAmount,
            category,
            date: date ? new Date(date) : new Date(),
            note: note || "",
            type,
        });

        return res.status(201).json({
            record,
            message: 'Record created successfully'
        });
    } catch (error) {
        console.log(`Error while creating record: ${error}`);
        return res.status(error.status || 500).json({ message: error.message || "Internal server errror" });
    }
};

export const getRecords = async (req, res) => {
    const { type, category, limit = 15, page = 1 } = req.query;

    if (!type || !['income', 'expense', 'all'].includes(type)) {
        return res.status(400).json({ message: `Invalid or empty type, type can only be from ['income', 'expense', 'all']` });
    }

    try {
        const query = {
            type: type === 'all' ? { $in: ['income', 'expense'] } : type,
            isDeleted: false
        };
        if (category) {
            query.category = new RegExp(`^${category.trim()}$`, "i");
        }

        const records = await Record.find(query).skip((+(page) - 1) * (+limit)).limit(+limit).sort({ date: -1 });

        const recordsCount = await Record.countDocuments(query);

        if (!records.length) {
            return res.status(200).json({
                records: [],
                message: "No record found!"
            });
        }

        return res.status(200).json({
            records,
            pagination: {
                totalPage: Math.ceil(recordsCount / (+limit)),
                total: recordsCount,
                limit: +(limit),
                page: +(page)
            },
            message: "Records fetched successfully"
        });
    } catch (error) {
        console.log(`Error while getching records: ${error}`);
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const updateRecord = async (req, res) => {
    const { id } = req.params;
    const { amount, type, category, note, date } = req.body;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid id' });
    }

    if (amount) {
        const parsedAmount = Number(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }
    }

    if (date && isNaN(new Date(date))) {
        return res.status(400).json({
            message: "Invalid date"
        });
    }

    if (type && !['income', 'expense'].includes(type)) {
        return res.status(400).json({ message: "Invalid type" });
    }

    if (category && (typeof category !== 'string' || category.trim() === '')) {
        return res.status(400).json({ message: "Invalid or empty category" });
    }

    try {
        const updationData = {};
        if (type) updationData.type = type;
        if (amount !== undefined) updationData.amount = +amount;
        if (category !== undefined) updationData.category = category;
        if (note !== undefined) updationData.note = note;
        if (date) updationData.date = new Date(date);


        const updatedRecord = await Record.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id), isDeleted: false }, updationData, { new: true });

        if (!updatedRecord) {
            return res.status(404).json({
                message: "Record not found"
            });
        }

        return res.status(200).json({
            updatedRecord,
            message: "Record updated successfully"
        });

    } catch (error) {
        console.log("Error while updating record: ", error);
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

// soft delete
export const deleteRecord = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: "Invalid id"
        });
    }

    try {
        const deletedRecord = await Record.findOneAndUpdate({
            _id: new mongoose.Types.ObjectId(id),
            isDeleted: false
        }, { $set: { isDeleted: true } }, { new: true });

        if (!deletedRecord) {
            return res.status(404).json({
                message: "Record not found!"
            });
        }

        return res.status(200).json({
            deletedRecord,
            message: "Record soft deleted successfully"
        });
    } catch (error) {
        console.log(`Error while deleting record: ${error}`);
        return res.status(error.status || 500).json({
            message: error.message || "Internal server error"
        });
    }
};