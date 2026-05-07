// src/routes/categoryRoutes.js
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { createCategorySchema } from "../schemas/categorySchema.js";

const router = Router();

// Rota para buscar todas as categorias
router.get("/", async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// Rota para criar uma nova categoria
router.post("/", async (req, res, next) => {
  try {
    // O Zod valida os dados antes de salvar no banco
    const data = createCategorySchema.parse(req.body);
    const category = await prisma.category.create({ data });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

export default router;