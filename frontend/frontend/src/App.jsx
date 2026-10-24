import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainPage from './pages/mainPage/components/MainPage'
import AppLayout from './assets/components/AppLayout'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './assets/components/ProtectedRoute'
import Account from './pages/account/Account'
import portfolioMinimal from './pages/templates/portfolioMinimal/definition'
import EditorPage from './pages/editor/EditorPage'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/editor/:id"
            element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dev/template"
            element={<portfolioMinimal.component content={portfolioMinimal.defaultContent} />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App