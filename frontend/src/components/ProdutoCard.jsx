import { useNavigate } from 'react-router-dom'

export default function ProdutoCard({ produto }) {
  const navigate = useNavigate()
  const formatPreco = (preco) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco || 0)

  return (
    <div className="produto-card">
      <div className="produto-card-header">
        <div>
          <div className="produto-nome">{produto.nome}</div>
          <div className="produto-sabor">{produto.sabor}</div>
        </div>
        <span className="produto-categoria-badge">{produto.categoria}</span>
      </div>

      {produto.descricao && (
        <p className="produto-descricao">{produto.descricao}</p>
      )}

      {/* Metricas de Custo e Margem (AC03) */}
      <div className="finance-metrics">
        <div className="metric-col">
          <span>Custo Insumos</span>
          <strong>{formatPreco(produto.custo_producao)}</strong>
        </div>
        <div className="metric-col">
          <span>Lucro Bruto</span>
          <strong className="lucro">{formatPreco(produto.margem_lucro_reais)}</strong>
        </div>
        <div className="metric-col">
          <span>Margem</span>
          <strong style={{ color: 'var(--rosa-primario)' }}>{produto.margem_lucro_percentual || 0}%</strong>
        </div>
      </div>

      <div className="produto-card-footer">
        <span className="produto-preco">{formatPreco(produto.preco_venda)}</span>
        <button 
          className="btn-outline-sm"
          onClick={() => navigate(`/precificacao?id=${produto.id}`)}
        >
          Ficha & Precificação
        </button>
      </div>
    </div>
  )
}
