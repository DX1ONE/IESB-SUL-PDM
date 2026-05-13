// src/routes/categoryRoutes.js
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { createCategorySchema, updateCategorySchema } from "../schemas/categorySchema.js";

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

// Atualizar categoria 
router.put("/:id", async (req, res, next) => {
  try {
    const data = updateCategorySchema.parse(req.body);
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data,
    });
    res.json(category);
  } catch (error) {
    next(error);
  }
});

// Excluir categoria 
router.delete("/:id", async (req, res, next) => {
  try {
    // Busca a categoria primeiro para ver se é padrão
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
    });

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    
    if (category.isDefault) {
      return res.status(400).json({ error: "Categorias padrão não podem ser excluídas" });
    }

    await prisma.category.delete({
      where: { id: req.params.id },
    });
    
    res.status(204).send(); // 204 No Content
  } catch (error) {
    next(error);
  }
});

export default router;