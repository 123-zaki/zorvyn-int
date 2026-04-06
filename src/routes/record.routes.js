import express from "express";
import {isLoggedIn} from "../middlewares/auth.middlewares.js";
import { createRecord, deleteRecord, getRecords, updateRecord } from "../controllers/record.controllers.js";
import { allowRoles } from "../middlewares/role.middlewares.js";
import { validateCreateRecord, validateDeleteRecord, validateGetRecords, validateUpdateRecord } from "../validators/record.validators.js";
import {validate} from "../middlewares/validator.middlewares.js";

const router = express.Router();

router.post("/create", isLoggedIn, allowRoles('admin'), validateCreateRecord(), validate, createRecord);

router.get("/get-records", isLoggedIn, allowRoles('admin', 'analyst'), validateGetRecords(), validate, getRecords);

router.put("/update/:id", isLoggedIn, allowRoles('admin'), validateUpdateRecord(), validate, updateRecord);

router.delete("/delete/:id", isLoggedIn, allowRoles('admin'), validateDeleteRecord(), validate, deleteRecord);

export default router;