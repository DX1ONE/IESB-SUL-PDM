// src/middlewares/errorHandler.js
import { ZodError } from "zod";

/**
 * Middleware central de erro do Express.
 * Captura tudo que cair em next(error) e devolve JSON consistente.
 */
export function errorHandler(err, req, res, next) {
  // Mantém o log detalhado no terminal do backend para você monitorar
  console.error("❌ Erro capturado pelo Handler:", err);

  // Intercepta erros de validação do Zod de forma robusta
  if (err instanceof ZodError || err.name === "ZodError") {
    return res.status(400).json({ 
      error: "Dados inválidos", 
      details: err.flatten ? err.flatten().fieldErrors : err.issues 
    });
  }

  // Erros conhecidos do Prisma ORM (Banco de dados)
  if (err.code === "P2025") {
    return res.status(404).json({ error: "Recurso não encontrado" });
  }
  
  if (err.code === "P2002") {
    return res.status(409).json({ error: "Registro duplicado" });
  }

  // Qualquer outro erro não previsto cai aqui (Status 500)
  return res.status(500).json({ error: "Erro interno do servidor" });
}