from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from database import get_db, init_db
from models import Produto
from schemas import ProdutoCreate, ProdutoResponse

app = FastAPI(
    title="StockJujuco API",
    description="API de controle de produtos da Juju Co. Confeitaria Artesanal",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    init_db()
    print("StockJujuco API iniciada com sucesso!")


@app.get("/", summary="Health check")
def root():
    return {"status": "ok", "app": "StockJujuco API", "version": "1.0.0"}


@app.get("/produtos", response_model=List[ProdutoResponse], summary="Listar produtos")
def listar_produtos(db: Session = Depends(get_db)):
    """Retorna todos os produtos cadastrados, do mais recente para o mais antigo."""
    produtos = db.query(Produto).order_by(Produto.criado_em.desc()).all()
    return produtos


@app.post("/produtos", response_model=ProdutoResponse, status_code=201, summary="Cadastrar produto")
def cadastrar_produto(produto: ProdutoCreate, db: Session = Depends(get_db)):
    """Cadastra um novo produto no banco de dados."""
    novo_produto = Produto(
        nome=produto.nome,
        sabor=produto.sabor,
        categoria=produto.categoria,
        preco_venda=produto.preco_venda,
        descricao=produto.descricao,
        ativo=produto.ativo,
        criado_em=datetime.utcnow(),
    )
    db.add(novo_produto)
    db.commit()
    db.refresh(novo_produto)
    return novo_produto
