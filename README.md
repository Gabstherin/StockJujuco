# StockJujuco

> Controle simples de produtos, ingredientes, estoque e precificacao para confeitaria autonoma.

---

## Sobre o Projeto

O **StockJujuco** e um sistema web desenvolvido para auxiliar a **Juju Co.**, uma confeitaria artesanal operada por uma unica pessoa. O sistema permite organizar o catalogo de produtos vendidos e, nas proximas evolucoes, cadastrar ingredientes, compor receitas, calcular custos e apoiar a precificacao.

### Produtos iniciais
- Brownie - Chocolate Tradicional (R$ 12,00)
- Brownie - Caramelo Salgado (R$ 14,00)
- Brownie - Chocolate com Amendoim (R$ 13,00)

---

## Arquitetura

O projeto segue a arquitetura de tres camadas:

```
+-----------------+     HTTP/REST     +------------------+     SQLAlchemy     +----------+
|    FRONT-END    | <---------------> |     BACK-END     | <----------------> |  BANCO   |
|  React + Vite   |                   | Python + FastAPI |                    |  SQLite  |
|  localhost:5173 |                   |  localhost:8000  |                    |   .db    |
+-----------------+                   +------------------+                    +----------+
```

---

## Tecnologias

| Camada | Tecnologia | Versao |
|--------|-----------|--------|
| Front-end | React | 18.x |
| Front-end | Vite | 5.x |
| Front-end | React Router DOM | 6.x |
| Front-end | Axios | 1.x |
| Back-end | Python | 3.10+ |
| Back-end | FastAPI | 0.111+ |
| Back-end | SQLAlchemy | 2.x |
| Back-end | Pydantic | 2.x |
| Back-end | Uvicorn | 0.30+ |
| Banco de dados | SQLite | 3.x |

---

## Estrutura do Projeto

```
StockJujuco/
|-- backend/
|   |-- main.py          # Aplicacao FastAPI e endpoints
|   |-- database.py      # Conexao SQLite e seed inicial
|   |-- models.py        # Modelo SQLAlchemy (Produto)
|   |-- schemas.py       # Schemas Pydantic para validacao
|   |-- requirements.txt # Dependencias Python
|   `-- stockjujuco.db   # Banco de dados SQLite
|-- frontend/
|   |-- index.html
|   |-- vite.config.js
|   |-- package.json
|   `-- src/
|       |-- main.jsx
|       |-- App.jsx
|       |-- index.css       # Identidade visual Juju Co.
|       |-- components/
|       |   |-- Navbar.jsx
|       |   |-- ProdutoCard.jsx
|       |   `-- ProdutoForm.jsx
|       `-- pages/
|           |-- Home.jsx
|           `-- Produtos.jsx
|-- demo/
|   `-- index.html       # Versao de demonstracao autonoma
|-- .gitignore
`-- README.md
```

---

## Como Executar

### Pre-requisitos
- Python 3.10 ou superior
- Node.js 18 ou superior
- pip

### 1. Clonar o repositorio

```bash
git clone https://github.com/Gabstherin/StockJujuco.git
cd StockJujuco
```

### 2. Executar o Back-end

```bash
cd backend

# Criar ambiente virtual
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor FastAPI
uvicorn main:app --reload
```

- API disponivel em: **http://localhost:8000**
- Documentacao interativa (Swagger): **http://localhost:8000/docs**

### 3. Executar o Front-end

Em um novo terminal:

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

- Aplicacao disponivel em: **http://localhost:5173**

---

## Endpoints da API

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/` | Verificacao de integridade (Health check) |
| GET | `/produtos` | Listar todos os produtos cadastrados |
| POST | `/produtos` | Cadastrar novo produto no catalogo |

### Exemplo de Requisicao (POST /produtos)

```json
{
  "nome": "Brownie",
  "sabor": "Nutella com Oreo",
  "categoria": "Brownie",
  "preco_venda": 15.00,
  "descricao": "Brownie artesanal recheado com Nutella e pedacos de Oreo",
  "ativo": true
}
```

---

## Roadmap de Entregas

| Entrega | Data | Funcionalidade Principal | Status |
|---------|------|--------------------------|--------|
| AC01 | 14/09/2026 | Catalogo de produtos | Em andamento |
| AC02 | 13/10/2026 | Ingredientes e receitas | Planejado |
| AC03 | 08/11/2026 | Custos e precificacao | Planejado |
| Final | 22/11/2026 | Estoque e visao consolidada | Planejado |

---

## Integrantes

| Nome | RA |
|------|----|
| Gabriela Andrade | (Preencher RA) |

---

## Links do Projeto

- Repositorio GitHub: https://github.com/Gabstherin/StockJujuco
- Quadro de Atividades (Board): https://github.com/users/Gabstherin/projects/1/views/1
- Video de Demonstracao AC01: (link do video)

---

Desenvolvido para a disciplina de Projeto de Software - Faculdade Impacta Tecnologia, 2026.
