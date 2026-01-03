
import React, { useState } from 'react';
import { Product, StockLog, Category } from '../types';
import { ICONS, CATEGORIES } from '../constants';
import ProductForm from './ProductForm';
import StockLogForm from './StockLogForm';

interface InventoryProps {
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addStockLog: (l: StockLog) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, addProduct, updateProduct, deleteProduct, addStockLog }) => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [showStockForm, setShowStockForm] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
  };

  const handleSaveProduct = (product: Product) => {
    if (productToEdit) {
      updateProduct(product);
    } else {
      addProduct(product);
    }
    setShowProductForm(false);
    setProductToEdit(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Estoque</h2>
          <p className="text-slate-500 text-sm">Gerencie seu catálogo de produtos</p>
        </div>
        <button 
          onClick={() => {
            setProductToEdit(null);
            setShowProductForm(true);
          }}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md hover:bg-slate-800 transition-colors"
        >
          {ICONS.Add}
          <span className="hidden sm:inline">Novo Produto</span>
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por nome ou SKU..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="bg-white border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as any)}
        >
          <option value="Todos">Todas Categorias</option>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => {
          const totalInvestment = product.stock * product.purchasePrice;
          const profitMargin = product.purchasePrice > 0 ? ((product.sellPrice - product.purchasePrice) / product.purchasePrice) * 100 : 0;

          return (
            <div key={product.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Package size={48} />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                    product.stock < 5 ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'
                  }`}>
                    {product.stock} em estoque
                  </span>
                  <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-slate-700 shadow-sm">
                    {product.category}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-800 line-clamp-1 flex-1">{product.name}</h4>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                    profitMargin > 20 ? 'text-green-600 bg-green-50' : 'text-slate-500 bg-slate-50'
                  }`}>
                    {profitMargin.toFixed(0)}% Lucro
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">SKU: {product.sku}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Venda Un.</p>
                    <p className="text-md font-bold text-slate-900">R$ {product.sellPrice.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Investido</p>
                    <p className="text-md font-bold text-slate-600">R$ {totalInvestment.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowStockForm(product)}
                    className="flex-[2] py-2 bg-slate-900 text-white font-semibold text-xs rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
                  >
                    {ICONS.Add} Entrada
                  </button>
                  <button 
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
                  >
                    {ICONS.Edit} Editar
                  </button>
                  <button 
                    onClick={() => deleteProduct(product.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    {ICONS.Delete}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-400">Nenhum produto encontrado.</p>
        </div>
      )}

      {/* Modals */}
      {(showProductForm || productToEdit) && (
        <ProductForm 
          initialProduct={productToEdit || undefined}
          onClose={() => {
            setShowProductForm(false);
            setProductToEdit(null);
          }} 
          onSave={handleSaveProduct} 
        />
      )}

      {showStockForm && (
        <StockLogForm 
          product={showStockForm}
          onClose={() => setShowStockForm(null)}
          onSave={(log) => {
            addStockLog(log);
            setShowStockForm(null);
          }}
        />
      )}
    </div>
  );
};

const Package: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
  </svg>
);

export default Inventory;
