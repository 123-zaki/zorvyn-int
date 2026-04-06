import { body, query, param } from "express-validator";

export const validateCreateRecord = () => {
    return [
        body('amount')
            .notEmpty().withMessage("Amount is required!")
            .isNumeric().withMessage("Amount must be a number")
            .custom(value => value > 0).withMessage("Amount must be greater than 0"),

        body('type')
            .notEmpty().withMessage("Type is required!")
            .isIn(['income', 'expense']).withMessage("Type must be income or expense"),

        body('category')
            .notEmpty().withMessage("Category is required!")
            .isString().withMessage("Category must be a string")
            .trim()
            .notEmpty().withMessage("Category cannot be empty"),

        body('note')
            .optional()
            .isString().withMessage("Note must be a string"),

        body('date')
            .optional()
            .isISO8601().withMessage("Date must be valid"),
    ];
};

export const validateGetRecords = () => {
    return [
        query('type')
            .notEmpty().withMessage("Type is required!")
            .isIn(['income', 'expense', 'all']).withMessage("Invalid type"),

        query('category')
            .optional()
            .isString().withMessage("Category must be a string"),

        query('limit')
            .optional()
            .isInt({ min: 1 }).withMessage("Limit must be a positive integer"),

        query('page')
            .optional()
            .isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    ];
};

export const validateUpdateRecord = () => {
    return [
        param('id')
            .notEmpty().withMessage("Record id is required!")
            .isMongoId().withMessage("Invalid record id"),

        body('amount')
            .optional()
            .isNumeric().withMessage("Amount must be a number")
            .custom(value => value > 0).withMessage("Amount must be greater than 0"),

        body('type')
            .optional()
            .isIn(['income', 'expense']).withMessage("Invalid type"),

        body('category')
            .optional()
            .isString().withMessage("Category must be a string")
            .trim()
            .notEmpty().withMessage("Category cannot be empty"),

        body('note')
            .optional()
            .isString().withMessage("Note must be a string"),

        body('date')
            .optional()
            .isISO8601().withMessage("Date must be valid"),
    ];
};

export const validateDeleteRecord = () => {
    return [
        param('id')
            .notEmpty().withMessage("Record id is required!")
            .isMongoId().withMessage("Invalid record id"),
    ];
};