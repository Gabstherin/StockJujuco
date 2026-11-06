import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Produtos from './pages/Produtos'
import Ingredientes from './pages/Ingredientes'
import Precificacao from './pages/Precificacao'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/ingredientes" element={<Ingredientes />} />
        <Route path="/precificacao" element={<Precificacao />} />
      </Routes>
    </>
  )
}
