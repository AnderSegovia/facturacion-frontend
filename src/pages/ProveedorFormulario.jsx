import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

export default function ProveedorFormulario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    email: '',
    nrc: '',
    contacto: '',
    estado: 'activo',
  });

  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (id) {
      obtenerProveedor();
    }
  }, [id]);

  const obtenerProveedor = async () => {
    try {
      const res = await api.get(`/proveedores/${id}`);
      setFormData(res.data);
    } catch (err) {
      setMensaje('❌ Error al cargar proveedor');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/proveedores/${id}`, formData);
        setMensaje('✅ Proveedor actualizado');
      } else {
        await api.post('/proveedores', formData);
        setMensaje('✅ Proveedor creado');
        setFormData({
          nombre: '',
          telefono: '',
          direccion: '',
          email: '',
          nrc: '',
          contacto: '',
          estado: 'activo',
        });
      }

      setTimeout(() => navigate('/proveedores'), 1000);
    } catch (error) {
      setMensaje('❌ Error al guardar proveedor');
      console.error(error);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold">{id ? 'Editar' : 'Registrar'} Proveedor</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 mt-4 rounded shadow"
      >
        {mensaje && (
          <div className="md:col-span-2 text-blue-600 font-medium">{mensaje}</div>
        )}

        <input
          type="text"
          name="nombre"
          placeholder="Nombre del proveedor"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="nrc"
          placeholder="NRC"
          value={formData.nrc}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="contacto"
          placeholder="Numero de persona de contacto"
          value={formData.contacto}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

        <div className="md:col-span-2 flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/proveedores/lista')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Guardar
          </button>
        </div>
      </form>
    </>
  );
}
