import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  ShoppingBag,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  User,
  Shield,
  Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { auth, logout, config } = useApp();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'produtos', label: 'Gerenciar Produtos', icon: Box },
    { id: 'pedidos', label: 'Gerenciar Pedidos', icon: ShoppingBag },
    { id: 'pagamentos', label: 'Formas de Pagamento', icon: CreditCard },
    { id: 'clientes', label: 'Lista de Clientes', icon: Users },
    { id: 'configuracoes', label: 'Configurações da Loja', icon: Settings },
  ];

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="flex items-center space-x-2 px-6 py-6 border-b border-slate-800">
        <span className="text-xl font-display font-bold text-white flex items-center gap-1.5">
          <span className="text-brand-blue">✨</span>
          {config.nomeLoja.split(' ')[0]}
          <span className="text-xs font-sans font-light text-slate-500 uppercase tracking-widest block">ADMIN</span>
        </span>
      </div>

      {/* Admin profile card */}
      <div className="px-6 py-5 bg-slate-950/40 flex items-center space-x-3 border-b border-slate-850">
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-blue">
          <Shield size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{auth.user?.nome || 'Diretor Ferraz'}</p>
          <p className="text-xs text-slate-500 truncate">{auth.user?.email || 'admin@ferraz.com'}</p>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
            return (
              <button
                id={`admin-nav-${item.id}`}
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#DCEEFF] text-slate-800 font-bold'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Icon size={16} className="mr-3 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
        })}
      </nav>

      {/* Footer operations */}
      <div className="p-4 border-t border-slate-850 bg-slate-950/20 space-y-2">
        <Link
          to="/"
          className="flex items-center px-4 py-2.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition-all"
        >
          <Home size={14} className="mr-2" />
          Ver Site Principal
        </Link>
        <button
          id="admin-logout-btn"
          onClick={handleLogoutClick}
          className="w-full flex items-center px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
        >
          <LogOut size={14} className="mr-2" />
          Sair do Painel
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 border-r border-slate-850">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Slide Drawer */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-black lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-55 w-64 bg-slate-900 lg:hidden shadow-2xl"
            >
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Admin Section Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header top-bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <button
              id="admin-mobile-menu-btn"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg"
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold text-gray-900 font-display">
              {menuItems.find((m) => m.id === activeTab)?.label || 'Painel de Controle'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Acesso Autorizado</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                Modo Integração Ativo
              </span>
            </div>

            {/* Notification bell icon */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-blue-dark rounded-full" />
            </button>

            {/* Profile widget */}
            <div className="flex items-center space-x-2 border-l border-gray-100 pl-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                <User size={14} />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content area */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
