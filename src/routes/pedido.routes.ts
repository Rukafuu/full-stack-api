import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import * as pedidoController from "../controllers/pedido.controller";

const router = Router();

// Todas as rotas de pedidos exigem autenticação JWT
router.use(authMiddleware);

/**
 * @route POST /pedidos
 * @desc Cria um pedido vinculado ao usuário logado (via JWT)
 * @header Authorization: Bearer <token>
 */
router.post("/", pedidoController.criar);

/**
 * @route GET /pedidos
 * @desc Lista todos os pedidos. Use ?clienteId=X para filtrar por usuário
 * @header Authorization: Bearer <token>
 */
router.get("/", pedidoController.listar);

/**
 * @route GET /pedidos/:id
 * @desc Busca um pedido pelo ID
 * @header Authorization: Bearer <token>
 */
router.get("/:id", pedidoController.buscarPorId);

/**
 * @route DELETE /pedidos/:id
 * @desc Remove um pedido
 * @header Authorization: Bearer <token>
 */
router.delete("/:id", pedidoController.deletar);

export default router;
