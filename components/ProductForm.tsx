
import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { CATEGORIES, ICONS } from '../constants';

interface ProductFormProps {
  onClose: () => void;
  onSave: (product: Product) => void;
  initialProduct?: Product;
}

const ProductForm: React.FC<ProductFormProps> = ({ onClose, onSave, initialProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Antena' as Category,
    sku: '',
    purchasePrice: 0,
    sellPrice: 0,
    stock: 0,
    supplier: '',
  });
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name,
        category: initialProduct.category,
        sku: initialProduct.sku,
        purchasePrice: initialProduct.purchasePrice,
        sellPrice: initialProduct.sellPrice,
        stock: initialProduct.stock,
        supplier: initialProduct.supplier || '',
      });
      setImages(initialProduct.images || []);
    }
  }, [initialProduct]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData: Product = {
      ...formData,
      id: initialProduct ? initialProduct.id : Date.now().toString(),
      entryDate: initialProduct ? initialProduct.entryDate : new Date().toISOString(),
      images
    };
    onSave(productData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scaleIn">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800">
            {initialProduct ? 'Editar Produto' : 'Novo Produto'}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Photos Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Fotos do Produto</label>
            <div className="flex flex-wrap gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden shadow-sm">
                  <img src={img} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-[10px]"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 cursor-pointer transition-all">
                {ICONS.Camera}
                <span className="text-[10px] font-bold mt-1">Adicionar</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Nome do Produto</label>
              <input 
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Antena Starlink Standard"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Categoria</label>
              <select 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Código / SKU</label>
              <input 
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900"
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Ex: SLK-ANT-001"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Fornecedor</label>
              <input 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900"
                value={formData.supplier}
                onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Nome do fornecedor"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Custo Unitário de Compra (R$)</label>
              <input 
                type="number"
                step="0.01"
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900"
                value={formData.purchasePrice}
                onChange={e => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Preço de Venda Sugerido (R$)</label>
              <input 
                type="number"
                step="0.01"
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900"
                value={formData.sellPrice}
                onChange={e => setFormData({ ...formData, sellPrice: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Quantidade em Estoque</label>
              <input 
                type="number"
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
            >
              {initialProduct ? 'Salvar Alterações' : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
