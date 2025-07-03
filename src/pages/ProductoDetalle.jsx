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

  if (cargando) {
    return <div className="text-center text-gray-500 py-10">Cargando información del producto...</div>;
  }

  if (!producto) {
    return <div className="text-center text-red-500 py-10">Producto no encontrado.</div>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Detalle del Producto</h1>

      <div className="bg-white p-6 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-semibold">ID:</span>
          <div>{producto._id}</div>
        </div>

        <div>
          <span className="font-semibold">Nombre:</span>
          <div>{producto.nombre}</div>
        </div>

        <div>
          <span className="font-semibold">Categoría:</span>
          <div>{producto.categoria || '-'}</div>
        </div>

        <div>
          <span className="font-semibold">Marca:</span>
          <div>{producto.marca || '-'}</div>
        </div>

        <div>
          <span className="font-semibold">Modelo:</span>
          <div>{producto.modelo || '-'}</div>
        </div>

        <div>
          <span className="font-semibold">SKU:</span>
          <div>{producto.sku || '-'}</div>
        </div>

        <div>
          <span className="font-semibold">Precio Unitario:</span>
          <div>${producto.precio_unitario?.toFixed(2)}</div>
        </div>

        <div>
          <span className="font-semibold">Precio Venta:</span>
          <div>${producto.precio_venta?.toFixed(2)}</div>
        </div>

        <div>
          <span className="font-semibold">Stock:</span>
          <div>{producto.stock}</div>
        </div>

        <div>
          <span className="font-semibold">Ubicación:</span>
          <div>{producto.ubicacion || '-'}</div>
        </div>

        <div>
          <span className="font-semibold">Estado:</span>
          <span
            className={`inline-block px-2 py-1 mt-1 rounded-full text-xs font-bold ${producto.estado === 'activo'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
              }`}
          >
            {producto.estado?.toUpperCase()}
          </span>
        </div>

        <div>
          <span className="font-semibold">Fecha Ingreso:</span>
          <div>{new Date(producto.fecha_ingreso).toLocaleDateString()}</div>
        </div>

        <div className="md:col-span-2 mt-4">
          <button
            onClick={() => navigate('/productos/lista')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            ← Volver a la lista
          </button>
        </div>
      </div>

      {/* Sección de Facturas Relacionadas */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Facturas Relacionadas</h2>
      {facturas.length === 0 ? (
        <p className="text-gray-500">Este producto no ha sido facturado aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {facturas.map((factura) => (
            <div
              key={factura._id}
              className="bg-white border border-gray-200 rounded-md p-4 shadow hover:shadow-md transition"
            >
              <p className="text-sm text-gray-600 mb-1">
                <strong>Factura:</strong>{' '}
                <button
                  onClick={() => navigate(`/facturas/ver/${factura._id}`)}
                  className="text-blue-600 hover:underline"
                >
                  {factura._id}
                </button>
              </p>
              <p className="text-sm"><strong>Cliente:</strong> {factura.cliente?.nombre || 'N/A'}</p>
              <p className="text-sm"><strong>Tipo:</strong> {factura.tipo_documento}</p>
              <p className="text-sm"><strong>Fecha:</strong> {new Date(factura.fecha).toLocaleDateString()}</p>
              <p className="text-sm"><strong>Total:</strong> ${factura.total_con_iva?.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
