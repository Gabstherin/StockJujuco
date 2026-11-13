from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from database import get_db, init_db
from models import Produto, Ingrediente, ReceitaItem, MovimentacaoEstoque
from schemas import (
    ProdutoCreate, ProdutoResponse,
    IngredienteCreate, IngredienteResponse,
    ReceitaItemCreate, ReceitaItemResponse,
    PrecificacaoResponse, PrecoSugerido,
    MovimentacaoCreate, MovimentacaoResponse,
    EstoqueItemResponse, DashboardResponse
)

app = FastAPI(
    title="StockJujuco API",
    description="API de controle de produtos, receitas, custos, precificacao e estoque da Juju Co. Confeitaria Artesanal",
    version="3.0.0",
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


def calcular_custo_produto(produto: Produto) -> float:
    """Calcula o custo total de insumos de um produto a partir de seus itens de receita."""
    total = 0.0
    for item in produto.receita_itens:
        if item.ingrediente:
            total += item.quantidade_utilizada * item.ingrediente.custo_unitario
    return round(total, 2)


# ==========================================
# 1. ROTAS DE PRODUTOS (AC01 + enriquecido AC03)
# ==========================================

@app.get("/", summary="Health check")
def root():
    return {
        "status": "ok",
        "app": "StockJujuco API",
        "version": "3.0.0",
        "modulos": ["produtos", "ingredientes", "receitas", "precificacao", "estoque", "dashboard"]
    }


@app.get("/produtos", response_model=List[ProdutoResponse], summary="Listar produtos")
def listar_produtos(db: Session = Depends(get_db)):
    """Retorna todos os produtos com custo e margem calculados automaticamente."""
    produtos = db.query(Produto).order_by(Produto.criado_em.desc()).all()
    resultado = []
    for p in produtos:
        custo = calcular_custo_produto(p)
        lucro = round(p.preco_venda - custo, 2)
        margem = round((lucro / p.preco_venda * 100), 1) if p.preco_venda > 0 else 0.0

        resultado.append(ProdutoResponse(
            id=p.id,
            nome=p.nome,
            sabor=p.sabor,
            categoria=p.categoria,
            preco_venda=p.preco_venda,
            descricao=p.descricao,
            ativo=p.ativo,
            criado_em=p.criado_em,
            custo_producao=custo,
            margem_lucro_reais=lucro,
            margem_lucro_percentual=margem
        ))
    return resultado


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


# ==========================================
# 2. ROTAS DE INGREDIENTES (AC02)
# ==========================================

@app.get("/ingredientes", response_model=List[IngredienteResponse], summary="Listar ingredientes")
def listar_ingredientes(db: Session = Depends(get_db)):
    """Lista todos os ingredientes cadastrados com seus custos unitarios e estoque."""
    return db.query(Ingrediente).order_by(Ingrediente.nome.asc()).all()


@app.post("/ingredientes", response_model=IngredienteResponse, status_code=201, summary="Cadastrar ingrediente")
def cadastrar_ingrediente(ingrediente: IngredienteCreate, db: Session = Depends(get_db)):
    """Cadastra novo ingrediente e calcula automaticamente o custo unitario."""
    custo_unitario = round(ingrediente.preco_compra / ingrediente.quantidade_compra, 4)
    novo = Ingrediente(
        nome=ingrediente.nome,
        unidade_medida=ingrediente.unidade_medida,
        preco_compra=ingrediente.preco_compra,
        quantidade_compra=ingrediente.quantidade_compra,
        custo_unitario=custo_unitario,
        estoque_atual=0.0,
        estoque_minimo=ingrediente.estoque_minimo,
        criado_em=datetime.utcnow(),
    )
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo


@app.delete("/ingredientes/{ingrediente_id}", status_code=204, summary="Excluir ingrediente")
def excluir_ingrediente(ingrediente_id: int, db: Session = Depends(get_db)):
    """Remove um ingrediente."""
    item = db.query(Ingrediente).filter(Ingrediente.id == ingrediente_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Ingrediente nao encontrado")
    db.delete(item)
    db.commit()
    return None


# ==========================================
# 3. ROTAS DE RECEITA / FICHA TECNICA (AC02)
# ==========================================

@app.get("/produtos/{produto_id}/receita", response_model=List[ReceitaItemResponse], summary="Receita do produto")
def obter_receita(produto_id: int, db: Session = Depends(get_db)):
    """Lista todos os ingredientes e quantidades utilizados na receita do produto."""
    produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto nao encontrado")

    resultado = []
    for item in produto.receita_itens:
        custo_total = round(item.quantidade_utilizada * item.ingrediente.custo_unitario, 2)
        resultado.append(ReceitaItemResponse(
            id=item.id,
            produto_id=item.produto_id,
            ingrediente_id=item.ingrediente_id,
            ingrediente_nome=item.ingrediente.nome,
            unidade_medida=item.ingrediente.unidade_medida,
            quantidade_utilizada=item.quantidade_utilizada,
            custo_unitario=item.ingrediente.custo_unitario,
            custo_total_item=custo_total
        ))
    return resultado


@app.post("/produtos/{produto_id}/receita", response_model=ReceitaItemResponse, status_code=201, summary="Adicionar item a receita")
def adicionar_item_receita(produto_id: int, dados: ReceitaItemCreate, db: Session = Depends(get_db)):
    """Adiciona ou atualiza um ingrediente na ficha tecnica do produto."""
    produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto nao encontrado")

    ingrediente = db.query(Ingrediente).filter(Ingrediente.id == dados.ingrediente_id).first()
    if not ingrediente:
        raise HTTPException(status_code=404, detail="Ingrediente nao encontrado")

    # Verifica se ingrediente ja existe na receita; se sim, atualiza quantidade
    existente = db.query(ReceitaItem).filter(
        ReceitaItem.produto_id == produto_id,
        ReceitaItem.ingrediente_id == dados.ingrediente_id
    ).first()

    if existente:
        existente.quantidade_utilizada = dados.quantidade_utilizada
        db.commit()
        db.refresh(existente)
        item_final = existente
    else:
        novo = ReceitaItem(
            produto_id=produto_id,
            ingrediente_id=dados.ingrediente_id,
            quantidade_utilizada=dados.quantidade_utilizada
        )
        db.add(novo)
        db.commit()
        db.refresh(novo)
        item_final = novo

    custo_total = round(item_final.quantidade_utilizada * ingrediente.custo_unitario, 2)
    return ReceitaItemResponse(
        id=item_final.id,
        produto_id=item_final.produto_id,
        ingrediente_id=ingrediente.id,
        ingrediente_nome=ingrediente.nome,
        unidade_medida=ingrediente.unidade_medida,
        quantidade_utilizada=item_final.quantidade_utilizada,
        custo_unitario=ingrediente.custo_unitario,
        custo_total_item=custo_total
    )


@app.delete("/receita-itens/{item_id}", status_code=204, summary="Remover item da receita")
def remover_item_receita(item_id: int, db: Session = Depends(get_db)):
    """Remove um item da receita."""
    item = db.query(ReceitaItem).filter(ReceitaItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item de receita nao encontrado")
    db.delete(item)
    db.commit()
    return None


# ==========================================
# 4. ROTAS DE CUSTOS E PRECIFICACAO (AC03)
# ==========================================

@app.get("/produtos/{produto_id}/precificacao", response_model=PrecificacaoResponse, summary="Calculo de custos e precificacao")
def calcular_precificacao(produto_id: int, db: Session = Depends(get_db)):
    """
    Calcula detalhadamente o custo da receita, a margem de lucro real e
    gera simulacoes de precos sugeridos para apoiar a decisao da confeiteira.
    """
    produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto nao encontrado")

    custo_total = calcular_custo_produto(produto)
    lucro_bruto = round(produto.preco_venda - custo_total, 2)
    margem_percentual = round((lucro_bruto / produto.preco_venda * 100), 1) if produto.preco_venda > 0 else 0.0

    # Classificacao da margem de lucro
    if margem_percentual < 0:
        situacao = "prejuizo"
    elif margem_percentual < 35:
        situacao = "baixa"
    elif margem_percentual <= 65:
        situacao = "saudavel"
    else:
        situacao = "excelente"

    # Simulacoes de preco sugerido para margens tipicas de confeitaria artesanal
    # Formula de Margem sobre Venda: Preco = Custo / (1 - (Margem / 100))
    margens_alvo = [40.0, 50.0, 60.0, 70.0]
    precos_sugeridos = []
    for m in margens_alvo:
        if custo_total > 0:
            sugerido = round(custo_total / (1.0 - (m / 100.0)), 2)
            lucro_proj = round(sugerido - custo_total, 2)
        else:
            sugerido = 0.0
            lucro_proj = 0.0
        precos_sugeridos.append(PrecoSugerido(
            margem_alvo_percentual=m,
            preco_sugerido=sugerido,
            lucro_projetado=lucro_proj
        ))

    # Lista dos itens da receita
    itens_formatados = []
    for item in produto.receita_itens:
        if item.ingrediente:
            custo_item = round(item.quantidade_utilizada * item.ingrediente.custo_unitario, 2)
            itens_formatados.append(ReceitaItemResponse(
                id=item.id,
                produto_id=item.produto_id,
                ingrediente_id=item.ingrediente_id,
                ingrediente_nome=item.ingrediente.nome,
                unidade_medida=item.ingrediente.unidade_medida,
                quantidade_utilizada=item.quantidade_utilizada,
                custo_unitario=item.ingrediente.custo_unitario,
                custo_total_item=custo_item
            ))

    return PrecificacaoResponse(
        produto_id=produto.id,
        produto_nome=produto.nome,
        produto_sabor=produto.sabor,
        categoria=produto.categoria,
        preco_venda_atual=produto.preco_venda,
        custo_total_producao=custo_total,
        lucro_bruto_unitario=lucro_bruto,
        margem_lucro_percentual=margem_percentual,
        situacao_margem=situacao,
        itens_receita=itens_formatados,
        precos_sugeridos=precos_sugeridos
    )


@app.get("/precificacao/resumo", summary="Resumo de custos e margens de todos os produtos")
def resumo_precificacao(db: Session = Depends(get_db)):
    """Retorna uma visao consolidada de todos os produtos com custo, preco, lucro e margem."""
    produtos = db.query(Produto).filter(Produto.ativo == True).all()
    lista = []
    for p in produtos:
        custo = calcular_custo_produto(p)
        lucro = round(p.preco_venda - custo, 2)
        margem = round((lucro / p.preco_venda * 100), 1) if p.preco_venda > 0 else 0.0
        lista.append({
            "produto_id": p.id,
            "nome": f"{p.nome} - {p.sabor}",
            "categoria": p.categoria,
            "preco_venda": p.preco_venda,
            "custo_producao": custo,
            "lucro_bruto": lucro,
            "margem_percentual": margem
        })
    return lista


# ==========================================
# 5. ROTAS DE ESTOQUE (Entrega Final)
# ==========================================

@app.get("/estoque", response_model=List[EstoqueItemResponse], summary="Consultar estoque atual")
def consultar_estoque(db: Session = Depends(get_db)):
    """Retorna o estoque atual de todos os ingredientes com status de nivel."""
    ingredientes = db.query(Ingrediente).order_by(Ingrediente.nome.asc()).all()
    resultado = []
    for ing in ingredientes:
        if ing.estoque_atual <= 0:
            status = "critico"
        elif ing.estoque_atual < ing.estoque_minimo:
            status = "baixo"
        else:
            status = "ok"
        resultado.append(EstoqueItemResponse(
            ingrediente_id=ing.id,
            nome=ing.nome,
            unidade_medida=ing.unidade_medida,
            estoque_atual=ing.estoque_atual,
            estoque_minimo=ing.estoque_minimo,
            status=status
        ))
    return resultado


@app.post("/estoque/entrada", response_model=MovimentacaoResponse, status_code=201, summary="Registrar entrada de insumo")
def entrada_estoque(dados: MovimentacaoCreate, db: Session = Depends(get_db)):
    """Registra entrada de insumo no estoque e atualiza a quantidade atual do ingrediente."""
    ingrediente = db.query(Ingrediente).filter(Ingrediente.id == dados.ingrediente_id).first()
    if not ingrediente:
        raise HTTPException(status_code=404, detail="Ingrediente nao encontrado")

    # Registra a movimentacao
    mov = MovimentacaoEstoque(
        ingrediente_id=dados.ingrediente_id,
        tipo="entrada",
        quantidade=dados.quantidade,
        observacao=dados.observacao,
        criado_em=datetime.utcnow()
    )
    db.add(mov)

    # Atualiza o estoque atual
    ingrediente.estoque_atual = round(ingrediente.estoque_atual + dados.quantidade, 3)
    db.commit()
    db.refresh(mov)

    return MovimentacaoResponse(
        id=mov.id,
        ingrediente_id=ingrediente.id,
        ingrediente_nome=ingrediente.nome,
        tipo=mov.tipo,
        quantidade=mov.quantidade,
        observacao=mov.observacao,
        criado_em=mov.criado_em
    )


@app.post("/estoque/saida", response_model=MovimentacaoResponse, status_code=201, summary="Registrar saida de insumo")
def saida_estoque(dados: MovimentacaoCreate, db: Session = Depends(get_db)):
    """Registra saida de insumo do estoque. Nao permite estoque negativo."""
    ingrediente = db.query(Ingrediente).filter(Ingrediente.id == dados.ingrediente_id).first()
    if not ingrediente:
        raise HTTPException(status_code=404, detail="Ingrediente nao encontrado")

    if ingrediente.estoque_atual < dados.quantidade:
        raise HTTPException(
            status_code=400,
            detail=f"Estoque insuficiente. Disponivel: {ingrediente.estoque_atual} {ingrediente.unidade_medida}"
        )

    # Registra a movimentacao
    mov = MovimentacaoEstoque(
        ingrediente_id=dados.ingrediente_id,
        tipo="saida",
        quantidade=dados.quantidade,
        observacao=dados.observacao,
        criado_em=datetime.utcnow()
    )
    db.add(mov)

    # Atualiza o estoque atual
    ingrediente.estoque_atual = round(ingrediente.estoque_atual - dados.quantidade, 3)
    db.commit()
    db.refresh(mov)

    return MovimentacaoResponse(
        id=mov.id,
        ingrediente_id=ingrediente.id,
        ingrediente_nome=ingrediente.nome,
        tipo=mov.tipo,
        quantidade=mov.quantidade,
        observacao=mov.observacao,
        criado_em=mov.criado_em
    )


@app.get("/estoque/movimentacoes", response_model=List[MovimentacaoResponse], summary="Historico de movimentacoes")
def historico_movimentacoes(db: Session = Depends(get_db)):
    """Retorna o historico completo de entradas e saidas do estoque."""
    movs = db.query(MovimentacaoEstoque).order_by(MovimentacaoEstoque.criado_em.desc()).all()
    resultado = []
    for m in movs:
        resultado.append(MovimentacaoResponse(
            id=m.id,
            ingrediente_id=m.ingrediente_id,
            ingrediente_nome=m.ingrediente.nome,
            tipo=m.tipo,
            quantidade=m.quantidade,
            observacao=m.observacao,
            criado_em=m.criado_em
        ))
    return resultado


# ==========================================
# 6. DASHBOARD CONSOLIDADO (Entrega Final)
# ==========================================

@app.get("/dashboard", response_model=DashboardResponse, summary="Dashboard consolidado de KPIs")
def dashboard(db: Session = Depends(get_db)):
    """
    Retorna os principais indicadores do negocio:
    total de produtos, custos medios, margens, estoque e receita potencial.
    """
    produtos_ativos = db.query(Produto).filter(Produto.ativo == True).all()
    total_produtos = len(produtos_ativos)
    total_ingredientes = db.query(Ingrediente).count()

    custos = []
    margens = []
    receita_potencial = 0.0
    lucro_potencial = 0.0

    for p in produtos_ativos:
        custo = calcular_custo_produto(p)
        lucro = round(p.preco_venda - custo, 2)
        margem = round((lucro / p.preco_venda * 100), 1) if p.preco_venda > 0 else 0.0
        custos.append(custo)
        margens.append(margem)
        receita_potencial += p.preco_venda
        lucro_potencial += lucro

    custo_medio = round(sum(custos) / len(custos), 2) if custos else 0.0
    margem_media = round(sum(margens) / len(margens), 1) if margens else 0.0

    # Conta ingredientes com estoque baixo ou critico
    ingredientes_todos = db.query(Ingrediente).all()
    estoque_baixo = sum(
        1 for ing in ingredientes_todos
        if ing.estoque_atual < ing.estoque_minimo
    )

    return DashboardResponse(
        total_produtos_ativos=total_produtos,
        custo_medio_producao=custo_medio,
        margem_media_percentual=margem_media,
        total_ingredientes=total_ingredientes,
        ingredientes_estoque_baixo=estoque_baixo,
        receita_potencial_total=round(receita_potencial, 2),
        lucro_potencial_total=round(lucro_potencial, 2)
    )
