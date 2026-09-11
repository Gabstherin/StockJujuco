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
    from models import Produto
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        if db.query(Produto).count() == 0:
            produtos_iniciais = [
                Produto(
                    nome="Brownie",
                    sabor="Chocolate Tradicional",
                    categoria="Brownie",
                    preco_venda=12.00,
                    descricao="Brownie artesanal de chocolate belga com casca crocante e interior cremoso.",
                    ativo=True,
                    criado_em=datetime.utcnow(),
                ),
                Produto(
                    nome="Brownie",
                    sabor="Caramelo Salgado",
                    categoria="Brownie",
                    preco_venda=14.00,
                    descricao="Brownie artesanal com recheio de caramelo salgado irresistivel.",
                    ativo=True,
                    criado_em=datetime.utcnow(),
                ),
                Produto(
                    nome="Brownie",
                    sabor="Chocolate com Amendoim",
                    categoria="Brownie",
                    preco_venda=13.00,
                    descricao="Brownie artesanal de chocolate com amendoim crocante.",
                    ativo=True,
                    criado_em=datetime.utcnow(),
                ),
            ]
            db.add_all(produtos_iniciais)
            db.commit()
            print("Banco inicializado com os 3 brownies da Juju Co.")
        else:
            print("Banco ja possui dados. Seed ignorado.")
    finally:
        db.close()
