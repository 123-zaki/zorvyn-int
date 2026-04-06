import Record from "../models/record.model.js";

export const getSummary = async (req, res) => {
    try {
        const summary = await Record.aggregate([
            {
                $match: {
                    isDeleted: false,
                }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
                        }
                    },
                    totalExpense: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
                        }
                    }
                }
            },
            {
                $addFields: {
                    balance: {
                        $subtract: ["$totalIncome", "$totalExpense"]
                    }
                }
            },
            {
                $sort: {
                    totalExpense: -1
                }
            },
            {
                $project: {
                    totalExpense: 1,
                    totalIncome: 1,
                    balance: 1,
                    _id: 0
                }
            }
        ]);

        return res.status(200).json({
            summary: summary[0] || {
                totalExpense: 0, totalIncome: 0, balance: 0
            },
            message: "Dashboard summary fetched successfully"
        });
    } catch (error) {
        console.log("Error while fetching dashboard summary: ", error);
        return res.status(error.status || 500).json({
            message: error.message || "Internal server error"
        });
    }
};

export const getTotalOfCategory = async (req, res) => {
    try {
        const result = await Record.aggregate([
            {
                $match: {
                    isDeleted: false,
                }
            },
            {
                $group: {
                    _id: "$category",
                    totalExpense: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
                        }
                    },
                    totalIncome: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
                        }
                    }
                }
            },
            {
                $addFields: {
                    balance: {
                        $subtract: ["$totalIncome", "$totalExpense"]
                    }
                }
            },
            {
                $sort: { totalExpense: -1 }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    totalExpense: 1,
                    totalIncome: 1,
                    balance: 1
                }
            }
        ]);

        return res.status(200).json({
            data: result || [],
            message: "Total according to category fetched successfully"
        });
    } catch (error) {
        console.log("Error while fetching total according to category: ", error);
        return res.status(error.status || 500).json({
            message: error.message || "Internal server error"
        });
    }
};

export const getMonthlyTrends = async (req, res) => {
    try {
        const monthlyTrends = await Record.aggregate([
            {
                $match: {
                    isDeleted: false,
                }
            },
            {
                $group: {
                    _id: {
                        $month: "$date"
                    },
                    totalExpense: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
                        }
                    },
                    totalIncome: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
                        }
                    }
                }
            },
            {
                $sort: {month: 1}
            },
            {
                $project: {
                    month: "$_id",
                    _id: 0,
                    balance: {
                        $subtract: ["$totalIncome", "$totalExpense"]
                    },
                    totalExpense: 1,
                    totalIncome: 1
                }
            }
        ]);

        return res.status(200).json({
            monthlyTrends: monthlyTrends || [],
            message: "Monthly trends fetched successfully"
        });
    } catch (error) {
        console.log("Error while fetching monthly trends: ", error);
        return res.status(error.status || 500).json({
            message: error.message || "Internal server error"
        });
    }
};