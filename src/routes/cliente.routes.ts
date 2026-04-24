import { Router } from "express";
import * as clienteController from "../controllers/cliente.controller";

const router = Router();

/**
 * @route POST /clientes
 * @desc Cadastra um novo cliente
 */
router.post("/", clienteController.criar);

/**
 * @route GET /clientes
 * @desc Lista todos os clientes ativos
 */
router.get("/", clienteController.listar);

/**
 * @route GET /clientes/:id
 * @desc Busca um cliente pelo ID
 */
router.get("/:id", clienteController.buscarPorId);

/**
 * @route PATCH /clientes/:id
 * @desc Atualiza um ou mais campos do cliente
 */
router.patch("/:id", clienteController.atualizar);

/**
 * @route DELETE /clientes/:id
 * @desc Soft Delete — muda is_active para false (não apaga do banco)
 */
router.delete("/:id", clienteController.deletar);

export default router;
