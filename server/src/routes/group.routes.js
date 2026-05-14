import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
  createGroupSchema,
} from "../validators/group.validator.js";

import {
  createExpenseSchema,
} from "../validators/expense.validator.js";
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

router.post(
  "/",
  authMiddleware,
  validate(createGroupSchema),
  createGroup
);

router.get("/:id", authMiddleware, getGroup);

router.post("/:id/members", authMiddleware, addMember);

router.post(
  "/:id/expenses",
  authMiddleware,
  validate(createExpenseSchema),
  addExpense
);

router.get("/:id/expenses", authMiddleware, getExpenses);

router.get("/:id/balances", authMiddleware, getBalances);

router.delete("/expenses/:id", authMiddleware, deleteExpense);

export default router;