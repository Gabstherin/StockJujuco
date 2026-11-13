import { useState, useEffect } from 'react'

const API_BASE_URL = 'http://127.0.0.1:8000'

export default function Estoque() {
  const [estoque, setEstoque] = useState([])
  const [movimentacoes, setMovimentacoes] = useState([])
  const [ingredientes, setIngredientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const [formEntrada, setFormEntrada] = useState({ ingrediente_id: '', quantidade: '', observacao: '' })
  const [formSaida, setFormSaida] = useState({ ingrediente_id: '', quantidade: '', observacao: '' })

  const carregarDados = async () => {
    try {
      setLoading(true)
      const [resEstoque, resMovs, resIngs] = await Promise.all([
        fetch(`${API_BASE_URL}/estoque`),
        fetch(`${API_BASE_URL}/estoque/movimentacoes`),
        fetch(`${API_BASE_URL}/ingredientes`)
      ])
      if (resEstoque.ok) setEstoque(await resEstoque.json())
      if (resMovs.ok) setMovimentacoes(await resMovs.json())
      if (resIngs.ok) setIngredientes(await resIngs.json())
    } catch (e) {
      setErro('Falha ao conectar com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const handleEntrada = async (e) => {
    e.preventDefault()
    setErro('')
    setSucesso('')
    try {
      const res = await fetch(`${API_BASE_URL}/estoque/entrada`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingrediente_id: parseInt(formEntrada.ingrediente_id),
          quantidade: parseFloat(formEntrada.quantidade),
          observacao: formEntrada.observacao || null
        })
      })
      if (res.ok) {
        setSucesso('Entrada registrada com sucesso!')
        setFormEntrada({ ingrediente_id: '', quantidade: '', observacao: '' })
        carregarDados()
      } else {
        const err = await res.json()
        setErro(err.detail || 'Erro ao registrar entrada.')
      }
    } catch {
      setErro('Falha ao comunicar com o servidor.')
    }
  }

  const handleSaida = async (e) => {
    e.preventDefault()
    setErro('')
    setSucesso('')
    try {
      const res = await fetch(`${API_BASE_URL}/estoque/saida`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingrediente_id: parseInt(formSaida.ingrediente_id),
          quantidade: parseFloat(formSaida.quantidade),
          observacao: formSaida.observacao || null
        })
      })
      if (res.ok) {
        setSucesso('Saída registrada com sucesso!')
        setFormSaida({ ingrediente_id: '', quantidade: '', observacao: '' })
        carregarDados()
      } else {
        const err = await res.json()
        setErro(err.detail || 'Erro ao registrar saída.')
      }
    } catch {
      setErro('Falha ao comunicar com o servidor.')
    }
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 className="page-title">Controle de Estoque</h1>
      <p className="page-subtitle">Acompanhe os níveis de insumos, entradas, saídas e alertas de reposição.</p>

      {erro && <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>{erro}</div>}
      {sucesso && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>{sucesso}</div>}

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>Níveis Atuais de Insumos</h2>
        {loading ? (
          <p>Carregando estoque...</p>
        ) : (
          <table className="table" style={{ width: '100%', marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>Ingrediente</th>
                <th>Estoque Atual</th>
                <th>Estoque Mínimo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {estoque.map(item => (
                <tr key={item.ingrediente_id}>
                  <td><strong>{item.nome}</strong></td>
                  <td>{item.estoque_atual} {item.unidade_medida}</td>
                  <td>{item.estoque_minimo} {item.unidade_medida}</td>
                  <td>
                    <span className={`badge badge-${item.status}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h2>Registrar Entrada de Insumo</h2>
          <form onSubmit={handleEntrada}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Ingrediente</label>
              <select
                className="form-control"
                value={formEntrada.ingrediente_id}
                onChange={e => setFormEntrada({ ...formEntrada, ingrediente_id: e.target.value })}
                required
              >
                <option value="">Selecione o insumo...</option>
                {ingredientes.map(i => (
                  <option key={i.id} value={i.id}>{i.nome} ({i.estoque_atual} {i.unidade_medida})</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Quantidade</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                value={formEntrada.quantidade}
                onChange={e => setFormEntrada({ ...formEntrada, quantidade: e.target.value })}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Observação</label>
              <input
                type="text"
                className="form-control"
                value={formEntrada.observacao}
                onChange={e => setFormEntrada({ ...formEntrada, observacao: e.target.value })}
                placeholder="Ex: Compra quinzenal"
              />
            </div>
            <button type="submit" className="btn btn-primary">Registrar Entrada</button>
          </form>
        </div>

        <div className="card">
          <h2>Registrar Saída de Insumo</h2>
          <form onSubmit={handleSaida}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Ingrediente</label>
              <select
                className="form-control"
                value={formSaida.ingrediente_id}
                onChange={e => setFormSaida({ ...formSaida, ingrediente_id: e.target.value })}
                required
              >
                <option value="">Selecione o insumo...</option>
                {ingredientes.map(i => (
                  <option key={i.id} value={i.id}>{i.nome} ({i.estoque_atual} {i.unidade_medida})</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Quantidade</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                value={formSaida.quantidade}
                onChange={e => setFormSaida({ ...formSaida, quantidade: e.target.value })}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Observação</label>
              <input
                type="text"
                className="form-control"
                value={formSaida.observacao}
                onChange={e => setFormSaida({ ...formSaida, observacao: e.target.value })}
                placeholder="Ex: Fornada de 20 brownies"
              />
            </div>
            <button type="submit" className="btn btn-secondary">Registrar Saída</button>
          </form>
        </div>
      </div>

      <div className="card">
        <h2>Histórico de Movimentações</h2>
        <table className="table" style={{ width: '100%', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Ingrediente</th>
              <th>Tipo</th>
              <th>Quantidade</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            {movimentacoes.length === 0 ? (
              <tr><td colSpan="5">Nenhuma movimentação registrada.</td></tr>
            ) : (
              movimentacoes.map(m => (
                <tr key={m.id}>
                  <td>{new Date(m.criado_em).toLocaleString('pt-BR')}</td>
                  <td>{m.ingrediente_nome}</td>
                  <td>
                    <span className={`badge badge-${m.tipo === 'entrada' ? 'ok' : 'critico'}`}>
                      {m.tipo.toUpperCase()}
                    </span>
                  </td>
                  <td>{m.quantidade}</td>
                  <td>{m.observacao || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
