import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

export default function ClienteDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerCliente = async () => {
      try {
        const res = await api.get(`/clientes/${id}`);
        setCliente(res.data.cliente);
        setFacturas(res.data.facturas || []);
      } catch (err) {
        console.error('Error al obtener cliente:', err);
      } finally {
        setCargando(false);
      }
    };

    obtenerCliente();
  }, [id]);

  if (cargando) {
    return <div className="text-center text-gray-500 py-10">Cargando información del cliente...</div>;
  }

  if (!cliente) {
    return <div className="text-center text-red-500 py-10">No se encontró el cliente.</div>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Detalle del Cliente</h1>

      <div className="bg-white p-6 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-semibold">Nombre:</span>
          <div>{cliente.nombre}</div>
        </div>

        <div>
          <span className="font-semibold">Tipo:</span>
          <div>{cliente.tipo}</div>
        </div>

        {cliente.tipo === 'Consumidor Final' ? (
          <div>
            <span className="font-semibold">DUI:</span>
            <div>{cliente.dui}</div>
          </div>
        ) : (
          <>
            <div>
              <span className="font-semibold">NRC:</span>
              <div>{cliente.nrc}</div>
            </div>
            <div>
              <span className="font-semibold">Giro:</span>
              <div>{cliente.giro || '-'}</div>
            </div>
          </>
        )}

        <div>
          <span className="font-semibold">Dirección:</span>
          <div>{cliente.direccion || '-'}</div>
        </div>

        <div>
          <span className="font-semibold">Teléfono:</span>
          <div>{cliente.telefono || '-'}</div>
        </div>

        <div>
          <span className="font-semibold">Correo:</span>
          <div>{cliente.correo || '-'}</div>
        </div>

        <div>
          <span className="font-semibold">Distrito:</span>
          <div>{cliente.distrito || '-'}</div>
        </div>

        <div>
          <span className="font-semibold">Estado:</span>
          <span
            className={`inline-block px-2 py-1 mt-1 rounded-full text-xs font-bold ${
              cliente.estado === 'activo'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {cliente.estado?.toUpperCase()}
          </span>
        </div>

        <div className="md:col-span-2 mt-4">
          <button
            onClick={() => navigate('/clientes/lista')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            ← Volver a la lista
          </button>
        </div>
      </div>

      {/* Sección de Facturas */}

      <h2 className="text-xl font-semibold mt-10 mb-4">Facturas del Cliente</h2>
      {facturas.length === 0 ? (
        <p className="text-gray-500">Este cliente aún no tiene facturas registradas.</p>
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
