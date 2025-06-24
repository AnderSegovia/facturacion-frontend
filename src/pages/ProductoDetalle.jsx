import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    api.get(`/productos/${id}`)
      .then(res => setProducto(res.data))
      .catch(err => {
        console.error('Error al obtener producto:', err);
        navigate('/productos/lista');
      });
  }, [id]);

  if (!producto) return <div className="text-center py-10 text-gray-500">Cargando producto...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded p-6">
      <h1 className="text-xl font-bold mb-4">Detalles del Producto</h1>
      <p><strong>Nombre:</strong> {producto.nombre}</p>
      <p><strong>Descripción:</strong> {producto.descripcion || 'N/A'}</p>
      <p><strong>Categoría:</strong> {producto.categoria || 'N/A'}</p>
      <p><strong>Marca:</strong> {producto.marca || 'N/A'}</p>
      <p><strong>Modelo:</strong> {producto.modelo || 'N/A'}</p>
      <p><strong>SKU:</strong> {producto.sku || 'N/A'}</p>
      <p><strong>Precio Unitario:</strong> ${producto.precio_unitario?.toFixed(2)}</p>
      <p><strong>Precio Venta:</strong> ${producto.precio_venta?.toFixed(2)}</p>
      <p><strong>Stock:</strong> {producto.stock}</p>
      <p><strong>Ubicación:</strong> {producto.ubicacion || 'N/A'}</p>
      <p><strong>Fecha de Ingreso:</strong> {new Date(producto.fecha_ingreso).toLocaleDateString()}</p>
      <p><strong>Estado:</strong> {producto.estado}</p>

      <button
        onClick={() => navigate('/productos/lista')}
        className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
      >
        Volver
      </button>
    </div>
  );
}
