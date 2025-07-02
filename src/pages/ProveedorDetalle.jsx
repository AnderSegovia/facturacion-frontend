import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

export default function ProveedorDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proveedor, setProveedor] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerProveedor = async () => {
      try {
        const res = await api.get(`/proveedores/${id}`);
        setProveedor(res.data);
      } catch (err) {
        console.error('Error al obtener proveedor:', err);
      } finally {
        setCargando(false);
      }
    };

    obtenerProveedor();
  }, [id]);

  if (cargando) {
    return (
      <div className="text-center text-gray-500 py-10">
        Cargando información del proveedor...
      </div>
    );
  }

  if (!proveedor) {
    return (
      <div className="text-center text-red-500 py-10">
        No se encontró el proveedor.
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Detalle del Proveedor</h1>

      <div className="bg-white p-6 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-semibold">Nombre:</span>
          <div>{proveedor.nombre}</div>
        </div>

        <div>
          <span className="font-semibold">Teléfono:</span>
          <div>{proveedor.telefono}</div>
        </div>

        <div>
          <span className="font-semibold">Dirección:</span>
          <div>{proveedor.direccion}</div>
        </div>

        <div>
          <span className="font-semibold">Correo:</span>
          <div>{proveedor.email || '-'}</div>
        </div>

        <div>
          <span className="font-semibold">NRC:</span>
          <div>{proveedor.nrc}</div>
        </div>

        <div>
          <span className="font-semibold">Contacto:</span>
          <div>{proveedor.contacto || '-'}</div>
        </div>

        <div>
          <span className="font-semibold">Estado:</span>
          <span
            className={`inline-block px-2 py-1 mt-1 rounded-full text-xs font-bold ${
              proveedor.estado === 'activo'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {proveedor.estado.toUpperCase()}
          </span>
        </div>

        <div>
          <span className="font-semibold">Fecha de Registro:</span>
          <div>
            {new Date(proveedor.fecha_creado).toLocaleDateString('es-SV', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>

        <div className="md:col-span-2 mt-4">
          <button
            onClick={() => navigate('/proveedores/lista')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            ← Volver a la lista
          </button>
        </div>
      </div>
    </>
  );
}
