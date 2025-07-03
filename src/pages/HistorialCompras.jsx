import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function HistorialCompras() {
  const [facturas, setFacturas] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    api.get('/factura-compra')
      .then(res => setFacturas(res.data))
      .catch(err => console.error('Error al cargar historial:', err));
  }, []);

return (
    <div className="p-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
            <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
            >
            ← Regresar
            </button>
            <h1 className="text-2xl font-bold text-center">📦 Historial de Compras</h1>
        </div>


        {facturas.length === 0 ? (
        <p className="text-gray-600 text-center">No hay facturas registradas.</p>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {facturas.map((factura, index) => (
            <div key={factura._id} className="border rounded-lg shadow p-4 bg-white">
                <div className="mb-3">
                <h2 className="text-lg font-bold">🧾 Factura #{index + 1}</h2>
                <p className="text-sm text-gray-600">
                    Proveedor: <span className="font-medium">{factura.proveedor?.nombre || '—'}</span>
                </p>
                <p className="text-xs text-gray-500">
                    Fecha: {new Date(factura.fecha).toLocaleDateString('es-SV', {
                    day: '2-digit', month: 'short', year: 'numeric'
                    })}
                </p>
                </div>

                <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-2 py-1 text-left">Producto</th>
                        <th className="px-2 py-1 text-center">Cant.</th>
                        <th className="px-2 py-1 text-right">P/U</th>
                        <th className="px-2 py-1 text-right">IVA</th>
                        <th className="px-2 py-1 text-right">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {factura.detalles.map((item, i) => (
                        <tr key={i} className="border-t">
                        <td className="px-2 py-1">{item.producto?.nombre || '—'}</td>
                        <td className="px-2 py-1 text-center">{item.cantidad}</td>
                        <td className="px-2 py-1 text-right">${item.precio_unitario.toFixed(2)}</td>
                        <td className="px-2 py-1 text-right">${item.iva.toFixed(2)}</td>
                        <td className="px-2 py-1 text-right font-semibold">${item.total.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

                <div className="text-right text-sm mt-2">
                <p>Subtotal: <span className="font-medium">${factura.total_sin_iva.toFixed(2)}</span></p>
                <p>IVA: <span className="font-medium">${factura.total_iva.toFixed(2)}</span></p>
                <p className="font-semibold text-blue-700 text-base">Total: ${factura.total_con_iva.toFixed(2)}</p>
                </div>
            </div>
            ))}
        </div>
        )}
  </div>
);


}
