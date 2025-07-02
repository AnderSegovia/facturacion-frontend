import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Clientes() {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'Consumidor Final',
    dui: '',
    nrc: '',
    giro: '',
    direccion: '',
    telefono: '',
    correo: '',
    distrito: '',
    estado: 'activo',
  });
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/clientes', formData);
      setMensaje(' Cliente guardado correctamente');
      setFormData({
        nombre: '',
        tipo: 'Consumidor Final',
        dui: '',
        nrc: '',
        giro: '',
        direccion: '',
        telefono: '',
        correo: '',
        distrito: '',
        estado: 'activo',
      });
    } catch (error) {
      console.error(error);
      setMensaje(' Error al guardar cliente');
    }
  };

  return (
    <>
    <h1 className="text-2xl font-bold">Registrar Cliente</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow">
        {mensaje && (
          <div className="md:col-span-2 text-blue-600 font-medium">{mensaje}</div>
        )}

        <input
          type="text"
          name="nombre"
          placeholder="Nombre del cliente"
  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.nombre}
          onChange={handleChange}
          required
        />

        <select
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Consumidor Final">Consumidor Final</option>
          <option value="Contribuyente">Contribuyente</option>
        </select>

        <input
          type="text"
          name="dui"
          placeholder="DUI"
  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.dui}
          onChange={handleChange}
        />

        <input
          type="text"
          name="nrc"
          placeholder="NRC"
  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.nrc}
          onChange={handleChange}
        />

        <input
          type="text"
          name="giro"
          placeholder="Giro"
  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.giro}
          onChange={handleChange}
        />

        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.direccion}
          onChange={handleChange}
        />

        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.telefono}
          onChange={handleChange}
        />

        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.correo}
          onChange={handleChange}
        />

        <input
          type="text"
          name="distrito"
          placeholder="Distrito"
  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.distrito}
          onChange={handleChange}
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
            onClick={() => navigate('/clientes/lista')}
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
