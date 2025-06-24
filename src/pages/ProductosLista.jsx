import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function ProductosLista() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const res = await api.get('/productos');
      setProductos(res.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarProducto = async (id) => {
    const confirmar = confirm('¿Estás seguro que deseas eliminar este producto?');
    if (!confirmar) return;

    try {
      await api.delete(`/productos/${id}`);
      setProductos(productos.filter((p) => p._id !== id));
    } catch (error) {
      alert('Error al eliminar producto.');
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Productos Registrados</h1>
        <button
          onClick={() => navigate('/productos/nuevo')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Agregar Producto
        </button>
      </div>

      {cargando ? (
        <div className="text-center text-gray-500 py-10">Cargando productos...</div>
      ) : productos.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No hay productos registrados.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-md">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left hidden md:table-cell">Categoría</th>
                <th className="px-4 py-2 text-left">Marca</th>
                <th className="px-4 py-2 text-left">Precio</th>
                <th className="px-4 py-2 text-left">Stock</th>
                <th className="px-4 py-2 text-left hidden md:table-cell">Estado</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {productos.map((producto, i) => (
                <tr key={producto._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 font-medium">
                    <button
                      onClick={() => navigate(`/productos/detalle/${producto._id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      {producto.nombre}
                    </button>
                  </td>
                  <td className="px-4 py-2">{producto.categoria || '-'}</td>
                  <td className="px-4 py-2">{producto.marca || '-'}</td>
                  <td className="px-4 py-2">${producto.precio_venta?.toFixed(2)}</td>
                  <td className="px-4 py-2">{producto.stock}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                        producto.estado === 'activo'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {producto.estado.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <div className="flex flex-col md:flex-row justify-center gap-2">
                      <button
                        onClick={() => navigate(`/productos/editar/${producto._id}`)}
                        className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarProducto(producto._id)}
                        className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
