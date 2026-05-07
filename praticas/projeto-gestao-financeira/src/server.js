// src/server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import categoryRoutes from "./routes/categoryRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Registrando as rotas
app.use("/categories", categoryRoutes);
app.use("/transactions", transactionRoutes);

// Middleware de erro (deve ser o último)
app.use(errorHandler);

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});