import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function ClienteDetalle() {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const res = await api.get(`/clientes/${id}`);
        setCliente(res.data.cliente);
        setFacturas(res.data.facturas);
      } catch (error) {
        console.error('Error al obtener cliente:', error);
      } finally {
        setCargando(false);
      }
    };

    fetchCliente();
  }, [id]);

  if (cargando) return <div className="text-center text-gray-500 py-10">Cargando...</div>;
  if (!cliente) return <div className="text-center text-red-500 py-10">Cliente no encontrado.</div>;

  return (
    <div>
      <button
        onClick={() => navigate('/clientes/lista')}
        className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold text-blue-700 mb-4">Detalle del Cliente</h1>
      <div className="bg-white p-6 rounded shadow space-y-2">
        <p><strong>Nombre:</strong> {cliente.nombre}</p>
        <p><strong>Tipo:</strong> {cliente.tipo}</p>
        {cliente.tipo === 'Consumidor Final' ? (
          <p><strong>DUI:</strong> {cliente.dui}</p>
        ) : (
          <>
            <p><strong>NRC:</strong> {cliente.nrc}</p>
            <p><strong>Giro:</strong> {cliente.giro}</p>
          </>
        )}
        <p><strong>Dirección:</strong> {cliente.direccion || '-'}</p>
        <p><strong>Teléfono:</strong> {cliente.telefono || '-'}</p>
        <p><strong>Correo:</strong> {cliente.correo || '-'}</p>
        <p><strong>Distrito:</strong> {cliente.distrito || '-'}</p>
        <p><strong>Estado:</strong> {cliente.estado}</p>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-2">Facturas del Cliente</h2>
      {facturas.length === 0 ? (
        <p className="text-gray-500">Este cliente aún no tiene facturas.</p>
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
