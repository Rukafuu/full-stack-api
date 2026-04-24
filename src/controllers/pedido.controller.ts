import { Response, NextFunction } from "express";
import { z } from "zod";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as pedidoService from "../services/pedido.service";

const criarPedidoSchema = z.object({
  descricao: z.string().min(3, "Descrição deve ter ao menos 3 caracteres."),
});

export async function criar(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { descricao } = criarPedidoSchema.parse(req.body);
    const clienteId = req.clienteId as number;

    const pedido = await pedidoService.criarPedido({ descricao, clienteId });
    res.status(201).json(pedido);
  } catch (err) {
    if (err instanceof Error && err.message.includes("não encontrado")) {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  }
}

export async function listar(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // ?clienteId=1 filtra por usuário; sem query = todos os pedidos
    const clienteId = req.query.clienteId
      ? Number(req.query.clienteId)
      : undefined;

    const pedidos = await pedidoService.listarPedidos(clienteId);
    res.status(200).json(pedidos);
  } catch (err) {
    next(err);
  }
}

export async function buscarPorId(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const pedido = await pedidoService.buscarPedidoPorId(id);
    res.status(200).json(pedido);
  } catch (err) {
    if (err instanceof Error && err.message === "Pedido não encontrado.") {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  }
}

export async function deletar(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    await pedidoService.deletarPedido(id);
    res.status(204).send();
  } catch (err) {
    if (err instanceof Error && err.message === "Pedido não encontrado.") {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  }
}
