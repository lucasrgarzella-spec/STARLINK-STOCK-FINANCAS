
import React, { useState } from 'react';
import { Product, Sale } from '../types';
import { ICONS } from '../constants';
import SaleForm from './SaleForm';

interface SalesProps {
  products: Product[];
  sales: Sale[];
  addSale: (s: Sale) => void;
}

const Sales: React.FC<SalesProps> = ({ products, sales, addSale }) => {
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = sales.filter(s => 
    s.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Vendas</h2>
          <p className="text-slate-500 text-sm">Controle de entradas e lucros líquidos</p>
        </div>
        <button 
          onClick={() => setShowSaleForm(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md hover:bg-slate-800 transition-colors"
        >
          {ICONS.Add}
          <span className="hidden sm:inline">Nova Venda</span>
        </button>
      </header>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input 
          type="text" 
          placeholder="Buscar produto ou cliente..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Sales History List */}
      <div className="space-y-3">
        {filteredSales.map(sale => (
          <div key={sale.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100">
                {sale.proofPhoto ? (
                  <img src={sale.proofPhoto} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-400 text-xl">🧾</span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{sale.productName}</h4>
                <p className="text-xs text-slate-500">
                  {new Date(sale.date).toLocaleDateString('pt-BR')} • {sale.customerName || 'Cliente Particular'}
                </p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 rounded font-bold uppercase">{sale.paymentMethod}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 rounded font-bold uppercase">{sale.quantity}x Unid.</span>
                  {sale.shippingCost > 0 && (
                    <span className="text-[10px] bg-red-50 text-red-600 px-1.5 rounded font-bold uppercase border border-red-100">Custo Envio: R$ {sale.shippingCost.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 gap-1">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Total Pago</p>
                <p className="text-md font-bold text-slate-900">R$ {sale.total.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-green-600 uppercase font-bold">Lucro Líquido</p>
                <p className="text-sm font-black text-green-600">R$ {sale.profit.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}

        {filteredSales.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-400">Nenhuma venda registrada ainda.</p>
          </div>
        )}
      </div>

      {showSaleForm && (
        <SaleForm 
          products={products}
          onClose={() => setShowSaleForm(false)}
          onSave={(sale) => {
            addSale(sale);
            setShowSaleForm(false);
          }}
        />
      )}
    </div>
  );
};

export default Sales;
