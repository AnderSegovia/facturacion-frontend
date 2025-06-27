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
    <div className="max-w-3xl mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-2">Factura #{factura._id}</h2>
      <p><strong>Cliente:</strong> {factura.cliente?.nombre || 'Cliente eliminado'}</p>
      <p><strong>Tipo:</strong> {factura.tipo_documento}</p>
      <p><strong>Fecha:</strong> {new Date(factura.fecha).toLocaleString()}</p>
      <p><strong>Estado:</strong> {factura.estado}</p>

      <hr className="my-4" />

      <h3 className="text-lg font-semibold mb-2">Detalles</h3>
      <table className="min-w-full border border-gray-200 text-sm mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-1 text-left">Producto</th>
            <th className="px-3 py-1 text-right">Cantidad</th>
            <th className="px-3 py-1 text-right">P/U</th>
            <th className="px-3 py-1 text-right">IVA</th>
            <th className="px-3 py-1 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {factura.detalles.map((d, i) => (
            <tr key={i} className="border-t">
              <td className="px-3 py-1">{d.descripcion}</td>
              <td className="px-3 py-1 text-right">{d.cantidad}</td>
              <td className="px-3 py-1 text-right">${d.precio_unitario.toFixed(2)}</td>
              <td className="px-3 py-1 text-right">${d.iva.toFixed(2)}</td>
              <td className="px-3 py-1 text-right">${d.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right space-y-1 text-sm">
        <div><strong>Subtotal:</strong> ${factura.total_sin_iva.toFixed(2)}</div>
        <div><strong>IVA:</strong> ${factura.total_iva.toFixed(2)}</div>
        <div className="font-bold text-base"><strong>Total:</strong> ${factura.total_con_iva.toFixed(2)}</div>
      </div>

<div className="mt-4 flex flex-wrap gap-2">
  <button
    onClick={() => navigate(-1)}
    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md text-sm"
  >
    Regresar
  </button>

  <button
    onClick={() => window.open(`https://facturacion-backend-92qu.onrender.com/api/facturas/${factura._id}/pdf`, '_blank')}
    //onClick={() => window.open(`http://localhost:3001/api/facturas/${factura._id}/pdf`, '_blank')}
    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
  >
    Ver PDF
  </button>

  <button
    //onClick={() => window.open(`http://localhost:3001/api/facturas/${factura._id}/ticket`, '_blank')}
    onClick={() => window.open(`https://facturacion-backend-92qu.onrender.com/api/facturas/${factura._id}/ticket`, '_blank')}

    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
  >
    Ver Ticket
  </button>
</div>

    </div>
  );
}
