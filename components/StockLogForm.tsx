
import React, { useState } from 'react';
import { Product, StockLog } from '../types';
import { ICONS } from '../constants';

interface StockLogFormProps {
  product: Product;
  onClose: () => void;
  onSave: (log: StockLog) => void;
}

const StockLogForm: React.FC<StockLogFormProps> = ({ product, onClose, onSave }) => {
  const [quantity, setQuantity] = useState(1);
  const [unitValue, setUnitValue] = useState(product.purchasePrice);
  const [photo, setPhoto] = useState<string | undefined>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: StockLog = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      quantity,
      unitValue,
      photo,
      date: new Date().toISOString()
    };
    onSave(newLog);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl animate-scaleIn">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
          <div>
            <h3 className="text-lg font-bold">Entrada de Estoque</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{product.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Qtd Recebida</label>
              <input 
                type="number"
                min="1"
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900"
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Custo Unitário (R$)</label>
              <input 
                type="number"
                step="0.01"
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900"
                value={unitValue}
                onChange={e => setUnitValue(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Foto do Lote/NF (Opcional)</label>
            <div className="flex items-center gap-3">
              {photo && (
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                  <img src={photo} className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex-1 p-3 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:border-slate-900 hover:text-slate-900 cursor-pointer transition-all">
                {ICONS.Camera}
                <span className="text-sm font-semibold">Capturar Imagem</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Investido no Lote</p>
              <p className="text-xl font-black text-slate-900">R$ {(unitValue * quantity).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-100 hover:bg-slate-800 transition-all active:scale-95"
            >
              Confirmar Entrada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockLogForm;
