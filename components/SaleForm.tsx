
import React, { useState, useMemo } from 'react';
import { Product, Sale } from '../types';
import { PAYMENT_METHODS, ICONS } from '../constants';

interface SaleFormProps {
  products: Product[];
  onClose: () => void;
  onSave: (sale: Sale) => void;
}

const SaleForm: React.FC<SaleFormProps> = ({ products, onClose, onSave }) => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [soldPrice, setSoldPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(0); 
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [customerName, setCustomerName] = useState('');
  const [proofPhoto, setProofPhoto] = useState<string | undefined>();

  const selectedProduct = useMemo(() => 
    products.find(p => p.id === productId), [products, productId]
  );

  React.useEffect(() => {
    if (selectedProduct) {
      setSoldPrice(selectedProduct.sellPrice);
    }
  }, [selectedProduct]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProofPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (quantity > selectedProduct.stock) {
      alert(`Erro: Estoque insuficiente! (Disponível: ${selectedProduct.stock})`);
      return;
    }

    // O total que o cliente paga (Apenas os produtos)
    const total = soldPrice * quantity;
    
    // O lucro leva em conta o custo do produto e o frete que VOCÊ pagou
    const totalPurchaseCost = selectedProduct.purchasePrice * quantity;
    const profit = total - totalPurchaseCost - shippingCost;

    const newSale: Sale = {
      id: Date.now().toString(),
      productId,
      productName: selectedProduct.name,
      quantity,
      soldPrice,
      shippingCost,
      total,
      profit,
      paymentMethod,
      customerName,
      date: new Date().toISOString(),
      proofPhoto
    };

    onSave(newSale);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-scaleIn">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
          <div>
            <h3 className="text-xl font-bold">Registrar Venda</h3>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">O frete será descontado do seu lucro</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 overflow-y-auto max-h-[80vh]">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Produto</label>
            <select 
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900"
              value={productId}
              onChange={e => setProductId(e.target.value)}
            >
              <option value="">Selecione um produto</option>
              {products.map(p => (
                <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                  {p.name} ({p.stock} em estoque)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Quantidade</label>
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
              <label className="text-xs font-bold text-slate-500 uppercase">Preço de Venda (un.)</label>
              <input 
                type="number"
                step="0.01"
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900"
                value={soldPrice}
                onChange={e => setSoldPrice(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Custo de Envio / Frete (Pago por Você)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 font-bold">-</span>
              <input 
                type="number"
                step="0.01"
                className="w-full p-3 pl-8 bg-red-50 border border-red-100 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-slate-900"
                value={shippingCost}
                onChange={e => setShippingCost(parseFloat(e.target.value) || 0)}
                placeholder="0,00"
              />
            </div>
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">* Este valor reduz o seu lucro final.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Pagamento</label>
              <select 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
              >
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Cliente</label>
              <input 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Comprovante</label>
            <label className="w-full p-3 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:border-slate-900 hover:text-slate-900 cursor-pointer transition-all">
              {ICONS.Camera}
              <span className="text-sm font-semibold">{proofPhoto ? 'Imagem Capturada' : 'Adicionar Foto'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl space-y-2 border border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total do Cliente:</span>
              <span className="text-xl font-black text-slate-900">R$ {(soldPrice * quantity).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Seu Lucro Líquido:</span>
              <span className="text-xl font-black text-green-600">
                R$ {selectedProduct ? ((soldPrice - selectedProduct.purchasePrice) * quantity - shippingCost).toLocaleString() : '0'}
              </span>
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
              className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95"
            >
              Confirmar Venda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleForm;
