# StockJujuco

> Controle de produtos, ingredientes, ficha tecnica, custos e precificacao para confeitaria autonoma.

---

## Sobre o Projeto

O **StockJujuco** e um sistema web desenvolvido para auxiliar a **Juju Co.**, uma confeitaria artesanal operada por uma unica pessoa. O sistema organiza o catalogo de produtos vendidos, cadastra insumos e ingredientes, calcula automaticamente o custo de producao (CPV) de cada receita e apoia a tomada de decisao na precificacao e margens de lucro.

### Produtos iniciais cadastrados
- Brownie - Chocolate Tradicional (Preco: R$ 12,00 | Custo: R$ 4,37 | Margem: 63,6%)
- Brownie - Caramelo Salgado (Preco: R$ 14,00 | Custo: R$ 6,14 | Margem: 56,1%)
- Brownie - Chocolate com Amendoim (Preco: R$ 13,00 | Custo: R$ 4,94 | Margem: 62,0%)

---

## Arquitetura

O projeto segue a arquitetura em tres camadas:

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
|   |-- main.py          # Endpoints REST (produtos, ingredientes, receitas, precificacao)
|   |-- database.py      # Conexao SQLite e seed completo de dados
|   |-- models.py        # Modelos SQLAlchemy (Produto, Ingrediente, ReceitaItem)
|   |-- schemas.py       # Schemas Pydantic para validacao e simulacao
|   |-- requirements.txt # Dependencias Python
|   `-- stockjujuco.db   # Banco de dados SQLite persistente
|-- frontend/
|   |-- index.html
|   |-- vite.config.js
|   |-- package.json
|   `-- src/
|       |-- main.jsx
|       |-- App.jsx
|       |-- index.css       # Identidade visual Juju Co. (tons de rosa e verde)
|       |-- components/
|       |   |-- Navbar.jsx
|       |   |-- ProdutoCard.jsx
|       |   `-- ProdutoForm.jsx
|       `-- pages/
|           |-- Home.jsx
|           |-- Produtos.jsx
|           |-- Ingredientes.jsx   # AC02: Gestao de insumos e custos unitarios
|           `-- Precificacao.jsx   # AC03: Ficha tecnica, custos e simulador
|-- demo/
|   `-- index.html       # Versao de demonstracao autonoma completa (AC01 + AC02 + AC03)
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

### 1. Produtos (AC01)
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/` | Verificacao de integridade (Health check) |
| GET | `/produtos` | Listar produtos com custos e margens calculados |
| POST | `/produtos` | Cadastrar novo produto no catalogo |

### 2. Ingredientes (AC02)
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/ingredientes` | Listar ingredientes e custos unitarios por g/ml/un |
| POST | `/ingredientes` | Cadastrar novo insumo (calcula custo unitario automatico) |
| DELETE | `/ingredientes/{id}` | Excluir ingrediente |

### 3. Ficha Tecnica e Receitas (AC02)
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/produtos/{id}/receita` | Listar ingredientes e quantidades da receita do produto |
| POST | `/produtos/{id}/receita` | Adicionar ou atualizar ingrediente na receita do produto |
| DELETE | `/receita-itens/{id}` | Remover ingrediente da receita |

### 4. Custos e Precificacao (AC03)
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/produtos/{id}/precificacao` | Analise detalhada de custo real, lucro bruto, margem e precos sugeridos |
| GET | `/precificacao/resumo` | Visao consolidada de custos e margens de todos os produtos |

---

## Roadmap de Entregas

| Entrega | Data | Funcionalidade Principal | Status |
|---------|------|--------------------------|--------|
| AC01 | 14/09/2026 | Catalogo de produtos | Concluido |
| AC02 | 13/10/2026 | Ingredientes e receitas | Concluido (Integrado na AC03) |
| AC03 | 08/11/2026 | Custos e precificacao | Concluido (Entrega Atual) |
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
- [#8](https://github.com/Gabstherin/StockJujuco/issues/8) Realizar submissao da AC01 no Google Classroom

### AC02 / AC03 - Concluidas
- [#9](https://github.com/Gabstherin/StockJujuco/issues/9) Cadastrar ingredientes da confeitaria e calculo do custo unitario
- [#10](https://github.com/Gabstherin/StockJujuco/issues/10) Compor receitas associando ingredientes aos produtos (Ficha Tecnica)
- [#11](https://github.com/Gabstherin/StockJujuco/issues/11) Calcular custo automatico da receita por produto (CPV)
- [#12](https://github.com/Gabstherin/StockJujuco/issues/12) Definir margem de lucro e simulador interativo de precificacao sugerida

### AC03 - Em Andamento / Em Teste
- [#15](https://github.com/Gabstherin/StockJujuco/issues/15) Realizar submissao da AC03 no Google Classroom

### Backlog da Entrega Final (22/11/2026)
- [#13](https://github.com/Gabstherin/StockJujuco/issues/13) Controle simples de estoque - entradas e saidas de insumos
- [#14](https://github.com/Gabstherin/StockJujuco/issues/14) Dashboard consolidado para a confeiteira

---

## Integrantes

| Nome | RA |
|------|----|
| Gabriela Andrade | 2500734 |

---

## Links do Projeto

- Repositorio GitHub: https://github.com/Gabstherin/StockJujuco
- Quadro de Atividades (Board): https://github.com/users/Gabstherin/projects/1/views/1
- Video de Demonstracao AC01: Anexado no Classroom (Stockjujuco_test.mp4)
- Video de Demonstracao AC03: Anexado diretamente na entrega da atividade no Google Classroom

---

Desenvolvido para a disciplina de Projeto de Software - Faculdade Impacta Tecnologia, 2026.
