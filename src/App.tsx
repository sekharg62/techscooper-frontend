import { Route, Routes } from 'react-router-dom'

import { AdminBulkProductPage } from './pages/AdminBulkProductPage'
import { AdminProductPage } from './pages/AdminProductPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProductListPage } from './pages/ProductListPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product-list" element={<ProductListPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/product/bulk" element={<AdminBulkProductPage />} />
      <Route path="/admin/product" element={<AdminProductPage />} />
    </Routes>
  )
}

export default App
