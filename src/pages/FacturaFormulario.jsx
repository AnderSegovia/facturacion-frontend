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
      setMensaje(' Factura guardada correctamente');
      setTimeout(() => navigate('/facturas/lista'), 1500);
    } catch (error) {
      console.error(error);
      setMensaje(' Error al guardar la factura');
    }
  };
  const esFormularioValido = () => {
  if (formData.detalles.length === 0) return false;
  return formData.detalles.every((detalle) => {
    const producto = productos.find(p => p._id === detalle.producto);
    if (!producto) return false;

    const stockDisponible = producto.stock || 0;
    const precioMinimo = (producto.precio_unitario || 0) * 1.1;

    return (
      detalle.cantidad > 0 &&
      detalle.cantidad <= stockDisponible &&
      detalle.precio_unitario >= precioMinimo
    );
  });
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
        {formData.detalles.map((detalle, index) => {
          const productoSeleccionado = productos.find(p => p._id === detalle.producto);
          const stock = productoSeleccionado?.stock || 0;
          const precioBase = productoSeleccionado?.precio_unitario || 0;
          const precioMinimo = +(precioBase * 1.10).toFixed(2);

          const cantidadInvalida = detalle.cantidad > stock;
          const precioInvalido = detalle.precio_unitario < precioMinimo;

          return (
            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center border p-2 rounded mb-2">
              
              {/* Producto */}
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

              {/* Cantidad */}
              <input
                type="number"
                value={detalle.cantidad}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    handleDetalleChange(index, 'cantidad', val);
                  }
                }}
                min="1"
                max={stock}
                className={`border rounded-md px-2 py-1 ${cantidadInvalida ? 'border-red-500' : 'border-gray-300'}`}
              />
              {cantidadInvalida && (
                <div className="text-xs text-red-600 col-span-full">Cantidad no puede superar el stock ({stock})</div>
              )}

              {/* Precio Unitario */}
              <input
                type="number"
                value={detalle.precio_unitario}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) {
                    handleDetalleChange(index, 'precio_unitario', val);
                  }
                }}
                min={precioMinimo}
                step="0.01"
                className={`border rounded-md px-2 py-1 ${precioInvalido ? 'border-red-500' : 'border-gray-300'}`}
              />
              {precioInvalido && (
                <div className="text-xs text-red-600 col-span-full">
                  Precio debe ser mínimo ${precioMinimo.toFixed(2)}
                </div>
              )}

              {/* Mínimo y Stock */}
              <div className="text-xs text-gray-700">Mínimo: ${precioMinimo}</div>
              <div className="text-xs text-gray-700">Stock: {stock}</div>

              {/* Total */}
              <div className="text-xs text-gray-700">Total: ${detalle.total.toFixed(2)}</div>
            </div>
          );
        })}


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
            className={`px-4 py-2 rounded-md text-white ${
              esFormularioValido() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!esFormularioValido()}
          >
            Guardar Factura
          </button>

        </div>
      </form>
    </div>
  );
}
