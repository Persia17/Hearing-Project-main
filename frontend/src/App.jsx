import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import FormPage from './pages/FormPage';
import ResultPage from './pages/ResultPage';
import PlanPage from './pages/PlanPage';
import AuthModal from './components/AuthModal';
import Chatbot from './components/Chatbot';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState('login');

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  const openAuthModal = (view = 'login') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const ProtectedRoute = ({ children }) => {
    useEffect(() => {
      if (!isAuthenticated) {
        openAuthModal('login');
      }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} openAuthModal={openAuthModal} />
        <main style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/formpage" element={<ProtectedRoute><FormPage /></ProtectedRoute>} />
            <Route path="/result/:reportId" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
            <Route path="/plan/:reportId" element={<ProtectedRoute><PlanPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          initialView={authModalView}
          onLogin={handleLogin}
        />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
