import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

export default function Ingredientes() {
  const [ingredientes, setIngredientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState({
    nome: '',
    unidade_medida: 'g',
    preco_compra: '',
    quantidade_compra: ''
  })

  const formatPreco = (val) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)

  const carregarIngredientes = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/ingredientes`)
      setIngredientes(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarIngredientes()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/ingredientes`, {
        nome: form.nome,
        unidade_medida: form.unidade_medida,
        preco_compra: parseFloat(form.preco_compra),
        quantidade_compra: parseFloat(form.quantidade_compra)
      })
      setShowModal(false)
      setForm({ nome: '', unidade_medida: 'g', preco_compra: '', quantidade_compra: '' })
      setToast('Ingrediente cadastrado com sucesso!')
      setTimeout(() => setToast(''), 3500)
      carregarIngredientes()
    } catch (err) {
      alert('Erro ao cadastrar ingrediente')
    }
  }

  const handleExcluir = async (id) => {
    if (!confirm('Deseja excluir este ingrediente?')) return
    try {
      await axios.delete(`${API_URL}/ingredientes/${id}`)
      setToast('Ingrediente excluído.')
      setTimeout(() => setToast(''), 3500)
      carregarIngredientes()
    } catch (err) {
      alert('Erro ao excluir')
    }
  }

  const custoPrevisto = form.preco_compra && form.quantidade_compra
    ? (parseFloat(form.preco_compra) / parseFloat(form.quantidade_compra)).toFixed(4)
    : '0,0000'

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title"><span>Ingredientes</span> & Insumos</h1>
          <p className="page-count">{ingredientes.length} insumos cadastrados (AC02)</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Novo Ingrediente</button>
      </div>

      <div className="table-card">
        <table className="app-table">
          <thead>
            <tr>
              <th>Ingrediente</th>
              <th>Unidade</th>
              <th>Preço Embalagem</th>
              <th>Qtd Embalagem</th>
              <th>Custo Unitário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</td></tr>
            ) : ingredientes.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Nenhum ingrediente cadastrado.</td></tr>
            ) : (
              ingredientes.map(ing => (
                <tr key={ing.id}>
                  <td><strong>{ing.nome}</strong></td>
                  <td><span className="badge-unit">{ing.unidade_medida}</span></td>
                  <td>{formatPreco(ing.preco_compra)}</td>
                  <td>{ing.quantidade_compra} {ing.unidade_medida}</td>
                  <td><strong style={{ color: 'var(--rosa-primario)' }}>R$ {ing.custo_unitario.toFixed(4)} / {ing.unidade_medida}</strong></td>
                  <td>
                    <button className="btn-danger-outline" onClick={() => handleExcluir(ing.id)}>Excluir</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>Novo Ingrediente</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome do Ingrediente <span className="required">*</span></label>
                <input 
                  className="form-control"
                  placeholder="Ex: Doce de Leite Artesanal"
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Unidade de Medida</label>
                  <select 
                    className="form-control"
                    value={form.unidade_medida}
                    onChange={(e) => setForm({ ...form, unidade_medida: e.target.value })}
                  >
                    <option value="g">Gramas (g)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="un">Unidade (un)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Preço Pago (R$) <span className="required">*</span></label>
                  <input 
                    className="form-control"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="Ex: 24.00"
                    value={form.preco_compra}
                    onChange={(e) => setForm({ ...form, preco_compra: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Tamanho da Embalagem <span className="required">*</span></label>
                <input 
                  className="form-control"
                  type="number"
                  step="0.1"
                  min="0.01"
                  required
                  placeholder="Ex: 500"
                  value={form.quantidade_compra}
                  onChange={(e) => setForm({ ...form, quantidade_compra: e.target.value })}
                />
              </div>

              <div className="cost-preview-box">
                <span>Custo Unitário Calculado: </span>
                <strong>R$ {custoPrevisto} / {form.unidade_medida}</strong>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Ingrediente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="toast">✅ {toast}</div>}
    </div>
  )
}
