import express from "express";
import { createForm, getForms, getFormById, deleteForm, updateForm } from "../controllers/formController.js";

const router = express.Router();

router.post("/", createForm);
router.get("/", getForms);
router.get("/:id", getFormById);
router.delete("/:id", deleteForm);
router.put("/:formId", updateForm);

export default router;
