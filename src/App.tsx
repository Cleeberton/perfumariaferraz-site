import React, { useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AppRoutes } from './routes/AppRoutes';

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
    document.documentElement.scrollTo({ top: 0, behavior: 'instant' as any });
    document.body.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Header onCartOpen={() => setIsCartOpen(true)} />
      
      <main className="flex-grow">
        <AppRoutes />
      </main>

      <Footer />
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}
