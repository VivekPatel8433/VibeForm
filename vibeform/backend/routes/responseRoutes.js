import express from "express";
import { submitResponse } from "../controllers/responsecontroller.js";

const router = express.Router();

router.post("/:formId", submitResponse);

export default router;
