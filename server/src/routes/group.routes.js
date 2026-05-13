import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
  createGroup,
  getGroup,
  addMember,
  addExpense,
  getExpenses,
  deleteExpense,
  getBalances,
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createGroup);

router.get("/:id", authMiddleware, getGroup);

router.post("/:id/members", authMiddleware, addMember);

router.post("/:id/expenses", authMiddleware, addExpense);

router.get("/:id/expenses", authMiddleware, getExpenses);

router.get("/:id/balances", authMiddleware, getBalances);

router.delete("/expenses/:id", authMiddleware, deleteExpense);

export default router;