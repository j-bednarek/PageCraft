import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainPage from './pages/mainPage/components/MainPage'
import Navbar from './assets/components/Navbar'
import Footer from './assets/components/Footer'
import { AuthProvider } from './context/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
