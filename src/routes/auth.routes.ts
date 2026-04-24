import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router = Router();

/**
 * @route POST /auth/login
 * @desc Autentica o usuário e retorna o token JWT
 */
router.post("/login", authController.login);

export default router;
