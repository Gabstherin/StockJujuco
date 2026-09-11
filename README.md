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

## Tarefas da Sprint e Backlog (Issues)

Todas as atividades estao mapeadas no [Quadro de Projetos](https://github.com/users/Gabstherin/projects/1/views/1) e vinculadas as Issues do repositorio:

### AC01 - Concluidas
- [#1](https://github.com/Gabstherin/StockJujuco/issues/1) Criar repositorio GitHub do StockJujuco e documentacao inicial
- [#2](https://github.com/Gabstherin/StockJujuco/issues/2) Configurar banco SQLite e tabela produtos com seed inicial
- [#3](https://github.com/Gabstherin/StockJujuco/issues/3) Desenvolver API FastAPI com endpoints GET e POST /produtos
- [#4](https://github.com/Gabstherin/StockJujuco/issues/4) Desenvolver interface React + Vite com identidade visual Juju Co.
- [#5](https://github.com/Gabstherin/StockJujuco/issues/5) Implementar formulario de cadastro de novo produto
- [#6](https://github.com/Gabstherin/StockJujuco/issues/6) Integrar front-end com a API e garantir persistencia dos dados
- [#7](https://github.com/Gabstherin/StockJujuco/issues/7) Gravar video de demonstracao da funcionalidade da AC01

### AC01 - Em Andamento / Em Teste
- [#8](https://github.com/Gabstherin/StockJujuco/issues/8) Realizar submissao da AC01 no Google Classroom

### Backlog das Proximas Sprints
- [#9](https://github.com/Gabstherin/StockJujuco/issues/9) Cadastrar ingredientes da confeitaria (AC02)
- [#10](https://github.com/Gabstherin/StockJujuco/issues/10) Compor receitas associando ingredientes aos produtos (AC02)
- [#11](https://github.com/Gabstherin/StockJujuco/issues/11) Calcular custo automatico da receita por produto (AC03)
- [#12](https://github.com/Gabstherin/StockJujuco/issues/12) Definir margem de lucro e apoio a precificacao sugerida (AC03)
- [#13](https://github.com/Gabstherin/StockJujuco/issues/13) Controle simples de estoque - entradas e saidas (Final)
- [#14](https://github.com/Gabstherin/StockJujuco/issues/14) Dashboard consolidado para a confeiteira (Final)

---

## Integrantes

| Nome | RA |
|------|----|
| Gabriela Andrade | 2500734 |

---

## Links do Projeto

- Repositorio GitHub: https://github.com/Gabstherin/StockJujuco
- Quadro de Atividades (Board): https://github.com/users/Gabstherin/projects/1/views/1
- Video de Demonstracao AC01: Anexado diretamente na entrega da atividade no Google Classroom (Stockjujuco_test.mp4)

---

Desenvolvido para a disciplina de Projeto de Software - Faculdade Impacta Tecnologia, 2026.
