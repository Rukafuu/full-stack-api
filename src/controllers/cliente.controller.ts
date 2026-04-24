import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as clienteService from "../services/cliente.service";

const criarClienteSchema = z.object({
  cpf: z.string().min(11, "CPF deve ter 11 dígitos.").max(14),
  rg: z.string().min(7, "RG inválido."),
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres."),
  idade: z.number().int().min(0).max(150),
  email: z.string().email("E-mail inválido."),
  login: z.string().min(3, "Login deve ter ao menos 3 caracteres."),
  senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres."),
});

const atualizarClienteSchema = criarClienteSchema.partial();

export async function criar(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = criarClienteSchema.parse(req.body);
    const cliente = await clienteService.criarCliente(data);
    res.status(201).json(cliente);
  } catch (err) {
    if (err instanceof Error && isConflictError(err.message)) {
      res.status(409).json({ error: err.message });
      return;
    }
    next(err);
  }
}

export async function listar(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const clientes = await clienteService.listarClientes();
    res.status(200).json(clientes);
  } catch (err) {
    next(err);
  }
}

export async function buscarPorId(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const cliente = await clienteService.buscarClientePorId(id);
    res.status(200).json(cliente);
  } catch (err) {
    if (err instanceof Error && err.message === "Cliente não encontrado.") {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  }
}

export async function atualizar(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const data = atualizarClienteSchema.parse(req.body);
    const cliente = await clienteService.atualizarCliente(id, data);
    res.status(200).json(cliente);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Cliente não encontrado.") {
        res.status(404).json({ error: err.message });
        return;
      }
      if (isConflictError(err.message)) {
        res.status(409).json({ error: err.message });
        return;
      }
    }
    next(err);
  }
}

export async function deletar(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    await clienteService.deletarCliente(id);
    res.status(204).send();
  } catch (err) {
    if (err instanceof Error && err.message === "Cliente não encontrado.") {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  }
}

function isConflictError(msg: string) {
  return (
    msg.includes("já cadastrado") ||
    msg.includes("já está em uso")
  );
}
