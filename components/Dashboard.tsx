
import React from 'react';
import { Product, Sale, StockLog } from '../types';
import { ICONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  stockLogs: StockLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, sales, stockLogs }) => {
  // Investimento Atual: O que você tem hoje nas prateleiras (Custo de Compra * Estoque)
  const currentInventoryValue = products.reduce((acc, p) => acc + (p.purchasePrice * p.stock), 0);
  
  // Faturamento Potencial: Valor se vender tudo o que tem hoje (Preço de Venda * Estoque)
  const potentialRevenue = products.reduce((acc, p) => acc + (p.sellPrice * p.stock), 0);

  // Lucro Potencial Restante: Lucro que ainda será realizado com o estoque atual
  const potentialRemainingProfit = products.reduce((acc, p) => acc + ((p.sellPrice - p.purchasePrice) * p.stock), 0);

  // Investimento Total: Tudo o que você já gastou comprando mercadoria (Histórico)
  const totalHistoricalInvestment = stockLogs.reduce((acc, log) => acc + (log.unitValue * log.quantity), 0);

  const totalSold = sales.reduce((acc, s) => acc + s.total, 0);
  const totalProfit = sales.reduce((acc, s) => acc + s.profit, 0);
  const totalShipping = sales.reduce((acc, s) => acc + (s.shippingCost || 0), 0);
  const lowStockProducts = products.filter(p => p.stock < 5);

  // Data for sales by product chart
  const salesByProduct = products.map(p => {
    const productSales = sales.filter(s => s.productId === p.id);
    const totalQuantity = productSales.reduce((acc, s) => acc + s.quantity, 0);
    return { name: p.name, value: totalQuantity };
  }).filter(item => item.value > 0).sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Painel Financeiro</h2>
        <p className="text-slate-500 text-sm">Resumo de lucratividade e estoque</p>
      </header>

      {/* Stats Grid Principal */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Faturamento Realizado" value={`R$ ${totalSold.toLocaleString()}`} color="text-slate-900" description="Total já vendido" />
        <StatCard title="Lucro Líquido Real" value={`R$ ${totalProfit.toLocaleString()}`} color="text-green-600" description="Lucro de vendas efetuadas" />
        <StatCard title="Venda Total Estimada" value={`R$ ${potentialRevenue.toLocaleString()}`} color="text-indigo-600" description="Se vender todo o estoque atual" />
        
        <StatCard title="Valor em Estoque" value={`R$ ${currentInventoryValue.toLocaleString()}`} color="text-blue-600" description="Capital (custo) imobilizado" />
        <StatCard title="Lucro Potencial Restante" value={`R$ ${potentialRemainingProfit.toLocaleString()}`} color="text-emerald-500" description="Lucro previsto no estoque" />
        <StatCard title="Fretes Pagos" value={`- R$ ${totalShipping.toLocaleString()}`} color="text-red-500" description="Custo de envio acumulado" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="Investimento Histórico" value={`R$ ${totalHistoricalInvestment.toLocaleString()}`} color="text-slate-400" description="Total gasto em compras desde o início" />
        <div className="bg-slate-900 p-4 rounded-3xl shadow-sm flex items-center justify-between text-white">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Saúde Financeira</p>
            <p className="text-lg font-black text-green-400">
               {potentialRevenue > 0 ? ((potentialRemainingProfit / potentialRevenue) * 100).toFixed(1) : 0}% 
               <span className="text-xs font-normal text-slate-300 ml-2">Margem Média Restante</span>
            </p>
          </div>
        </div>
      </div>

      {/* Alertas de Estoque Rápido */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg text-red-600">
              {ICONS.Warning}
            </div>
            <div>
              <p className="text-sm font-bold text-red-900">{lowStockProducts.length} itens com estoque baixo!</p>
              <p className="text-xs text-red-700">Atenção para reposição necessária.</p>
            </div>
          </div>
        </div>
      )}

      {/* Performance de Itens */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
          📊 Saúde dos Produtos
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 text-[10px] uppercase text-slate-400 font-bold">
                <th className="pb-3 pr-4">Produto</th>
                <th className="pb-3 px-4">Estoque Atual</th>
                <th className="pb-3 px-4">Faturamento Previsto</th>
                <th className="pb-3 pl-4 text-right">Margem Bruta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map(p => {
                const stockPotentialRevenue = p.sellPrice * p.stock;
                const margin = p.purchasePrice > 0 ? ((p.sellPrice - p.purchasePrice) / p.purchasePrice) * 100 : 0;
                
                return (
                  <tr key={p.id} className="text-sm">
                    <td className="py-4 pr-4">
                      <p className="font-bold text-slate-800">{p.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{p.sku}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-bold ${p.stock < 5 ? 'text-red-600' : 'text-slate-700'}`}>
                        {p.stock} un.
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-600">
                      R$ {stockPotentialRevenue.toLocaleString()}
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <span className={`px-2 py-1 rounded-lg font-bold text-[10px] ${
                        margin > 30 ? 'bg-green-50 text-green-600' : 
                        margin > 15 ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {margin.toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 text-sm italic">Cadastre produtos no Estoque para ver dados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Vendas */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Volume de Vendas por Item</h3>
          <div className="h-64">
            {salesByProduct.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByProduct}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} fontSize={10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" name="Vendidos" fill="#0f172a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 italic">Nenhuma venda registrada</div>
            )}
          </div>
        </div>

        {/* Info Extra */}
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl text-white flex flex-col justify-center relative overflow-hidden">
           <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Dica do Sistema</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                A <span className="text-indigo-400 font-bold">Venda Total Estimada</span> mostra quanto dinheiro bruto você terá em mãos após vender tudo o que está parado no estoque hoje. 
              </p>
           </div>
           <div className="absolute -bottom-6 -right-6 text-slate-800/50 scale-[3]">
              {ICONS.Inventory}
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; color: string; description?: string }> = ({ title, value, color, description }) => (
  <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className={`text-lg font-black ${color}`}>{value}</p>
    </div>
    {description && <p className="text-[9px] text-slate-400 font-medium mt-2 italic">{description}</p>}
  </div>
);

export default Dashboard;
