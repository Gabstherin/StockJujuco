import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import ProdutoCard from '../components/ProdutoCard'
import ProdutoForm from '../components/ProdutoForm'

const API_URL = 'http://localhost:8000'

export default function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState('')

  const fetchProdutos = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const res = await axios.get(`${API_URL}/produtos`)
      setProdutos(res.data)
    } catch {
      setError('Nao foi possivel carregar os produtos. Verifique se o servidor esta ativo em http://localhost:8000')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProdutos()
  }, [fetchProdutos])

  const handleSuccess = () => {
    fetchProdutos()
    setToast('Produto cadastrado com sucesso!')
    setTimeout(() => setToast(''), 4000)
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Catálogo</span> de Produtos
          </h1>
          <p className="page-count">
            {loading ? 'Carregando...' : `${produtos.length} produto${produtos.length !== 1 ? 's' : ''} cadastrado${produtos.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Novo Produto
        </button>
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando produtos...</p>
        </div>
      ) : produtos.length === 0 && !error ? (
        <div className="empty-state">
          <div className="empty-state-icon">🍰</div>
          <h3>Nenhum produto cadastrado ainda</h3>
          <p>Clique em "Novo Produto" para começar!</p>
        </div>
      ) : (
        <div className="produtos-grid">
          {produtos.map(produto => (
            <ProdutoCard key={produto.id} produto={produto} />
          ))}
        </div>
      )}

      {showForm && (
        <ProdutoForm
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}

      {toast && (
        <div className="toast">
          ✅ {toast}
        </div>
      )}
    </div>
  )
}
