import express from "express";

import {
    registerUser,
    loginUser,
  } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router.post('/register', validate(registerSchema),
registerUser);
router.post(
  "/login",
  validate(loginSchema),
  loginUser
);
router.get("/me", authMiddleware, (req, res) => {
    res.json({
      message: "Protected route accessed",
      user: req.user,
    });
  });
export default router;
