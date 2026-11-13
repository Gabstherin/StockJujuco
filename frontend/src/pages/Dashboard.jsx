import { useState, useEffect } from 'react'

const API_BASE_URL = 'http://127.0.0.1:8000'

export default function Dashboard() {
  const [metricas, setMetricas] = useState(null)
  const [resumoProdutos, setResumoProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [resDash, resPrec] = await Promise.all([
          fetch(`${API_BASE_URL}/dashboard`),
          fetch(`${API_BASE_URL}/precificacao/resumo`)
        ])
        if (resDash.ok) setMetricas(await resDash.json())
        if (resPrec.ok) setResumoProdutos(await resPrec.json())
      } catch {
        setErro('Erro ao carregar dados do dashboard.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="container" style={{ padding: '2rem 0' }}>Carregando Dashboard...</div>
  if (erro) return <div className="container" style={{ padding: '2rem 0' }}><div className="alert alert-danger">{erro}</div></div>

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 className="page-title">Dashboard Executivo</h1>
      <p className="page-subtitle">Indicadores consolidados de desempenho, custos e estoque da Juju Co.</p>

      {metricas && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #E91E8C' }}>
            <h3 style={{ fontSize: '2rem', color: '#E91E8C', margin: 0 }}>{metricas.total_produtos_ativos}</h3>
            <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem' }}>Produtos Ativos</p>
          </div>
          <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #5A9B6F' }}>
            <h3 style={{ fontSize: '2rem', color: '#5A9B6F', margin: 0 }}>{metricas.margem_media_percentual}%</h3>
            <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem' }}>Margem Média</p>
          </div>
          <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #FF5722' }}>
            <h3 style={{ fontSize: '2rem', color: '#FF5722', margin: 0 }}>{metricas.ingredientes_estoque_baixo}</h3>
            <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem' }}>Insumos em Estoque Baixo</p>
          </div>
          <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #E91E8C' }}>
            <h3 style={{ fontSize: '2rem', color: '#E91E8C', margin: 0 }}>R$ {metricas.custo_medio_producao.toFixed(2)}</h3>
            <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem' }}>Custo Médio CPV</p>
          </div>
          <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #5A9B6F' }}>
            <h3 style={{ fontSize: '2rem', color: '#5A9B6F', margin: 0 }}>R$ {metricas.receita_potencial_total.toFixed(2)}</h3>
            <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem' }}>Receita Potencial</p>
          </div>
          <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #5A9B6F' }}>
            <h3 style={{ fontSize: '2rem', color: '#5A9B6F', margin: 0 }}>R$ {metricas.lucro_potencial_total.toFixed(2)}</h3>
            <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem' }}>Lucro Bruto Total</p>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Rentabilidade por Produto</h2>
        <table className="table" style={{ width: '100%', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Preço de Venda</th>
              <th>Custo (CPV)</th>
              <th>Lucro Bruto</th>
              <th>Margem</th>
            </tr>
          </thead>
          <tbody>
            {resumoProdutos.map(p => (
              <tr key={p.produto_id}>
                <td><strong>{p.nome}</strong></td>
                <td>R$ {p.preco_venda.toFixed(2)}</td>
                <td>R$ {p.custo_producao.toFixed(2)}</td>
                <td>R$ {p.lucro_bruto.toFixed(2)}</td>
                <td>
                  <span className={`badge badge-${p.margem_percentual >= 50 ? 'excelente' : p.margem_percentual >= 35 ? 'saudavel' : 'critico'}`}>
                    {p.margem_percentual}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
