import express from "express";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { blockUser, unblockUser, updateUserRole } from "../controllers/admin.controllers.js";
import { allowRoles } from "../middlewares/role.middlewares.js";
import { validateBlockUser, validateUnblockUser, validateUpdateUserRole } from "../validators/admin.validators.js";
import { validate } from "../middlewares/validator.middlewares.js";

const router = express.Router();

router.patch("/block-user/:id", isLoggedIn, allowRoles('admin'), validateBlockUser(), validate, blockUser);
router.patch("/unblock-user/:id", isLoggedIn, allowRoles('admin'), validateUnblockUser(), validate, unblockUser);
router.patch("/update-user-role/:id", isLoggedIn, allowRoles('admin'), validateUpdateUserRole(), validate, updateUserRole);

export default router;