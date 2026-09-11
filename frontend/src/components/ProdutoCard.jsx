export default function ProdutoCard({ produto }) {
  const formatPreco = (preco) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco)

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

      <div className="produto-card-footer">
        <span className="produto-preco">{formatPreco(produto.preco_venda)}</span>
        <div className="produto-status">
          <span className={`status-dot ${produto.ativo ? 'ativo' : 'inativo'}`}></span>
          <span className={`status-label ${produto.ativo ? 'ativo' : 'inativo'}`}>
            {produto.ativo ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>
    </div>
  )
}
