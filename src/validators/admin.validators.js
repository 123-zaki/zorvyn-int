import { param, body } from "express-validator";

export const validateBlockUser = () => {
    return [
        param('id')
            .notEmpty().withMessage("User id is required!")
            .isMongoId().withMessage("Invalid user id"),
    ];
};

export const validateUnblockUser = () => {
    return [
        param('id')
            .notEmpty().withMessage("User id is required!")
            .isMongoId().withMessage("Invalid user id"),
    ];
};

export const validateUpdateUserRole = () => {
    return [
        param('id')
            .notEmpty().withMessage("User id is required!")
            .isMongoId().withMessage("Invalid user id"),

        body('role')
            .notEmpty().withMessage("Role is required!")
            .isString().withMessage("Role must be a string")
            .isIn(["viewer", "analyst", "admin"])
            .withMessage("Invalid role"),
    ];
};