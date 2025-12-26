import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import FamilyTreePage from './pages/FamilyTreePage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><FamilyTreePage /></MainLayout>} />
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/dashboard" element={<AdminDashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
