
import React from 'react';
import { StockLog } from '../types';

interface HistoryLogsProps {
  logs: StockLog[];
}

const HistoryLogs: React.FC<HistoryLogsProps> = ({ logs }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Histórico de Entradas</h2>
        <p className="text-slate-500 text-sm">Registro de novos lotes e reposições</p>
      </header>

      <div className="space-y-3">
        {logs.map(log => (
          <div key={log.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100">
                {log.photo ? (
                  <img src={log.photo} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-300">📦</span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{log.productName}</h4>
                <p className="text-xs text-slate-500">
                  Recebido em: {new Date(log.date).toLocaleString('pt-BR')}
                </p>
                <div className="mt-1">
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 rounded font-bold uppercase">Entrada de {log.quantity} unidades</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Total Investido</p>
              <p className="text-sm font-bold text-slate-900">R$ {(log.unitValue * log.quantity).toLocaleString()}</p>
              <p className="text-[9px] text-slate-400 font-medium">Custo Un: R$ {log.unitValue.toLocaleString()}</p>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-400">Nenhum registro de entrada encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryLogs;
