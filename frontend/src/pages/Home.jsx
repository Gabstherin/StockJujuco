import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🍫',
    title: 'Catálogo de Produtos',
    desc: 'Cadastre e consulte seus produtos com preço e categoria.',
    status: 'AC01 Concluída',
    link: '/produtos'
  },
  {
    icon: '🥚',
    title: 'Ingredientes e Insumos',
    desc: 'Cadastro de matérias-primas e cálculo do custo unitário por g/ml/un.',
    status: 'AC02 Integrada',
    link: '/ingredientes'
  },
  {
    icon: '💰',
    title: 'Custos e Precificação',
    desc: 'Ficha técnica, custo real de insumos, margem de lucro e simulador de preços.',
    status: 'AC03 Entrega Atual',
    link: '/precificacao'
  },
  {
    icon: '📦',
    title: 'Estoque & Visão Consolidada',
    desc: 'Controle de entrada e saída de insumos com alertas de reposição.',
    status: 'Entrega Final (22/11)',
    link: null
  },
]

export default function Home() {
  return (
    <div className="main-content">
      <div className="home-hero">
        <div className="home-logo-big">JJ</div>
        <h1 className="home-title">StockJujuco</h1>
        <p className="home-subtitle">Controle de produtos, ingredientes, ficha técnica e precificação artesanal</p>
        <p className="home-tagline">✨ Feito com carinho para a Juju Co.</p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <Link to="/precificacao" className="btn-primary">
            💰 Ver Custos & Precificação
          </Link>
          <Link to="/produtos" className="btn-secondary" style={{ textDecoration: 'none' }}>
            🍰 Catálogo de Produtos
          </Link>
        </div>

        <div className="home-cards">
          {features.map((f) => (
            <div key={f.title} className="home-feature-card">
              <div className="home-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              {f.link ? (
                <Link to={f.link} style={{ textDecoration: 'none' }}>
                  <span className="badge-soon" style={{ background: 'var(--rosa-claro)', color: 'var(--rosa-primario)' }}>
                    {f.status} ✓
                  </span>
                </Link>
              ) : (
                <span className="badge-soon">{f.status}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
