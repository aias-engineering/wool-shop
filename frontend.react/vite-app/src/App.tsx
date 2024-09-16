import { useState } from 'react'
import './App.css'
import Products from './features/products/Products'
import Header from './features/header/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header></Header>
      <Products></Products>
    </>
  )
}

export default App
