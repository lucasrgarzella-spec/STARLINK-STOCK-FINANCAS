
import React from 'react';
import { Package, ShoppingCart, LayoutDashboard, History, PlusCircle, Camera, Trash2, Filter, ChevronRight, AlertTriangle, Pencil } from 'lucide-react';

export const CATEGORIES = ['Antena', 'Cabo', 'Acessório', 'Outros'] as const;
export const PAYMENT_METHODS = ['Pix', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Transferência'] as const;

export const ICONS = {
  Dashboard: <LayoutDashboard className="w-5 h-5" />,
  Inventory: <Package className="w-5 h-5" />,
  Sales: <ShoppingCart className="w-5 h-5" />,
  Logs: <History className="w-5 h-5" />,
  Add: <PlusCircle className="w-5 h-5" />,
  Edit: <Pencil className="w-4 h-4" />,
  Camera: <Camera className="w-5 h-5" />,
  Delete: <Trash2 className="w-4 h-4" />,
  Filter: <Filter className="w-5 h-5" />,
  Next: <ChevronRight className="w-5 h-5" />,
  Warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
};
