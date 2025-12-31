
import { 
  Calculator, 
  Package, 
  BookOpen, 
  FileText, 
  DollarSign, 
  ClipboardList, 
  BarChart3, 
  PieChart 
} from 'lucide-react';

export const SUBPROGRAMAS = [
  { 
    id: 1, 
    name: 'Balance de Saldos', 
    route: "balancesaldos",
    icon: Calculator, 
    color: 'bg-blue-500',
    description: 'Registro de cuentas contables con clasificación'
  },
  { 
    id: 2, 
    name: 'Inventario y Productos en Proceso', 
    route: "inventario",
    icon: Package, 
    color: 'bg-green-500',
    description: 'Control de inventarios y productos en fabricación'
  },
  { 
    id: 3, 
    name: 'Registros Contables', 
    route: "registroscontables",
    icon: BookOpen, 
    color: 'bg-purple-500',
    description: 'Asientos contables del periodo'
  },
  { 
    id: 4, 
    name: 'Mayores Auxiliares', 
    route: "mayoresauxiliares",
    icon: FileText, 
    color: 'bg-orange-500',
    description: 'Movimientos por cuenta individual'
  },
  { 
    id: 5, 
    name: 'Cálculo de Costos de Venta', 
    route: "costosdeventa",
    icon: DollarSign, 
    color: 'bg-pink-500',
    description: 'Determinación del costo de productos vendidos'
  },
  { 
    id: 6, 
    name: 'Hoja de Trabajo', 
    route: "hojadetrabajo",
    icon: ClipboardList, 
    color: 'bg-cyan-500',
    description: 'Consolidación de balances y ajustes'
  },
  { 
    id: 7, 
    name: 'Estado de Resultados', 
    route: "estadoderesultados",
    icon: BarChart3, 
    color: 'bg-indigo-500',
    description: 'Utilidad o pérdida del periodo'
  },
  { 
    id: 8, 
    name: 'Balance General', 
    route: "balancegeneral",
    icon: PieChart, 
    color: 'bg-emerald-500',
    description: 'Estado de situación financiera'
  }
];