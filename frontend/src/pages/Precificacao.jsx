import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

export default function Precificacao() {
  const location = useLocation()
  const [produtos, setProdutos] = useState([])
  const [ingredientes, setIngredientes] = useState([])
  const [produtoId, setProdutoId] = useState(null)
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showItemModal, setShowItemModal] = useState(false)
  const [margemSlider, setMargemSlider] = useState(60)
  const [toast, setToast] = useState('')
  const [novoItem, setNovoItem] = useState({ ingrediente_id: '', quantidade_utilizada: '' })

  const formatPreco = (val) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)

  useEffect(() => {
    async function init() {
      try {
        const [resP, resI] = await Promise.all([
          axios.get(`${API_URL}/produtos`),
          axios.get(`${API_URL}/ingredientes`)
        ])
        setProdutos(resP.data)
        setIngredientes(resI.data)

        const queryParams = new URLSearchParams(location.search)
        const paramId = queryParams.get('id')
        const targetId = paramId || (resP.data.length > 0 ? resP.data[0].id : null)

        if (targetId) {
          setProdutoId(targetId)
          carregarDados(targetId)
        }
      } catch (err) {
        console.error(err)
      }
    }
    init()
  }, [location.search])

  const carregarDados = async (id) => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/produtos/${id}/precificacao`)
      setDados(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectProduto = (e) => {
    const id = e.target.value
    setProdutoId(id)
    carregarDados(id)
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/produtos/${produtoId}/receita`, {
        ingrediente_id: parseInt(novoItem.ingrediente_id),
        quantidade_utilizada: parseFloat(novoItem.quantidade_utilizada)
      })
      setShowItemModal(false)
      setNovoItem({ ingrediente_id: '', quantidade_utilizada: '' })
      setToast('Ingrediente adicionado à receita!')
      setTimeout(() => setToast(''), 3500)
      carregarDados(produtoId)
    } catch (err) {
      alert('Erro ao adicionar ingrediente')
    }
  }

  const handleRemoverItem = async (itemId) => {
    if (!confirm('Remover este item da receita?')) return
    try {
      await axios.delete(`${API_URL}/receita-itens/${itemId}`)
      setToast('Item removido da receita.')
      setTimeout(() => setToast(''), 3500)
      carregarDados(produtoId)
    } catch (err) {
      alert('Erro ao remover')
    }
  }

  // Simulacao de preco sugerido: Preco = Custo / (1 - (Margem / 100))
  const custoTotal = dados ? dados.custo_total_producao : 0
  const precoSugerido = custoTotal > 0 ? custoTotal / (1 - (margemSlider / 100)) : 0
  const lucroProjetado = precoSugerido - custoTotal

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Custos & <span>Precificação</span></h1>
          <p className="page-count">Ficha técnica da receita, custo de produção e simulador de preços (AC03)</p>
        </div>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, marginRight: '8px' }}>Produto:</label>
          <select 
            className="select-produto"
            value={produtoId || ''}
            onChange={handleSelectProduto}
          >
            {produtos.map(p => (
              <option key={p.id} value={p.id}>{p.nome} - {p.sabor} ({formatPreco(p.preco_venda)})</option>
            ))}
          </select>
        </div>
      </div>

      {loading || !dados ? (
        <div className="loading-container"><div className="spinner"></div></div>
      ) : (
        <>
          {/* KPIS */}
          <div className="kpi-grid">
            <div className="kpi-card" style={{ borderTopColor: 'var(--rosa-primario)' }}>
              <div className="kpi-title">Preço de Venda Praticado</div>
              <div className="kpi-value rosa">{formatPreco(dados.preco_venda_atual)}</div>
              <div className="kpi-sub">{dados.categoria} • {dados.produto_sabor}</div>
            </div>
            <div className="kpi-card" style={{ borderTopColor: '#FF9800' }}>
              <div className="kpi-title">Custo de Produção (CPV)</div>
              <div className="kpi-value" style={{ color: '#E65100' }}>{formatPreco(dados.custo_total_producao)}</div>
              <div className="kpi-sub">{dados.itens_receita.length} ingrediente(s) na receita</div>
            </div>
            <div className="kpi-card" style={{ borderTopColor: '#4CAF50' }}>
              <div className="kpi-title">Lucro Bruto Unitário</div>
              <div className="kpi-value verde">{formatPreco(dados.lucro_bruto_unitario)}</div>
              <div className="kpi-sub">Lucro por unidade vendida</div>
            </div>
            <div className="kpi-card" style={{ borderTopColor: '#2196F3' }}>
              <div className="kpi-title">Margem de Lucro Real</div>
              <div className="kpi-value" style={{ color: '#0D47A1' }}>{dados.margem_lucro_percentual}%</div>
              <div className="kpi-sub">Situação: {dados.situacao_margem}</div>
            </div>
          </div>

          {/* FICHA TECNICA */}
          <div className="section-card">
            <div className="section-title">
              <span>Ficha Técnica / Receita</span>
              <button className="btn-outline" onClick={() => setShowItemModal(true)}>+ Adicionar Ingrediente</button>
            </div>
            <table className="app-table">
              <thead>
                <tr>
                  <th>Ingrediente</th>
                  <th>Quantidade Utilizada</th>
                  <th>Custo Unitário</th>
                  <th>Custo no Produto</th>
                  <th>% do Custo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {dados.itens_receita.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem' }}>Nenhum ingrediente adicionado.</td></tr>
                ) : (
                  dados.itens_receita.map(item => {
                    const pct = dados.custo_total_producao > 0 
                      ? ((item.custo_total_item / dados.custo_total_producao) * 100).toFixed(1) 
                      : 0
                    return (
                      <tr key={item.id}>
                        <td><strong>{item.ingrediente_nome}</strong></td>
                        <td>{item.quantidade_utilizada} {item.unidade_medida}</td>
                        <td>R$ {item.custo_unitario.toFixed(4)} / {item.unidade_medida}</td>
                        <td><strong style={{ color: 'var(--rosa-primario)' }}>{formatPreco(item.custo_total_item)}</strong></td>
                        <td><span style={{ fontSize: '0.8rem', color: '#777' }}>{pct}%</span></td>
                        <td>
                          <button className="btn-danger-outline" onClick={() => handleRemoverItem(item.id)}>Remover</button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* SIMULADOR DE MARGEM (AC03) */}
          <div className="section-card">
            <div className="section-title">
              <span>Simulador Interativo de Preço Sugerido (AC03)</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--cinza-texto)' }}>
              Ajuste a margem de lucro desejada para calcular o preço sugerido do produto:
            </p>
            <div className="simulador-box">
              <div className="sim-slider-row">
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Margem Desejada:</span>
                <input 
                  type="range"
                  min="20"
                  max="85"
                  step="5"
                  value={margemSlider}
                  onChange={(e) => setMargemSlider(parseInt(e.target.value))}
                  className="sim-slider"
                />
                <span className="sim-margem-label">{margemSlider}%</span>
              </div>
              <div className="sim-results">
                <div className="sim-res-item">
                  <span>Preço Sugerido</span>
                  <strong>{formatPreco(precoSugerido)}</strong>
                </div>
                <div className="sim-res-item">
                  <span>Lucro Projetado</span>
                  <strong style={{ color: '#2E7D32' }}>{formatPreco(lucroProjetado)}</strong>
                </div>
                <div className="sim-res-item">
                  <span>Preço Praticado</span>
                  <strong style={{ color: '#555' }}>{formatPreco(dados.preco_venda_atual)}</strong>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODAL ADICIONAR ITEM NA RECEITA */}
      {showItemModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowItemModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>Adicionar à Receita</h2>
              <button className="modal-close" onClick={() => setShowItemModal(false)}>✕</button>
            </div>
            <form className="form" onSubmit={handleAddItem}>
              <div className="form-group">
                <label>Ingrediente <span className="required">*</span></label>
                <select 
                  className="form-control"
                  required
                  value={novoItem.ingrediente_id}
                  onChange={(e) => setNovoItem({ ...novoItem, ingrediente_id: e.target.value })}
                >
                  <option value="">Selecione um ingrediente</option>
                  {ingredientes.map(ing => (
                    <option key={ing.id} value={ing.id}>
                      {ing.nome} (R$ {ing.custo_unitario.toFixed(4)} / {ing.unidade_medida})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Quantidade Utilizada <span className="required">*</span></label>
                <input 
                  className="form-control"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="Ex: 35"
                  value={novoItem.quantidade_utilizada}
                  onChange={(e) => setNovoItem({ ...novoItem, quantidade_utilizada: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowItemModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Adicionar à Receita</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="toast">✅ {toast}</div>}
    </div>
  )
}
