import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function ClientesLista() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const res = await api.get('/clientes');
      setClientes(res.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarCliente = async (id) => {
    const confirmar = confirm('¿Estás seguro que deseas eliminar este cliente?');
    if (!confirmar) return;

    try {
      await api.delete(`/clientes/${id}`);
      setClientes(clientes.filter((c) => c._id !== id));
    } catch (error) {
      alert('Error al eliminar cliente.');
    }
  };

  const [filtros, setFiltros] = useState({
    nombre: '',
    tipo: '',
    documento: '',
    telefono: '',
    estado: '',
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      buscarFacturasConFiltros();
    }, 300);

    return () => clearTimeout(timeout);
  }, [filtros]);

  const buscarFacturasConFiltros = async () => {
    const query = new URLSearchParams(filtros).toString();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/clientes?${query}`);
    console.log(query)
    const data = await res.json();
    setClientes(data);
  };

return (
  <>
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Clientes Registrados</h1>
      <button
        onClick={() => navigate('/clientes/nuevo')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        + Agregar Cliente
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-md">
        <thead className="bg-gray-100 text-gray-700 text-sm">
          <tr>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Tipo</th>
            <th className="px-4 py-2 text-left">DUI / NRC</th>
            <th className="px-4 py-2 text-left hidden md:table-cell">Teléfono</th>
            <th className="px-4 py-2 text-left hidden md:table-cell">Correo</th>
            <th className="px-4 py-2 text-left hidden md:table-cell">Estado</th>
            <th className="px-4 py-2 text-center">Acciones</th>
          </tr>
          <tr>
            <th className="px-4 py-1">
              <input
                type="text"
                placeholder="Buscar..."
                value={filtros.nombre || ''}
                onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </th>
            <th className="px-4 py-1">
              <select
                value={filtros.tipo || ''}
                onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="">Todos</option>
                <option value="Consumidor Final">Consumidor Final</option>
                <option value="Contribuyente">Contribuyente</option>
              </select>
            </th>
            <th className="px-4 py-1">
              <input
                type="text"
                placeholder="DUI o NRC"
                value={filtros.documento || ''}
                onChange={(e) => setFiltros({ ...filtros, documento: e.target.value })}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </th>
            <th className="px-4 py-1 hidden md:table-cell">
            </th>
            <th className="px-4 py-1 hidden md:table-cell">
            </th>
            <th className="px-4 py-1 hidden md:table-cell">
              <select
                value={filtros.estado || ''}
                onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-800">
          {cargando ? (
            <tr>
              <td colSpan="7" className="text-center text-gray-500 py-10">
                Cargando clientes...
              </td>
            </tr>
          ) : clientes.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center text-gray-500 py-10">
                No hay clientes registrados.
              </td>
            </tr>
          ) : (
            clientes.map((cliente, i) => (
              <tr key={cliente._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2 font-medium">
                  <button
                    onClick={() => navigate(`/clientes/detalle/${cliente._id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    {cliente.nombre}
                  </button>
                </td>
                <td className="px-4 py-2">{cliente.tipo}</td>
                <td className="px-4 py-2">
                  {cliente.tipo === 'Consumidor Final' ? cliente.dui : cliente.nrc || '-'}
                </td>
                <td className="px-4 py-2 text-left hidden md:table-cell">{cliente.telefono || '-'}</td>
                <td className="px-4 py-2 text-left hidden md:table-cell">{cliente.correo || '-'}</td>
                <td className="px-4 py-2 text-left hidden md:table-cell">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                      cliente.estado === 'activo'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {cliente.estado.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex flex-col md:flex-row justify-center gap-2">
                    <button
                      onClick={() => navigate(`/clientes/editar/${cliente._id}`)}
                      className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarCliente(cliente._id)}
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
