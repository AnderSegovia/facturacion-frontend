import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function ClienteDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerCliente = async () => {
      try {
        const res = await api.get(`/clientes/${id}`);
        setCliente(res.data);
      } catch (error) {
        console.error('Error al obtener cliente:', error);
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
    return <div className="text-center text-red-500 py-10">Cliente no encontrado.</div>;
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Detalles del Cliente</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
        <p><strong>Nombre:</strong> {cliente.nombre}</p>
        <p><strong>Tipo:</strong> {cliente.tipo}</p>
        <p><strong>DUI:</strong> {cliente.dui || '-'}</p>
        <p><strong>NRC:</strong> {cliente.nrc || '-'}</p>
        <p><strong>Giro:</strong> {cliente.giro || '-'}</p>
        <p><strong>Dirección:</strong> {cliente.direccion || '-'}</p>
        <p><strong>Teléfono:</strong> {cliente.telefono || '-'}</p>
        <p><strong>Correo:</strong> {cliente.correo || '-'}</p>
        <p><strong>Distrito:</strong> {cliente.distrito || '-'}</p>
        <p><strong>Estado:</strong> {cliente.estado}</p>
        <p><strong>Fecha de Creación:</strong> {new Date(cliente.fecha_creacion).toLocaleString()}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate(`/clientes/editar/${cliente._id}`)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Editar
        </button>
        <button
          onClick={() => navigate('/clientes/lista')}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
