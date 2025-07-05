import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function FacturaCompraVer() {
  const { id } = useParams();
  const [factura, setFactura] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerFactura = async () => {
      try {
        const res = await api.get(`/factura-compra/${id}`);
        setFactura(res.data);
      } catch (err) {
        console.error('Error al obtener factura:', err);
      } finally {
        setCargando(false);
      }
    };

    obtenerFactura();
  }, [id]);

  if (cargando) {
    return <p className="p-4 text-center text-gray-600">Cargando factura...</p>;
  }

  if (!factura) {
    return <p className="p-4 text-center text-red-600">Factura no encontrada</p>;
  }

  const {
    proveedor,
    numero_factura,
    tipo_factura,
    forma_pago,
    fecha,
    fecha_vencimiento,
    detalles,
    total_sin_iva,
    total_iva,
    total_con_iva,
    observaciones,
  } = factura;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Factura #{numero_factura}</h1>
        <Link to="/historial-compras" className="text-blue-600 hover:underline text-sm">
          ← Volver al historial
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p><strong>Proveedor:</strong> {proveedor?.nombre}</p>
          <p><strong>Fecha:</strong> {new Date(fecha).toLocaleDateString()}</p>
          <p><strong>Tipo de factura:</strong> {tipo_factura}</p>
          <p><strong>Forma de pago:</strong> {forma_pago}</p>
          {forma_pago === 'Crédito' && (
            <p><strong>Fecha vencimiento:</strong> {new Date(fecha_vencimiento).toLocaleDateString()}</p>
          )}
        </div>
        <div>
          <p><strong>Subtotal:</strong> ${total_sin_iva.toFixed(2)}</p>
          <p><strong>IVA:</strong> ${total_iva.toFixed(2)}</p>
          <p><strong>Total:</strong> ${total_con_iva.toFixed(2)}</p>
          {observaciones && (
            <p><strong>Observaciones:</strong> {observaciones}</p>
          )}
        </div>
      </div>

      <h2 className="text-lg font-bold mb-2">Detalle de productos</h2>
      <table className="min-w-full border text-sm mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">SKU</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1 text-right">Cantidad</th>
            <th className="border px-2 py-1 text-right">P/U</th>
            <th className="border px-2 py-1 text-right">IVA</th>
            <th className="border px-2 py-1 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((item, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{item.producto?.sku}</td>
              <td className="border px-2 py-1">{item.producto?.nombre}</td>
              <td className="border px-2 py-1 text-right">{item.cantidad}</td>
              <td className="border px-2 py-1 text-right">${item.precio_unitario.toFixed(2)}</td>
              <td className="border px-2 py-1 text-right">${item.iva.toFixed(2)}</td>
              <td className="border px-2 py-1 text-right">${item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
