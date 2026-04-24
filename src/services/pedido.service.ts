import prisma from "../lib/prisma";

interface CriarPedidoDTO {
  descricao: string;
  clienteId: number;
}

export async function criarPedido(data: CriarPedidoDTO) {
  const cliente = await prisma.cliente.findFirst({
    where: { id: data.clienteId, is_active: true },
  });

  if (!cliente) throw new Error("Cliente não encontrado ou inativo.");

  return prisma.pedido.create({
    data,
    include: {
      cliente: { select: { id: true, nome: true, email: true } },
    },
  });
}

export async function listarPedidos(clienteId?: number) {
  const where = clienteId ? { clienteId } : {};

  return prisma.pedido.findMany({
    where,
    include: {
      cliente: { select: { id: true, nome: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function buscarPedidoPorId(id: number) {
  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: {
      cliente: { select: { id: true, nome: true, email: true } },
    },
  });

  if (!pedido) throw new Error("Pedido não encontrado.");
  return pedido;
}

export async function deletarPedido(id: number) {
  const pedido = await prisma.pedido.findUnique({ where: { id } });
  if (!pedido) throw new Error("Pedido não encontrado.");

  await prisma.pedido.delete({ where: { id } });
}
