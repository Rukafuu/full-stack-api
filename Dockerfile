# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./
RUN npm ci

# Copia o restante do código
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# ---- Runtime Stage ----
FROM node:20-alpine

WORKDIR /app

# Copia tudo do builder (node_modules já gerados)
COPY --from=builder /app ./

EXPOSE 3000

# Roda as migrations e inicia o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx src/server.ts"]
