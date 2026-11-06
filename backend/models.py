from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nome = Column(String(100), nullable=False)
    sabor = Column(String(100), nullable=False)
    categoria = Column(String(50), nullable=False)
    preco_venda = Column(Float, nullable=False)
    descricao = Column(Text, nullable=True)
    ativo = Column(Boolean, default=True, nullable=False)
    criado_em = Column(DateTime, default=datetime.utcnow, nullable=False)

    receita_itens = relationship("ReceitaItem", back_populates="produto", cascade="all, delete-orphan")


class Ingrediente(Base):
    __tablename__ = "ingredientes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nome = Column(String(100), nullable=False)
    unidade_medida = Column(String(20), nullable=False)  # 'g', 'ml', 'un'
    preco_compra = Column(Float, nullable=False)          # Preço pago na embalagem (R$)
    quantidade_compra = Column(Float, nullable=False)     # Quantidade total da embalagem (ex: 1000g)
    custo_unitario = Column(Float, nullable=False)        # Preço por unidade de medida (R$/g, R$/ml, etc)
    criado_em = Column(DateTime, default=datetime.utcnow, nullable=False)

    receita_itens = relationship("ReceitaItem", back_populates="ingrediente", cascade="all, delete-orphan")


class ReceitaItem(Base):
    __tablename__ = "receita_itens"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=False)
    ingrediente_id = Column(Integer, ForeignKey("ingredientes.id"), nullable=False)
    quantidade_utilizada = Column(Float, nullable=False)  # Quantidade usada na receita (ex: 50g)

    produto = relationship("Produto", back_populates="receita_itens")
    ingrediente = relationship("Ingrediente", back_populates="receita_itens")

