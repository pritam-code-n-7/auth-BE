import express from "express";

import { authLimiter } from "../config/rateLimits.js"
import { userSignin, userSignup } from "../controllers/user.controller.js";

const router = express.Router();

router.post('/signup',authLimiter, userSignup)
router.post('/login',authLimiter, userSignin)


export default router;