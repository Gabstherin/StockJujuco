# 🍫 StockJujuco

> Controle simples de produtos, ingredientes, estoque e precificação para confeitaria autônoma.

![Juju Co.](https://img.shields.io/badge/Juju%20Co.-Confeitaria%20Artesanal-E91E8C?style=flat-square)
![AC01](https://img.shields.io/badge/AC01-Catálogo%20de%20Produtos-A8D5BA?style=flat-square)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=flat-square)

---

## 📌 Sobre o Projeto

O **StockJujuco** é um sistema web desenvolvido para auxiliar a **Juju Co.**, uma confeitaria artesanal operada por uma única pessoa. O sistema permite organizar o catálogo de produtos vendidos e, nas próximas evoluções, cadastrar ingredientes, compor receitas, calcular custos e apoiar a precificação.

### Produtos iniciais
- 🍫 Brownie - Chocolate Tradicional (R$ 12,00)
- 🍮 Brownie - Caramelo Salgado (R$ 14,00)
- 🥜 Brownie - Chocolate com Amendoim (R$ 13,00)

---

## 🏗️ Arquitetura

```
┌─────────────────┐     HTTP/REST     ┌──────────────────┐     SQLAlchemy     ┌──────────┐
│   FRONT-END     │ ◄───────────────► │    BACK-END       │ ◄────────────────► │  BANCO   │
│  React + Vite   │                   │ Python + FastAPI  │                    │  SQLite  │
│  localhost:5173 │                   │  localhost:8000   │                    │  .db     │
└─────────────────┘                   └──────────────────┘                    └──────────┘
```

---

## 🛠️ Tecnologias

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Front-end | React | 18.x |
| Front-end | Vite | 5.x |
| Front-end | React Router DOM | 6.x |
| Front-end | Axios | 1.x |
| Back-end | Python | 3.10+ |
| Back-end | FastAPI | 0.111 |
| Back-end | SQLAlchemy | 2.x |
| Back-end | Pydantic | 2.x |
| Back-end | Uvicorn | 0.30 |
| Banco | SQLite | 3.x |

---

## 📁 Estrutura do Projeto

```
StockJujuco/
├── backend/
│   ├── main.py          # FastAPI app + endpoints
│   ├── database.py      # Configuração SQLite + seed inicial
│   ├── models.py        # Modelo SQLAlchemy (Produto)
│   ├── schemas.py       # Schemas Pydantic
│   ├── requirements.txt # Dependências Python
│   └── stockjujuco.db   # Banco de dados (gerado automaticamente)
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css       # Estilos globais (identidade Juju Co.)
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProdutoCard.jsx
│       │   └── ProdutoForm.jsx
│       └── pages/
│           ├── Home.jsx
│           └── Produtos.jsx
└── README.md
```

---

## 🚀 Como Executar

### Pré-requisitos
- Python 3.10 ou superior
- Node.js 18 ou superior
- pip

### 1. Clonar o repositório

```bash
git clone https://github.com/<seu-usuario>/StockJujuco.git
cd StockJujuco
```

### 2. Executar o Back-end

```bash
cd backend

# Criar ambiente virtual (recomendado)
python -m venv venv
venv\Scripts\activate      # Windows
# ou: source venv/bin/activate  # Linux/Mac

# Instalar dependências
pip install -r requirements.txt

# Iniciar o servidor
uvicorn main:app --reload
```

O servidor estará disponível em: **http://localhost:8000**  
Documentação automática (Swagger): **http://localhost:8000/docs**

### 3. Executar o Front-end

Em um novo terminal:

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173**

---

## 🔌 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Health check |
| GET | `/produtos` | Listar todos os produtos |
| POST | `/produtos` | Cadastrar novo produto |

### Exemplo de Payload (POST /produtos)

```json
{
  "nome": "Brownie",
  "sabor": "Nutella com Oreo",
  "categoria": "Brownie",
  "preco_venda": 15.00,
  "descricao": "Brownie recheado com Nutella e pedaços de Oreo",
  "ativo": true
}
```

---

## 🗺️ Roadmap

| Entrega | Data | Funcionalidade | Status |
|---------|------|----------------|--------|
| AC01 | 14/09/2026 | Catálogo de produtos | ✅ Em andamento |
| AC02 | 13/10/2026 | Ingredientes e receitas | 🔜 Planejado |
| AC03 | 08/11/2026 | Custos e precificação | 🔜 Planejado |
| Final | 22/11/2026 | Estoque e dashboard | 🔜 Planejado |

---

## 👩‍💻 Integrantes

| Nome | RA |
|------|----|
| (Preencher com nome completo) | (RA) |

---

## 📎 Links

- 🔗 **GitHub**: (este repositório)
- 📋 **Board do Projeto**: (link do board)
- 🎥 **Vídeo AC01**: (link do vídeo)

---

> Desenvolvido para a disciplina de Projeto de Software — Impacta Tecnologia, 2026.
