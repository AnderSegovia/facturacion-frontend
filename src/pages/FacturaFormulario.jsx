import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function FacturaFormulario() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const [formData, setFormData] = useState({
    cliente: '',
    tipo_documento: 'Ticket',
    detalles: [],
    total_sin_iva: 0,
    total_iva: 0,
    total_con_iva: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [resClientes, resProductos] = await Promise.all([
        api.get('/clientes'),
        api.get('/productos'),
      ]);
      setClientes(resClientes.data);
      setProductos(resProductos.data);
    };
    fetchData();
  }, []);

  const handleAddDetalle = () => {
    setFormData((prev) => ({
      ...prev,
      detalles: [
        ...prev.detalles,
        {
          producto: '',
          descripcion: '',
          cantidad: 1,
          precio_unitario: 0,
          subtotal: 0,
          iva: 0,
          total: 0,
        },
      ],
    }));
  };

  const handleDetalleChange = (index, field, value) => {
    const nuevosDetalles = [...formData.detalles];
    const detalle = { ...nuevosDetalles[index], [field]: value };

    if (field === 'producto') {
      const prod = productos.find((p) => p._id === value);
      if (prod) {
        detalle.descripcion = prod.nombre;
        detalle.precio_unitario = prod.precio_venta || prod.precio_unitario;
        detalle.cantidad = 1;
      }
    }

    detalle.subtotal = detalle.cantidad * detalle.precio_unitario;
    detalle.iva = parseFloat((detalle.subtotal * 0.13).toFixed(2));
    detalle.total = parseFloat((detalle.subtotal + detalle.iva).toFixed(2));

    nuevosDetalles[index] = detalle;

    const total_sin_iva = nuevosDetalles.reduce((sum, d) => sum + d.subtotal, 0);
    const total_iva = nuevosDetalles.reduce((sum, d) => sum + d.iva, 0);
    const total_con_iva = nuevosDetalles.reduce((sum, d) => sum + d.total, 0);

    setFormData({
      ...formData,
      detalles: nuevosDetalles,
      total_sin_iva,
      total_iva,
      total_con_iva,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/facturas', formData);
      setMensaje('✅ Factura guardada correctamente');
      setTimeout(() => navigate('/facturas/lista'), 1500);
    } catch (error) {
      console.error(error);
      setMensaje('❌ Error al guardar la factura');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Registrar Factura</h1>
      {mensaje && <div className="text-blue-600 my-2">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow mt-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="cliente"
            value={formData.cliente}
            onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2"
            required
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((c) => (
              <option key={c._id} value={c._id}>{c.nombre}</option>
            ))}
          </select>

          <select
            name="tipo_documento"
            value={formData.tipo_documento}
            onChange={(e) => setFormData({ ...formData, tipo_documento: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="Ticket">Ticket</option>
            <option value="Credito Fiscal">Crédito Fiscal</option>
          </select>
        </div>

        <hr className="my-2" />

        <h2 className="text-lg font-semibold">Detalles</h2>
        {formData.detalles.map((detalle, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
            <select
              value={detalle.producto}
              onChange={(e) => handleDetalleChange(index, 'producto', e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1"
              required
            >
              <option value="">Producto</option>
              {productos.map((p) => (
                <option key={p._id} value={p._id}>{p.nombre}</option>
              ))}
            </select>

            <input
              type="number"
              value={detalle.cantidad}
              onChange={(e) => handleDetalleChange(index, 'cantidad', parseInt(e.target.value))}
              min="1"
              className="border border-gray-300 rounded-md px-2 py-1"
            />

            <input
              type="number"
              value={detalle.precio_unitario}
              onChange={(e) => handleDetalleChange(index, 'precio_unitario', parseFloat(e.target.value))}
              step="0.01"
              className="border border-gray-300 rounded-md px-2 py-1"
            />

            <div className="text-sm text-gray-700">Subtotal: ${detalle.subtotal.toFixed(2)}</div>
            <div className="text-sm text-gray-700">Total: ${detalle.total.toFixed(2)}</div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddDetalle}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
        >
          + Agregar Producto
        </button>

        <div className="mt-4 space-y-1 text-right text-sm text-gray-700">
          <div>Subtotal: ${formData.total_sin_iva.toFixed(2)}</div>
          <div>IVA (13%): ${formData.total_iva.toFixed(2)}</div>
          <div className="font-bold text-base">Total: ${formData.total_con_iva.toFixed(2)}</div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate('/facturas/lista')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Guardar Factura
          </button>
        </div>
      </form>
    </div>
  );
}
