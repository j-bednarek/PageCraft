import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainPage from './pages/mainPage/components/MainPage'
import Navbar from './assets/components/Navbar'
import Footer from './assets/components/Footer'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './assets/components/ProtectedRoute'
import Account from './pages/account/Account'
import portfolioMinimal from './pages/templates/portfolioMinimal/definition';
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route
            path="/dev/template"
            element={<portfolioMinimal.component content={portfolioMinimal.defaultContent} />}
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
