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

      {cargando ? (
        <div className="text-center text-gray-500 py-10">Cargando facturas...</div>
      ) : facturas.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No hay facturas registradas.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-md">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-2 text-left">Cliente</th>
                <th className="px-4 py-2 text-left">Tipo</th>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-right">Total</th>
                <th className="px-4 py-2 text-center">Estado</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {facturas.map((f, i) => (
                <tr key={f._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 font-medium text-blue-600 hover:underline cursor-pointer">
                    <span onClick={() => navigate(`/clientes/ver/${cliente._id}`)}>
                      {cliente.nombre}
                    </span>
                  </td>
                  <td className="px-4 py-2">{f.tipo_documento}</td>
                  <td className="px-4 py-2">
                    {new Date(f.fecha).toLocaleDateString('es-SV')}
                  </td>
                  <td className="px-4 py-2 text-right font-medium">
                    ${f.total_con_iva?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                        f.estado === 'activo'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {f.estado.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => navigate(`/facturas/ver/${f._id}`)}
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Ver
                    </button>
                    {f.estado === 'activo' && (
                      <button
                        onClick={() => anularFactura(f._id)}
                        className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Anular
                      </button>
                    )}
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
