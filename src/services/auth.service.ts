import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

export async function login(login: string, senha: string) {
  const cliente = await prisma.cliente.findFirst({
    where: { login, is_active: true },
  });

  if (!cliente) {
    throw new Error("Login ou senha inválidos.");
  }

  const senhaCorreta = await bcrypt.compare(senha, cliente.senha);
  if (!senhaCorreta) {
    throw new Error("Login ou senha inválidos.");
  }

  const secret = process.env.JWT_SECRET as string;
  const token = jwt.sign({ id: cliente.id }, secret, { expiresIn: "8h" });

  return {
    token,
    cliente: {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      login: cliente.login,
    },
  };
}
