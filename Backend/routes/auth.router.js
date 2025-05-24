import express from "express";
import dotenv from "dotenv";
import register from "../controller/register.controller.js";
import login from "../controller/login.controller.js";
import logout from "../controller/logout.controller.js";

dotenv.config();

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

export default router;