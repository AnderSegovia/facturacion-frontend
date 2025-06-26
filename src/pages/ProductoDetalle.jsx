import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await api.get(`/productos/${id}`);
        setProducto(res.data.producto);
        setFacturas(res.data.facturas);
      } catch (error) {
        console.error('Error al obtener producto:', error);
      } finally {
        setCargando(false);
      }
    };

    fetchProducto();
  }, [id]);

  if (cargando) return <div className="text-center text-gray-500 py-10">Cargando...</div>;

  if (!producto) return <div className="text-center text-red-500 py-10">Producto no encontrado.</div>;

  return (
    <div>
      <button
        onClick={() => navigate('/productos/lista')}
        className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold text-blue-700 mb-4">Detalle del Producto</h1>
      <div className="bg-white p-6 rounded shadow space-y-2">
        <p><strong>Nombre:</strong> {producto.nombre}</p>
        <p><strong>Categoría:</strong> {producto.categoria || '-'}</p>
        <p><strong>Marca:</strong> {producto.marca || '-'}</p>
        <p><strong>Modelo:</strong> {producto.modelo || '-'}</p>
        <p><strong>SKU:</strong> {producto.sku || '-'}</p>
        <p><strong>Precio Unitario:</strong> ${producto.precio_unitario?.toFixed(2)}</p>
        <p><strong>Precio Venta:</strong> ${producto.precio_venta?.toFixed(2)}</p>
        <p><strong>Stock:</strong> {producto.stock}</p>
        <p><strong>Ubicación:</strong> {producto.ubicacion || '-'}</p>
        <p><strong>Estado:</strong> {producto.estado}</p>
        <p><strong>Fecha Ingreso:</strong> {new Date(producto.fecha_ingreso).toLocaleDateString()}</p>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-2">Facturas Relacionadas</h2>
      {facturas.length === 0 ? (
        <p className="text-gray-500">Este producto no ha sido facturado aún.</p>
      ) : (
        <ul className="bg-white rounded shadow divide-y">
          {facturas.map((factura) => (
            <li key={factura._id} className="p-4">
              <p><strong>Factura: </strong> 
                <button
                    onClick={() => navigate(`/facturas/ver/${factura._id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    {factura._id}
                </button>
              </p>
              <p><strong>Cliente:</strong> {factura.cliente?.nombre || 'N/A'}</p>
              <p><strong>Tipo:</strong> {factura.tipo_documento}</p>
              <p><strong>Fecha:</strong> {new Date(factura.fecha).toLocaleDateString()}</p>
              <p><strong>Total:</strong> ${factura.total_con_iva?.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
