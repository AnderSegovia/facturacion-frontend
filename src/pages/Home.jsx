import { useEffect, useState } from 'react';
import api from '../api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { FaMoneyBillWave, FaFileInvoice, FaBoxOpen, FaUser } from 'react-icons/fa';

export default function HomeDashboard() {
  const [resumen, setResumen] = useState({});
  const [ventasDiarias, setVentasDiarias] = useState([]);
  const [productosTop, setProductosTop] = useState([]);
  const [clientesTop, setClientesTop] = useState([]);

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const cargarDatosDashboard = async () => {
    try {
      const res = await api.get('/dashboard/resumen');
      setResumen(res.data.resumen);
      setVentasDiarias(res.data.ventasDiarias);
      setProductosTop(res.data.productosTop);
      setClientesTop(res.data.clientesTop);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    }
  };

  const colores = ['#34D399', '#60A5FA', '#FBBF24', '#F87171', '#A78BFA'];

  return (
    <div className="p-6 space-y-6">
      {/* 1. Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ResumenCard icon={<FaMoneyBillWave />} label="Ventas Hoy" valor={`$${resumen.ventasHoy || 0}`} />
        <ResumenCard icon={<FaFileInvoice />} label="Ventas Mes" valor={`$${resumen.ventasMes || 0}`} />
        <ResumenCard icon={<FaBoxOpen />} label="Facturas Emitidas" valor={resumen.facturas || 0} />
        <ResumenCard icon={<FaUser />} label="Clientes Activos" valor={resumen.clientes || 0} />
      </div>

      {/* 2. Gráfica de ventas */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-bold mb-4">Ventas últimos 7 días</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ventasDiarias}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#60A5FA" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 4. Productos más vendidos */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-bold mb-4">Top Productos</h2>
        <ul className="space-y-2">
          {productosTop.map((prod, i) => (
            <li key={prod.nombre} className="flex justify-between text-sm">
              <span>{prod.nombre}</span>
              <span className="font-bold">{prod.cantidad} uds</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 5. Clientes frecuentes */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-bold mb-4">Clientes Frecuentes</h2>
        <ul className="space-y-2">
          {clientesTop.map((cli, i) => (
            <li key={cli.nombre} className="flex justify-between text-sm">
              <span>{cli.nombre}</span>
              <span className="font-bold">{cli.compras} compras</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ResumenCard({ icon, label, valor }) {
  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded shadow">
      <div className="text-2xl text-blue-600">{icon}</div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-xl font-bold">{valor}</div>
      </div>
    </div>
  );
} 
