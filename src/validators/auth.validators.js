import { body, param } from "express-validator";

export const validateRegister = () => {
    return [
        body('email')
            .trim()
            .isEmail().withMessage("Enter a valid email!"),
        body('password')
            .notEmpty().withMessage("Password is required!")
            .isString().withMessage("Password must be a string")
            .isStrongPassword().withMessage("Please enter a strong password!"),
        body('name')
            .trim()
            .notEmpty().withMessage("Name is required!")
            .isString().withMessage("name must be a string!")
            .isLength({ min: 3 }).withMessage("Name must be at least 3 characters long")
            .isLength({ max: 20 }).withMessage("Name must be at most 20 characters long"),
        // body('role')
        //     .trim()
        //     .notEmpty().withMessage("Role is required!")
        //     .isIn(["viewer", "analyst", "admin"]).withMessage("Invalid role")
        //     .isString().withMessage("Role must be a string")
    ]
};

export const validateLogin = () => {
    return [
        body('email')
            .trim()
            .notEmpty().withMessage("Email is required!")
            .isEmail().withMessage("Enter a valid email"),
        body('password')
            .notEmpty().withMessage("Password is required")
            .isString().withMessage("Password must be a string"),
        body('role')
            .trim()
            .notEmpty().withMessage("Role is required!")
            .isString().withMessage("Role must be a string")
            .isIn(["viewer", "analyst", "admin"]).withMessage("Invalid role")
    ]
};

export const validateChangePassword = () => {
    return [
        // body('email')
        //     .trim()
        //     .isEmail().withMessage("Email is not valid!"),
        body('oldPassword')
            .notEmpty().withMessage("Old password is required!")
            .isString().withMessage("Password must be a string"),
        body('newPassword')
            .notEmpty().withMessage("New password is required!")
            .isString().withMessage("Password must be a string")
            .isStrongPassword().withMessage("New password is not strong!")
    ];
};

export const validateResetPassword = () => {
    return [
        param('token')
            .notEmpty().withMessage("Token is required!")
            .isString().withMessage("Token must a crypto randombytes string"),
        body('password')
            .notEmpty().withMessage("Password is required!")
            .isString().withMessage("Password must be a string")
            .isStrongPassword().withMessage("Enter a strong password")
    ];
};

export const validateForgotPassword = () => {
    return [
        body('email')
            .trim()
            .notEmpty().withMessage("Email is required!")
            .isEmail().withMessage("Enter a valid email"),
    ];
};

export const verifyValidator = () => {
    return [
        param('userId')
            .trim()
            .notEmpty().withMessage("User id is required!")
            .isMongoId().withMessage("User id is not valid"),
        param('otp')
            .notEmpty().withMessage("Otp is required!")
            .isString().withMessage("Otp must be a string")
            .isLength({min: 4, max: 4}).withMessage("Otp must be of exactly 4 digit")
    ];
};