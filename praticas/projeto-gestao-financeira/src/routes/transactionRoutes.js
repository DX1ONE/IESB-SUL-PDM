// src/routes/transactionRoutes.js
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { createTransactionSchema } from "../schemas/transactionSchema.js";

const router = Router();

// Rota para buscar as transações (trazendo a categoria junto)
router.get("/", async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { category: true },
      orderBy: { date: "desc" }
    });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

// Rota para criar uma nova transação
router.post("/", async (req, res, next) => {
  try {
    const data = createTransactionSchema.parse(req.body);
    const transaction = await prisma.transaction.create({ data });
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
});

export default router;