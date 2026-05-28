import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { createTransactionSchema } from "../schemas/transactionSchema.js";

const router = Router();

// 1. Rota para buscar as transações (trazendo a categoria junto)
router.get("/", async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { category: true },
      orderBy: { date: "desc" }
    });
    return res.json(transactions);
  } catch (error) {
    next(error);
  }
});

// 2. Rota para criar uma nova transação
router.post("/", async (req, res, next) => {
  try {
    // Aqui o Zod valida os dados com base no arquivo transactionSchema.js
    const data = createTransactionSchema.parse(req.body);
    const transaction = await prisma.transaction.create({ data });
    return res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
});

// 3. Excluir transação 
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.transaction.delete({
      where: { id: id },
    });
    return res.status(204).send(); 
  } catch (error) {
    next(error);
  }
});

// 4. Rota de Edição (PUT) com chaves devidamente isoladas e validadas por Zod
// 🚀 ROTA DE EDIÇÃO (PUT) ULTRA-SEGURA E CORRIGIDA
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    // 1. Valida a estrutura básica pelo esquema do Zod
    const data = createTransactionSchema.parse(req.body);

    // 2. Cria a data garantindo formato correto YYYY-MM-DD
    const finalDate = new Date(data.date);

    // 3. Atualiza no banco forçando a tipagem correta exigida pelo Prisma
    const transactionUpdated = await prisma.transaction.update({
      where: { id: id },
      data: {
        description: data.description,
        value: Number(data.value), // Força a conversão para Number caso chegue texto
        date: finalDate,
        categoryId: data.categoryId
      }
    });

    console.log(`🚀 Transação ${id} editada com sucesso no banco de dados!`);
    return res.json(transactionUpdated);

  } catch (error) {
    console.error("❌ Erro interno no banco durante o PUT:", error);
    next(error); 
  }
});

export default router;