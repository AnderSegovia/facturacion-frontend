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

  const [filtros, setFiltros] = useState({
    nombre: '',
    categoria: '',
    marca: '',
    modelo:'',
    sku: '',
    ubicacion: '',
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      buscarFacturasConFiltros();
    }, 300);

    return () => clearTimeout(timeout);
  }, [filtros]);

  const buscarFacturasConFiltros = async () => {
    const query = new URLSearchParams(filtros).toString();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/productos?${query}`);
    console.log(query)
    const data = await res.json();
    setProductos(data);
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-md">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left hidden md:table-cell">Categoría</th>
                <th className="px-4 py-2 text-left">Marca</th>
                <th className="px-4 py-2 text-left">Modelo</th>
                <th className="px-4 py-2 text-left">SKU</th>
                <th className="px-4 py-2 text-left">Precio</th>
                <th className="px-4 py-2 text-left">Stock</th>
                <th className="px-4 py-2 text-left">Ubicacion</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
              <tr>
                <th className="px-4 py-1">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={filtros.nombre}
                    onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </th>
                <th className="px-4 py-1 hidden md:table-cell">
                  <input
                    type="text"
                    placeholder="Categoría..."
                    value={filtros.categoria}
                    onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </th>
                <th className="px-4 py-1">
                  <input
                    type="text"
                    placeholder="Marca..."
                    value={filtros.marca}
                    onChange={(e) => setFiltros({ ...filtros, marca: e.target.value })}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </th>
                <th className="px-4 py-1">
                  <input
                    type="text"
                    placeholder="Modelo..."
                    value={filtros.modelo}
                    onChange={(e) => setFiltros({ ...filtros, modelo: e.target.value })}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </th>
                <th className="px-4 py-1">
                  <input
                    type="text"
                    placeholder="SKU..."
                    value={filtros.sku}
                    onChange={(e) => setFiltros({ ...filtros, sku: e.target.value })}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </th>
                <th></th> {/* Precio */}
                <th></th> {/* Stock */}
                <th className="px-4 py-1">
                  <input
                    type="text"
                    placeholder="Ubicación..."
                    value={filtros.ubicacion}
                    onChange={(e) => setFiltros({ ...filtros, ubicacion: e.target.value })}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </th>
                <th></th> {/* Acciones */}
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {cargando ? (
                <div className="text-center text-gray-500 py-10">Cargando productos...</div>
              ) : productos.length === 0 ? (
                <div className="text-center text-gray-500 py-10">No hay productos registrados.</div>
              ) : (
              productos.map((producto, i) => (
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
                  <td className="px-4 py-2">{producto.modelo || '-'}</td>
                  <td className="px-4 py-2">{producto.sku || '-'}</td>
                  <td className="px-4 py-2">${producto.precio_venta?.toFixed(2)}</td>
                  <td className="px-4 py-2">{producto.stock}</td>
                  <td className="px-4 py-2">{producto.ubicacion || '-'}</td>

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
              ))
              )}
            </tbody>
          </table>
        </div>
    </>
  );
}
