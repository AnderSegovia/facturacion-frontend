import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function FacturasLista() {
  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const res = await api.get('/facturas');
        setFacturas(res.data);
      } catch (error) {
        console.error('Error al obtener facturas:', error);
      } finally {
        setCargando(false);
      }
    };
    fetchFacturas();
  }, []);

  const anularFactura = async (id) => {
    const confirmar = confirm('¿Seguro que deseas anular esta factura?');
    if (!confirmar) return;

    try {
      await api.patch(`/facturas/${id}`, { estado: 'anulado' });
      setFacturas((prev) =>
        prev.map((f) => (f._id === id ? { ...f, estado: 'anulado' } : f))
      );
    } catch (error) {
      console.error('Error al anular factura:', error);
    }
  };
    const [filtros, setFiltros] = useState({
    numero: '',
    cliente: '',
    tipo: '',
    fecha: '',
    estado: '',
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      buscarFacturasConFiltros();
    }, 300); // debounce para evitar muchas peticiones

    return () => clearTimeout(timeout);
  }, [filtros]);

  const buscarFacturasConFiltros = async () => {
    const query = new URLSearchParams(filtros).toString();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/facturas?${query}`);
    console.log(query)
    const data = await res.json();
    setFacturas(data);
  };


  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Facturas Registradas</h1>
        <button
          onClick={() => navigate('/facturas/nueva')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Nueva Factura
        </button>
      </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-md">
        <thead className="bg-gray-100 text-gray-700 text-sm">
          <tr>
            <th className="px-4 py-2 text-left">Número de Factura</th>
            <th className="px-4 py-2 text-left">Cliente</th>
            <th className="px-4 py-2 text-left">Tipo</th>
            <th className="px-4 py-2 text-left">Fecha</th>
            <th className="px-4 py-2 text-right">Total</th>
            <th className="px-4 py-2 text-center">Estado</th>
            <th className="px-4 py-2 text-center">Acciones</th>
          </tr>
          <tr>
            <th className="px-4 py-1">
              <input
                type="text"
                placeholder="Buscar..."
                value={filtros.numero || ''}
                onChange={(e) => setFiltros({ ...filtros, numero: e.target.value })}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </th>
            <th className="px-4 py-1">
              <input
                type="text"
                placeholder="Cliente..."
                value={filtros.cliente || ''}
                onChange={(e) => setFiltros({ ...filtros, cliente: e.target.value })}
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
                <option value="Ticket">Ticket</option>
                <option value="Credito Fiscal">Crédito Fiscal</option>
              </select>
            </th>
            <th className="px-2 py-1 text-center">
              <div className="flex flex-col space-y-[2px]">
                <input
                  type="date"
                  value={filtros.desde || ''}
                  onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })}
                  className="border border-gray-300 rounded px-1 py-[2px] text-xs"
                  placeholder="Desde"
                />
                <input
                  type="date"
                  value={filtros.hasta || ''}
                  onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })}
                  className="border border-gray-300 rounded px-1 py-[2px] text-xs"
                  placeholder="Hasta"
                />
              </div>
            </th>
            <th></th>
            <th className="px-4 py-1">
              <select
                value={filtros.estado || ''}
                onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="">Todos</option>
                <option value="activo">Activa</option>
                <option value="anulado">Anulada</option>
              </select>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cargando ? (
            <tr>
              <td colSpan="7" className="text-center text-gray-500 py-10">
                Cargando facturas...
              </td>
            </tr>
          ) : facturas.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center text-gray-500 py-10">
                No hay facturas registradas.
              </td>
            </tr>
          ) : (
            facturas.map((factura) => (
              <tr key={factura._id} className="border-t border-gray-200 text-sm">
                <td className="px-4 py-2">{factura.numero || factura._id}</td>
                <td className="px-4 py-2">{factura.cliente?.nombre}</td>
                <td className="px-4 py-2">{factura.tipo_documento}</td>
                <td className="px-4 py-2">{new Date(factura.fecha).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-right">${factura.total_con_iva.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                        factura.estado === 'activo'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {factura.estado.toUpperCase()}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => navigate(`/facturas/ver/${factura._id}`)}
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Ver
                    </button> 
                    {factura.estado === 'activo' && (
                      <button
                        onClick={() => anularFactura(factura._id)}
                        className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Anular
                      </button>
                    )}
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
