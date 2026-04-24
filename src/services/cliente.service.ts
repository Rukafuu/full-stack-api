import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

interface CriarClienteDTO {
  cpf: string;
  rg: string;
  nome: string;
  idade: number;
  email: string;
  login: string;
  senha: string;
}

interface AtualizarClienteDTO {
  cpf?: string;
  rg?: string;
  nome?: string;
  idade?: number;
  email?: string;
  login?: string;
  senha?: string;
}

export async function criarCliente(data: CriarClienteDTO) {
  const existente = await prisma.cliente.findFirst({
    where: {
      OR: [{ email: data.email }, { cpf: data.cpf }, { login: data.login }],
    },
  });

  if (existente) {
    if (existente.email === data.email) throw new Error("E-mail já cadastrado.");
    if (existente.cpf === data.cpf) throw new Error("CPF já cadastrado.");
    if (existente.login === data.login) throw new Error("Login já está em uso.");
  }

  const senhaHash = await bcrypt.hash(data.senha, 10);

  const cliente = await prisma.cliente.create({
    data: { ...data, senha: senhaHash },
    select: {
      id: true, cpf: true, rg: true, nome: true,
      idade: true, email: true, login: true,
      is_active: true, createdAt: true,
    },
  });

  return cliente;
}

export async function listarClientes() {
  return prisma.cliente.findMany({
    where: { is_active: true },
    select: {
      id: true, cpf: true, rg: true, nome: true,
      idade: true, email: true, login: true,
      is_active: true, createdAt: true,
    },
    orderBy: { nome: "asc" },
  });
}

export async function buscarClientePorId(id: number) {
  const cliente = await prisma.cliente.findFirst({
    where: { id, is_active: true },
    select: {
      id: true, cpf: true, rg: true, nome: true,
      idade: true, email: true, login: true,
      is_active: true, createdAt: true, updatedAt: true,
    },
  });

  if (!cliente) throw new Error("Cliente não encontrado.");
  return cliente;
}

export async function atualizarCliente(id: number, data: AtualizarClienteDTO) {
  const cliente = await prisma.cliente.findFirst({ where: { id, is_active: true } });
  if (!cliente) throw new Error("Cliente não encontrado.");

  if (data.email && data.email !== cliente.email) {
    const emailEmUso = await prisma.cliente.findFirst({
      where: { email: data.email, NOT: { id } },
    });
    if (emailEmUso) throw new Error("E-mail já está em uso por outro cliente.");
  }

  if (data.login && data.login !== cliente.login) {
    const loginEmUso = await prisma.cliente.findFirst({
      where: { login: data.login, NOT: { id } },
    });
    if (loginEmUso) throw new Error("Login já está em uso por outro cliente.");
  }

  const dadosAtualizados: AtualizarClienteDTO & { senha?: string } = { ...data };
  if (data.senha) {
    dadosAtualizados.senha = await bcrypt.hash(data.senha, 10);
  }

  return prisma.cliente.update({
    where: { id },
    data: dadosAtualizados,
    select: {
      id: true, cpf: true, rg: true, nome: true,
      idade: true, email: true, login: true,
      is_active: true, updatedAt: true,
    },
  });
}

export async function deletarCliente(id: number) {
  const cliente = await prisma.cliente.findFirst({ where: { id, is_active: true } });
  if (!cliente) throw new Error("Cliente não encontrado.");

  // Soft Delete: apenas muda is_active para false, NÃO remove do banco
  await prisma.cliente.update({
    where: { id },
    data: { is_active: false },
  });
}
