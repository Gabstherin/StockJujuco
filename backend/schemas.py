from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ProdutoCreate(BaseModel):
    nome: str = Field(..., min_length=1, max_length=100, description="Nome do produto")
    sabor: str = Field(..., min_length=1, max_length=100, description="Sabor do produto")
    categoria: str = Field(..., min_length=1, max_length=50, description="Categoria do produto")
    preco_venda: float = Field(..., ge=0, description="Preco de venda (>= 0)")
    descricao: Optional[str] = Field(None, description="Descricao opcional")
    ativo: bool = Field(True, description="Se o produto esta ativo")


class ProdutoResponse(BaseModel):
    id: int
    nome: str
    sabor: str
    categoria: str
    preco_venda: float
    descricao: Optional[str]
    ativo: bool
    criado_em: datetime

    model_config = {"from_attributes": True}
