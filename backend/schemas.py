from pydantic import BaseModel, Field
from typing import Optional, List, Dict
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
    custo_producao: Optional[float] = None
    margem_lucro_reais: Optional[float] = None
    margem_lucro_percentual: Optional[float] = None

    model_config = {"from_attributes": True}


# --- INGREDIENTES (AC02) ---

class IngredienteCreate(BaseModel):
    nome: str = Field(..., min_length=1, max_length=100, description="Nome do ingrediente")
    unidade_medida: str = Field(..., description="Unidade: g, ml, un")
    preco_compra: float = Field(..., gt=0, description="Preco total pago na embalagem")
    quantidade_compra: float = Field(..., gt=0, description="Quantidade da embalagem comprada")


class IngredienteResponse(BaseModel):
    id: int
    nome: str
    unidade_medida: str
    preco_compra: float
    quantidade_compra: float
    custo_unitario: float
    criado_em: datetime

    model_config = {"from_attributes": True}


# --- RECEITA (AC02) ---

class ReceitaItemCreate(BaseModel):
    ingrediente_id: int = Field(..., description="ID do ingrediente")
    quantidade_utilizada: float = Field(..., gt=0, description="Quantidade usada no produto")


class ReceitaItemResponse(BaseModel):
    id: int
    produto_id: int
    ingrediente_id: int
    ingrediente_nome: str
    unidade_medida: str
    quantidade_utilizada: float
    custo_unitario: float
    custo_total_item: float

    model_config = {"from_attributes": True}


# --- CUSTOS E PRECIFICACAO (AC03) ---

class PrecoSugerido(BaseModel):
    margem_alvo_percentual: float
    preco_sugerido: float
    lucro_projetado: float


class PrecificacaoResponse(BaseModel):
    produto_id: int
    produto_nome: str
    produto_sabor: str
    categoria: str
    preco_venda_atual: float
    custo_total_producao: float
    lucro_bruto_unitario: float
    margem_lucro_percentual: float
    situacao_margem: str  # 'excelente', 'saudavel', 'baixa', 'prejuizo'
    itens_receita: List[ReceitaItemResponse]
    precos_sugeridos: List[PrecoSugerido]

