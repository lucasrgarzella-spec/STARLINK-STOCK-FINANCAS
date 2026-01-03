
import React, { useState, useEffect } from 'react';
import { Product, Sale, StockLog, Category } from './types';
import { ICONS } from './constants';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import HistoryLogs from './components/HistoryLogs';

type View = 'dashboard' | 'inventory' | 'sales' | 'logs';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);

  // Load initial data
  useEffect(() => {
    const savedProducts = localStorage.getItem('starlink_products');
    const savedSales = localStorage.getItem('starlink_sales');
    const savedLogs = localStorage.getItem('starlink_logs');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedSales) setSales(JSON.parse(savedSales));
    if (savedLogs) setStockLogs(JSON.parse(savedLogs));
  }, []);

  // Save data to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('starlink_products', JSON.stringify(products));
    localStorage.setItem('starlink_sales', JSON.stringify(sales));
    localStorage.setItem('starlink_logs', JSON.stringify(stockLogs));
  }, [products, sales, stockLogs]);

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
    
    // Se o produto já começar com estoque, gera um log de entrada para o histórico financeiro
    if (product.stock > 0) {
      const initialLog: StockLog = {
        id: `initial-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        quantity: product.stock,
        unitValue: product.purchasePrice,
        date: new Date().toISOString(),
      };
      setStockLogs(prev => [initialLog, ...prev]);
    }
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    if (window.confirm('Deseja realmente excluir este produto? Isso não apagará o histórico de vendas.')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const addSale = (sale: Sale) => {
    setSales(prev => [sale, ...prev]);
    // Update stock
    setProducts(prev => prev.map(p => {
      if (p.id === sale.productId) {
        return { ...p, stock: p.stock - sale.quantity };
      }
      return p;
    }));
  };

  const addStockLog = (log: StockLog) => {
    setStockLogs(prev => [log, ...prev]);
    // Update stock
    setProducts(prev => prev.map(p => {
      if (p.id === log.productId) {
        return { ...p, stock: p.stock + log.quantity };
      }
      return p;
    }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-lg flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-md">
             <div className="bg-slate-900 text-white text-[10px] font-bold px-1 rounded">PRO</div>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Starlink Stock Pro</h1>
        </div>
        <div className="hidden sm:block bg-slate-800 px-3 py-1 rounded-full text-[10px] font-bold text-slate-300 uppercase tracking-widest border border-slate-700">
          Controle de Vendas & Fretes
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 scroll-smooth">
        <div className="max-w-5xl mx-auto p-4 md:p-6 h-full">
          {activeView === 'dashboard' && (
            <Dashboard products={products} sales={sales} stockLogs={stockLogs} />
          )}
          {activeView === 'inventory' && (
            <Inventory 
              products={products} 
              addProduct={addProduct} 
              updateProduct={updateProduct}
              deleteProduct={deleteProduct}
              addStockLog={addStockLog}
            />
          )}
          {activeView === 'sales' && (
            <Sales 
              products={products} 
              sales={sales} 
              addSale={addSale} 
            />
          )}
          {activeView === 'logs' && (
            <HistoryLogs logs={stockLogs} />
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-20 md:relative md:border-t-0 md:bg-slate-100 md:p-4">
        <NavButton 
          active={activeView === 'dashboard'} 
          onClick={() => setActiveView('dashboard')}
          icon={ICONS.Dashboard}
          label="Painel"
        />
        <NavButton 
          active={activeView === 'inventory'} 
          onClick={() => setActiveView('inventory')}
          icon={ICONS.Inventory}
          label="Estoque"
        />
        <NavButton 
          active={activeView === 'sales'} 
          onClick={() => setActiveView('sales')}
          icon={ICONS.Sales}
          label="Vendas"
        />
        <NavButton 
          active={activeView === 'logs'} 
          onClick={() => setActiveView('logs')}
          icon={ICONS.Logs}
          label="Histórico"
        />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center transition-all duration-200 px-4 py-1 rounded-xl ${
      active 
        ? 'text-slate-900 bg-slate-100 md:bg-white md:shadow-sm scale-105' 
        : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    {icon}
    <span className="text-[10px] md:text-xs font-semibold mt-1">{label}</span>
  </button>
);

export default App;
