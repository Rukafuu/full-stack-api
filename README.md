# API de Cadastro de Clientes e Pedidos

API RESTful construída com **Node.js + TypeScript + Prisma ORM + SQLite**, desenvolvida como teste técnico para a vaga Full Stack — Grupo Cred Consultoria Financeira.

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 20+ |
| Linguagem | TypeScript |
| Framework | Express |
| ORM | Prisma |
| Banco de dados | SQLite |
| Autenticação | JWT (jsonwebtoken) |
| Hash de senha | bcryptjs |
| Validação | Zod |

---

## Pré-requisitos

- Node.js 18 ou superior
- npm

---

## Instalação e execução

```bash
# 1. Clone o repositório
git clone https://github.com/Rukafuu/full-stack-api.git
cd full-stack-api

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env se necessário (já vem pré-configurado para rodar localmente)

# 4. Execute a migração do banco de dados
npm run migrate

# 5. Inicie o servidor em modo desenvolvimento
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

---

## Rodando com Docker (recomendado)

> Não precisa instalar Node.js nem configurar nada manualmente.

**Pré-requisitos:** Docker e Docker Compose instalados.

```bash
# 1. Clone o repositório
git clone https://github.com/Rukafuu/full-stack-api.git
cd full-stack-api

# 2. Suba o container (build + migrations + start automáticos)
docker compose up
```

A API estará disponível em `http://localhost:3000`. O banco de dados SQLite é persistido em um volume Docker — os dados sobrevivem a reinicializações do container.

Para parar:
```bash
docker compose down
```

Para parar e apagar os dados do banco:
```bash
docker compose down -v
```

---

## Estrutura de pastas

```
full-stack-api/
├── prisma/
│   └── schema.prisma        # Models do banco de dados
├── src/
│   ├── controllers/         # Recebe a requisição, chama o Service, retorna resposta HTTP
│   │   ├── auth.controller.ts
│   │   ├── cliente.controller.ts
│   │   └── pedido.controller.ts
│   ├── services/            # Regras de negócio e acesso ao banco via Prisma
│   │   ├── auth.service.ts
│   │   ├── cliente.service.ts
│   │   └── pedido.service.ts
│   ├── routes/              # Define os endpoints e aplica middlewares
│   │   ├── auth.routes.ts
│   │   ├── cliente.routes.ts
│   │   ├── pedido.routes.ts
│   │   └── index.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts   # Validação do token JWT
│   │   └── error.middleware.ts  # Tratamento global de erros
│   ├── lib/
│   │   └── prisma.ts        # Instância singleton do PrismaClient
│   ├── app.ts               # Configuração do Express
│   └── server.ts            # Ponto de entrada
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Endpoints

### Base URL: `http://localhost:3000/api`

---

### Autenticação

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/auth/login` | Autentica e retorna JWT | Não |

**POST /auth/login**
```json
// Request Body
{ "login": "joao123", "senha": "minhasenha" }

// Response 200
{
  "token": "eyJhbGci...",
  "cliente": { "id": 1, "nome": "João Silva", "email": "joao@email.com", "login": "joao123" }
}
```

---

### Clientes

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/clientes` | Cadastra novo cliente | Não |
| GET | `/clientes` | Lista todos os clientes ativos | Não |
| GET | `/clientes/:id` | Busca cliente por ID | Não |
| PATCH | `/clientes/:id` | Atualiza um ou mais campos | Não |
| DELETE | `/clientes/:id` | Soft Delete (marca como inativo) | Não |

**POST /clientes**
```json
// Request Body
{
  "cpf": "12345678901",
  "rg": "1234567",
  "nome": "João Silva",
  "idade": 30,
  "email": "joao@email.com",
  "login": "joao123",
  "senha": "senha123"
}

// Response 201
{
  "id": 1,
  "cpf": "12345678901",
  "rg": "1234567",
  "nome": "João Silva",
  "idade": 30,
  "email": "joao@email.com",
  "login": "joao123",
  "is_active": true,
  "createdAt": "2026-04-23T00:00:00.000Z"
}
```

**PATCH /clientes/:id** — permite atualizar qualquer campo individualmente:
```json
{ "nome": "João da Silva" }
// ou
{ "email": "novo@email.com", "idade": 31 }
```

**DELETE /clientes/:id** — Soft Delete: o registro **não é apagado do banco**. Apenas o campo `is_active` é alterado para `false`. O cliente desaparece das listagens mas permanece no banco para integridade dos pedidos.

---

### Pedidos

> Todas as rotas de pedidos exigem o header: `Authorization: Bearer <token>`

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/pedidos` | Cria pedido vinculado ao usuário logado | JWT |
| GET | `/pedidos` | Lista todos os pedidos | JWT |
| GET | `/pedidos?clienteId=1` | Lista pedidos de um usuário específico | JWT |
| GET | `/pedidos/:id` | Busca pedido por ID | JWT |
| DELETE | `/pedidos/:id` | Remove um pedido | JWT |

**POST /pedidos**
```json
// Header: Authorization: Bearer eyJhbGci...
// Request Body
{ "descricao": "Headset gamer RGB" }

// Response 201
{
  "id": 1,
  "descricao": "Headset gamer RGB",
  "clienteId": 1,
  "createdAt": "2026-04-23T00:00:00.000Z",
  "cliente": { "id": 1, "nome": "João Silva", "email": "joao@email.com" }
}
```

---

## Códigos HTTP utilizados

| Código | Significado |
|---|---|
| 200 | Sucesso |
| 201 | Recurso criado |
| 204 | Sucesso sem conteúdo (DELETE) |
| 400 | Dados inválidos (Zod validation) |
| 401 | Não autenticado |
| 404 | Recurso não encontrado |
| 409 | Conflito (e-mail/CPF/login já cadastrado) |
| 500 | Erro interno do servidor |

---

## Decisões técnicas

- **Soft Delete**: o `DELETE /clientes/:id` apenas muda `is_active` para `false`. O registro permanece no banco, garantindo que pedidos vinculados não percam a referência ao cliente.
- **Arquitetura em camadas**: Routes → Controllers → Services. O controller não acessa o banco; o service não conhece HTTP.
- **Validação com Zod**: schemas declarativos com mensagens de erro em português.
- **JWT**: token expira em 8 horas. O `clienteId` é extraído do payload do token, impedindo que um usuário crie pedidos por outro.
