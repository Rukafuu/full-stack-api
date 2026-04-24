import { Router } from "express";
import authRoutes from "./auth.routes";
import clienteRoutes from "./cliente.routes";
import pedidoRoutes from "./pedido.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/clientes", clienteRoutes);
router.use("/pedidos", pedidoRoutes);

export default router;
