import express from "express";
import { Register } from "../controllers/authcontroller.js";
import { Login } from "../controllers/authcontroller.js";

const router = express.Router(); 

router.post("/register", Register);
router.post("/login", Login);

export default router;