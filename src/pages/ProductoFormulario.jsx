import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../api';

export default function ProductoFormulario() {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    marca: '',
    modelo: '',
    sku: '',
    precio_unitario: '',
    stock: '',
    ubicacion: '',
    estado: 'activo',
  });

  const [mensaje, setMensaje] = useState('');
  const [escanerActivo, setEscanerActivo] = useState(false);
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const producto = {
        ...formData,
        precio_unitario: parseFloat(formData.precio_unitario),
        stock: parseInt(formData.stock || 0),
      };

      await api.post('/productos', producto);
      setMensaje('✅ Producto guardado correctamente');

      setFormData({
        nombre: '',
        descripcion: '',
        categoria: '',
        marca: '',
        modelo: '',
        sku: '',
        precio_unitario: '',
        stock: '',
        ubicacion: '',
        estado: 'activo',
      });
    } catch (error) {
      console.error(error);
      setMensaje('❌ Error al guardar el producto');
    }
  };

    const iniciarEscaner = async () => {
    setEscanerActivo(true);
    const html5QrCode = new Html5Qrcode("scanner");

    try {
      const config = { fps: 10, qrbox: 250 };
      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          setFormData(prev => ({ ...prev, sku: decodedText }));
          html5QrCode.stop();
          setEscanerActivo(false);
        }
      );
    } catch (err) {
      console.error("Error al iniciar escáner:", err);
      setEscanerActivo(false);
    }
  };


  return (
    <>
      <h1 className="text-2xl font-bold">Registrar Producto</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow">
        {mensaje && (
          <div className="md:col-span-2 text-blue-600 font-medium">{mensaje}</div>
        )}

        <input
          type="text"
          name="nombre"
          placeholder="Nombre del producto"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.nombre}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="categoria"
          placeholder="Categoría"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.categoria}
          onChange={handleChange}
        />

        <input
          type="text"
          name="marca"
          placeholder="Marca"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.marca}
          onChange={handleChange}
        />

        <input
          type="text"
          name="modelo"
          placeholder="Modelo"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.modelo}
          onChange={handleChange}
        />

        <div className="flex gap-2">
          <input
            type="text"
            name="sku"
            placeholder="Código SKU"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.sku}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={iniciarEscaner}
            className="bg-green-600 text-white px-3 rounded"
          >
            Escanear
          </button>
        </div>

        {escanerActivo && (
          <div id="scanner" className="md:col-span-2 w-full h-[300px] bg-gray-100 border rounded" ref={scannerRef}></div>
        )}

        <input
          type="number"
          name="precio_unitario"
          placeholder="Precio Unitario ($)"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.precio_unitario}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.stock}
          onChange={handleChange}
        />

        <input
          type="text"
          name="ubicacion"
          placeholder="Ubicación en bodega"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.ubicacion}
          onChange={handleChange}
        />

        <textarea
          name="descripcion"
          placeholder="Descripción del producto"
          rows="2"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
          value={formData.descripcion}
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
            onClick={() => navigate('/productos/lista')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Guardar Producto
          </button>
        </div>
      </form>
    </>
  );
}
