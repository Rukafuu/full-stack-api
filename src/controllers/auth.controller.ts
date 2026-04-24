import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as authService from "../services/auth.service";

const loginSchema = z.object({
  login: z.string().min(1, "Login é obrigatório."),
  senha: z.string().min(1, "Senha é obrigatória."),
});

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { login, senha } = loginSchema.parse(req.body);
    const resultado = await authService.login(login, senha);
    res.status(200).json(resultado);
  } catch (err) {
    if (err instanceof Error && err.message === "Login ou senha inválidos.") {
      res.status(401).json({ error: err.message });
      return;
    }
    next(err);
  }
}
