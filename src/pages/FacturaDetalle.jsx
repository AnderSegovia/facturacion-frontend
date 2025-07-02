import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function FacturaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [factura, setFactura] = useState(null);

  useEffect(() => {
    const obtener = async () => {
      try {
        const res = await api.get(`/facturas/${id}`);
        setFactura(res.data);
      } catch (error) {
        console.error('Error al cargar factura:', error);
      }
    };
    obtener();
  }, [id]);

  if (!factura) return <p className="text-center py-10">Cargando...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
      >
        ← Regresar
      </button>

      <h1 className="text-2xl font-bold text-blue-700 mb-4">Factura #{factura._id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow text-sm">
        <div>
          <p><strong>Cliente:</strong> {factura.cliente?.nombre || 'Cliente eliminado'}</p>
          <p><strong>Tipo Documento:</strong> {factura.tipo_documento}</p>
          <p><strong>Fecha:</strong> {new Date(factura.fecha).toLocaleString()}</p>
        </div>

        <div>
          <p><strong>Teléfono:</strong> {factura.cliente?.telefono || '-'}</p>
          <p><strong>DUI / NRC:</strong> {factura.cliente?.dui || factura.cliente?.nrc || '-'}</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mt-8 mb-2">Detalles de Productos</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Producto</th>
              <th className="px-3 py-2 text-right">Cantidad</th>
              <th className="px-3 py-2 text-right">P/U</th>
              <th className="px-3 py-2 text-right">IVA</th>
              <th className="px-3 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {factura.detalles.map((d, i) => (
              <tr key={i} className="border-t">
                <td className="px-3 py-2">{d.descripcion}</td>
                <td className="px-3 py-2 text-right">{d.cantidad}</td>
                <td className="px-3 py-2 text-right">${d.precio_unitario.toFixed(2)}</td>
                <td className="px-3 py-2 text-right">${d.iva.toFixed(2)}</td>
                <td className="px-3 py-2 text-right">${d.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-end gap-4 text-sm text-right">
        <div className="bg-white p-4 rounded shadow w-full sm:w-auto">
          <p><strong>Subtotal:</strong> ${factura.total_sin_iva.toFixed(2)}</p>
          <p><strong>IVA:</strong> ${factura.total_iva.toFixed(2)}</p>
          <p className="font-bold text-base"><strong>Total:</strong> ${factura.total_con_iva.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => window.open(`${import.meta.env.VITE_API_URL}/facturas/${factura._id}/pdf`, '_blank')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Ver PDF
        </button>

        <button
          onClick={() => window.open(`${import.meta.env.VITE_API_URL}/facturas/${factura._id}/ticket`, '_blank')}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Ver Ticket
        </button>
      </div>
    </div>
  );
}
