import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true,
    //     index: true,
    // },
    amount: {
        type: Number,
        required: true,
        min: [0, "Amount must be positive"]
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true,
        index: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    note: {
        type: String,
        trim: true,
        default: ""
    },
    isDeleted: {
        // this field is for soft delete
        type: Boolean,
        default: false,
        index: true
    },
    date: {
        // it is beacause we want to add past expense or income
        type: Date,
        required: true
    }
}, {timestamps: true});

// recordSchema.index({ userId: 1, dateOfRecord: -1 });
// recordSchema.index({ userId: 1, type: 1 });
// recordSchema.index({ userId: 1, isDeleted: 1 });

export default mongoose.model("Record", recordSchema);