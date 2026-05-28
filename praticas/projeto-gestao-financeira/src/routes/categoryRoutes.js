// src/routes/categoryRoutes.js
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { createCategorySchema, updateCategorySchema } from "../schemas/categorySchema.js";

const router = Router();

// Rota para buscar todas as categorias
router.get("/", async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    return res.json(categories);
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
    return res.status(201).json(category);
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
    return res.json(category);
  } catch (error) {
    next(error);
  }
});

// Excluir categoria 
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    // 1. Busca a categoria no banco para verificar se ela existe
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    // 2. Bloqueia a exclusão das categorias padrão do sistema
    // Adicionamos os nomes prováveis em inglês e português para cobrir como o seed foi feito
    const defaultCategories = ["income", "expense", "alimentacao", "salario", "lazer", "saude", "transporte"];
    
    if (
      defaultCategories.includes(category.name?.toLowerCase()) || 
      category.isDefault === true // Caso seu schema possua uma propriedade booleana de controle
    ) { 
      return res.status(400).json({ error: "Categorias padrão não podem ser excluídas" });
    }

    await prisma.category.delete({ where: { id } });
    return res.status(204).send(); // Resposta 204 No Content conforme exigido
  } catch (error) {
    next(error);
  }
});

export default router;