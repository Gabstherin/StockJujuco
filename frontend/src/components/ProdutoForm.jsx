import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

const CATEGORIAS = ['Brownie', 'Bolo', 'Brigadeiro', 'Cookie', 'Trufa', 'Outro']

const initialState = {
  nome: '',
  sabor: '',
  categoria: 'Brownie',
  preco_venda: '',
  descricao: '',
  ativo: true,
}

export default function ProdutoForm({ onClose, onSuccess }) {
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório'
    if (!form.sabor.trim()) e.sabor = 'Sabor é obrigatório'
    if (!form.categoria) e.categoria = 'Categoria é obrigatória'
    if (form.preco_venda === '' || isNaN(Number(form.preco_venda)))
      e.preco_venda = 'Informe um preço válido'
    else if (Number(form.preco_venda) < 0)
      e.preco_venda = 'Preço não pode ser negativo'
    return e
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setServerError('')

    try {
      await axios.post(`${API_URL}/produtos`, {
        ...form,
        preco_venda: parseFloat(form.preco_venda),
      })
      onSuccess()
      onClose()
    } catch (err) {
      setServerError(
        err.response?.data?.detail || 'Erro ao cadastrar produto. Verifique se o servidor está ativo.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>🍫 Novo Produto</h2>
          <button className="modal-close" onClick={onClose} disabled={loading}>✕</button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {serverError && <div className="error-banner">⚠️ {serverError}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Nome <span className="required">*</span></label>
              <input
                className={`form-control ${errors.nome ? 'error' : ''}`}
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex: Brownie"
                maxLength={100}
              />
              {errors.nome && <span className="field-error">{errors.nome}</span>}
            </div>

            <div className="form-group">
              <label>Sabor <span className="required">*</span></label>
              <input
                className={`form-control ${errors.sabor ? 'error' : ''}`}
                name="sabor"
                value={form.sabor}
                onChange={handleChange}
                placeholder="Ex: Caramelo Salgado"
                maxLength={100}
              />
              {errors.sabor && <span className="field-error">{errors.sabor}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Categoria <span className="required">*</span></label>
              <select
                className={`form-control ${errors.categoria ? 'error' : ''}`}
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
              >
                {CATEGORIAS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.categoria && <span className="field-error">{errors.categoria}</span>}
            </div>

            <div className="form-group">
              <label>Preço de Venda (R$) <span className="required">*</span></label>
              <input
                className={`form-control ${errors.preco_venda ? 'error' : ''}`}
                name="preco_venda"
                value={form.preco_venda}
                onChange={handleChange}
                placeholder="Ex: 12.00"
                type="number"
                min="0"
                step="0.01"
              />
              {errors.preco_venda && <span className="field-error">{errors.preco_venda}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              className="form-control"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descrição breve do produto (opcional)"
              rows={3}
            />
          </div>

          <label className="form-check">
            <input
              type="checkbox"
              name="ativo"
              checked={form.ativo}
              onChange={handleChange}
            />
            <span>Produto ativo</span>
          </label>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : '✓ Salvar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
