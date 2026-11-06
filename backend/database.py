from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./stockjujuco.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from models import Produto, Ingrediente, ReceitaItem
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. Seed de Produtos
        if db.query(Produto).count() == 0:
            produtos_iniciais = [
                Produto(
                    nome="Brownie",
                    sabor="Chocolate Tradicional",
                    categoria="Brownie",
                    preco_venda=12.00,
                    descricao="Brownie artesanal de chocolate nobre com casquinha crocante e interior cremoso.",
                    ativo=True,
                    criado_em=datetime.utcnow(),
                ),
                Produto(
                    nome="Brownie",
                    sabor="Caramelo Salgado",
                    categoria="Brownie",
                    preco_venda=14.00,
                    descricao="Brownie artesanal com recheio cremoso de caramelo salgado.",
                    ativo=True,
                    criado_em=datetime.utcnow(),
                ),
                Produto(
                    nome="Brownie",
                    sabor="Chocolate com Amendoim",
                    categoria="Brownie",
                    preco_venda=13.00,
                    descricao="Brownie artesanal de chocolate com amendoim torrado crocante.",
                    ativo=True,
                    criado_em=datetime.utcnow(),
                ),
            ]
            db.add_all(produtos_iniciais)
            db.commit()
            print("Produtos iniciais criados.")

        # 2. Seed de Ingredientes (AC02)
        if db.query(Ingrediente).count() == 0:
            ingredientes_iniciais = [
                Ingrediente(
                    nome="Chocolate Nobre 50%",
                    unidade_medida="g",
                    preco_compra=48.00,
                    quantidade_compra=1000.0,
                    custo_unitario=round(48.00 / 1000.0, 4),
                    criado_em=datetime.utcnow(),
                ),
                Ingrediente(
                    nome="Manteiga sem Sal",
                    unidade_medida="g",
                    preco_compra=22.00,
                    quantidade_compra=500.0,
                    custo_unitario=round(22.00 / 500.0, 4),
                    criado_em=datetime.utcnow(),
                ),
                Ingrediente(
                    nome="Acucar Cristal",
                    unidade_medida="g",
                    preco_compra=5.50,
                    quantidade_compra=1000.0,
                    custo_unitario=round(5.50 / 1000.0, 4),
                    criado_em=datetime.utcnow(),
                ),
                Ingrediente(
                    nome="Ovos Caipiras",
                    unidade_medida="un",
                    preco_compra=14.00,
                    quantidade_compra=12.0,
                    custo_unitario=round(14.00 / 12.0, 4),
                    criado_em=datetime.utcnow(),
                ),
                Ingrediente(
                    nome="Farinha de Trigo Especial",
                    unidade_medida="g",
                    preco_compra=6.00,
                    quantidade_compra=1000.0,
                    custo_unitario=round(6.00 / 1000.0, 4),
                    criado_em=datetime.utcnow(),
                ),
                Ingrediente(
                    nome="Caramelo Salgado Artesanal",
                    unidade_medida="g",
                    preco_compra=24.00,
                    quantidade_compra=400.0,
                    custo_unitario=round(24.00 / 400.0, 4),
                    criado_em=datetime.utcnow(),
                ),
                Ingrediente(
                    nome="Amendoim Torrado Granulado",
                    unidade_medida="g",
                    preco_compra=12.00,
                    quantidade_compra=500.0,
                    custo_unitario=round(12.00 / 500.0, 4),
                    criado_em=datetime.utcnow(),
                ),
            ]
            db.add_all(ingredientes_iniciais)
            db.commit()
            print("Ingredientes iniciais cadastrados.")

        # 3. Seed de Receitas dos Brownies (AC02 / AC03)
        if db.query(ReceitaItem).count() == 0:
            choc = db.query(Ingrediente).filter_by(nome="Chocolate Nobre 50%").first()
            mant = db.query(Ingrediente).filter_by(nome="Manteiga sem Sal").first()
            acuc = db.query(Ingrediente).filter_by(nome="Acucar Cristal").first()
            ovo = db.query(Ingrediente).filter_by(nome="Ovos Caipiras").first()
            farin = db.query(Ingrediente).filter_by(nome="Farinha de Trigo Especial").first()
            caram = db.query(Ingrediente).filter_by(nome="Caramelo Salgado Artesanal").first()
            amend = db.query(Ingrediente).filter_by(nome="Amendoim Torrado Granulado").first()

            brownie_trad = db.query(Produto).filter_by(sabor="Chocolate Tradicional").first()
            brownie_caram = db.query(Produto).filter_by(sabor="Caramelo Salgado").first()
            brownie_amend = db.query(Produto).filter_by(sabor="Chocolate com Amendoim").first()

            receitas = []

            # Receita do Brownie Tradicional
            if brownie_trad and choc and mant and acuc and ovo and farin:
                receitas.extend([
                    ReceitaItem(produto_id=brownie_trad.id, ingrediente_id=choc.id, quantidade_utilizada=50.0),
                    ReceitaItem(produto_id=brownie_trad.id, ingrediente_id=mant.id, quantidade_utilizada=25.0),
                    ReceitaItem(produto_id=brownie_trad.id, ingrediente_id=acuc.id, quantidade_utilizada=30.0),
                    ReceitaItem(produto_id=brownie_trad.id, ingrediente_id=ovo.id, quantidade_utilizada=0.5),
                    ReceitaItem(produto_id=brownie_trad.id, ingrediente_id=farin.id, quantidade_utilizada=20.0),
                ])

            # Receita do Brownie Caramelo Salgado
            if brownie_caram and choc and mant and acuc and ovo and farin and caram:
                receitas.extend([
                    ReceitaItem(produto_id=brownie_caram.id, ingrediente_id=choc.id, quantidade_utilizada=50.0),
                    ReceitaItem(produto_id=brownie_caram.id, ingrediente_id=mant.id, quantidade_utilizada=25.0),
                    ReceitaItem(produto_id=brownie_caram.id, ingrediente_id=acuc.id, quantidade_utilizada=25.0),
                    ReceitaItem(produto_id=brownie_caram.id, ingrediente_id=ovo.id, quantidade_utilizada=0.5),
                    ReceitaItem(produto_id=brownie_caram.id, ingrediente_id=farin.id, quantidade_utilizada=20.0),
                    ReceitaItem(produto_id=brownie_caram.id, ingrediente_id=caram.id, quantidade_utilizada=30.0),
                ])

            # Receita do Brownie Chocolate com Amendoim
            if brownie_amend and choc and mant and acuc and ovo and farin and amend:
                receitas.extend([
                    ReceitaItem(produto_id=brownie_amend.id, ingrediente_id=choc.id, quantidade_utilizada=50.0),
                    ReceitaItem(produto_id=brownie_amend.id, ingrediente_id=mant.id, quantidade_utilizada=25.0),
                    ReceitaItem(produto_id=brownie_amend.id, ingrediente_id=acuc.id, quantidade_utilizada=25.0),
                    ReceitaItem(produto_id=brownie_amend.id, ingrediente_id=ovo.id, quantidade_utilizada=0.5),
                    ReceitaItem(produto_id=brownie_amend.id, ingrediente_id=farin.id, quantidade_utilizada=20.0),
                    ReceitaItem(produto_id=brownie_amend.id, ingrediente_id=amend.id, quantidade_utilizada=25.0),
                ])

            if receitas:
                db.add_all(receitas)
                db.commit()
                print("Receitas iniciais associadas com sucesso.")

        print("Inicializacao do banco concluida.")
    finally:
        db.close()
