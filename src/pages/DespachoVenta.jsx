// src/pages/FacturaDespacho.jsx
import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Link } from 'react-router-dom';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function FacturaDespacho() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clienteFiltro, setClienteFiltro] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [sku, setSku] = useState('');
  const [productoActual, setProductoActual] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  const [detalles, setDetalles] = useState([]);
  const [scannerActivo, setScannerActivo] = useState(false);
  const scannerRef = useRef(null);
    
  useEffect(() => {
    api.get('/clientes').then(res => setClientes(res.data)).catch(console.error);
    api.get('/productos').then(res => setProductos(res.data)).catch(console.error);
  }, []);

  // 🔎 Buscar cliente por nombre o DUI
  const clientesFiltrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(clienteFiltro.toLowerCase()) ||
    c.dui?.replace(/-/g, '').includes(clienteFiltro.replace(/-/g, ''))
  );

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setClienteFiltro('');
  };

  // 📦 Buscar producto por SKU
  const buscarProducto = async (codigoSku) => {
    try {
      const res = await api.get(`/factura-compra/sku/${codigoSku}`);
      setProductoActual(res.data);
      setSku('');
      setCantidad(1);
    } catch (err) {
      alert('Producto no encontrado');
      setProductoActual(null);
    }
  };

  const iniciarEscaner = async () => {
    setScannerActivo(true);
    const qr = new Html5Qrcode("scanner");

    try {
      await qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          buscarProducto(decodedText);
          qr.stop();
          setScannerActivo(false);
        }
      );
    } catch (err) {
      alert("No se pudo iniciar el escáner");
      setScannerActivo(false);
    }
  };

  const agregarProducto = () => {
    if (!productoActual || cantidad <= 0) return;

    const precio_unitario = productoActual.precio_venta || productoActual.precio_unitario || 0;
    const subtotal = +(precio_unitario * cantidad).toFixed(2);
    const iva = +(subtotal * 0.13).toFixed(2);
    const total = +(subtotal + iva).toFixed(2);

    setDetalles(prev => [
      ...prev,
      {
        producto: productoActual._id,
        descripcion: productoActual.nombre,
        cantidad,
        precio_unitario,
        subtotal,
        iva,
        total,
      }
    ]);

    setProductoActual(null);
    setCantidad(1);
  };

  const eliminarDetalle = (index) => {
    setDetalles(prev => prev.filter((_, i) => i !== index));
  };

  const total_sin_iva = detalles.reduce((sum, d) => sum + d.subtotal, 0);
  const total_iva = detalles.reduce((sum, d) => sum + d.iva, 0);
  const total_con_iva = detalles.reduce((sum, d) => sum + d.total, 0);

  const guardarFactura = async () => {
    if (!clienteSeleccionado || detalles.length === 0) {
      alert("Selecciona cliente y agrega productos");
      return;
    }

    try {
      await api.post('/facturas', {
        cliente: clienteSeleccionado._id,
        tipo_documento: 'Ticket',
        detalles,
        total_sin_iva,
        total_iva,
        total_con_iva
      });

      alert('Factura guardada');
      navigate('/facturas/lista');
    } catch (err) {
      alert('Error al guardar');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto bg-white rounded shadow">
    {/* Encabezado con botón */}
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold mb-4 text-center">📦 Despacho de Venta</h1>
        <Link
        to="/facturas/lista"
        className="bg-gray-700 text-white px-3 py-2 rounded text-sm hover:bg-gray-800 transition"
        >
        Ver Historial
        </Link>
    </div>

      {/* Cliente */}
      <div className="mb-4">
        <label className="font-semibold block mb-1">Buscar Cliente (nombre o DUI):</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={clienteFiltro}
          onChange={e => setClienteFiltro(e.target.value)}
        />
        {clienteFiltro && (
          <ul className="border rounded mt-1 max-h-40 overflow-y-auto bg-white text-sm">
            {clientesFiltrados.map(c => (
              <li
                key={c._id}
                className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
                onClick={() => seleccionarCliente(c)}
              >
                {c.nombre} ({c.dui})
              </li>
            ))}
          </ul>
        )}
        {clienteSeleccionado && (
          <div className="mt-2 text-green-700 font-semibold">
            Cliente seleccionado: {clienteSeleccionado.nombre}
          </div>
        )}
      </div>

      {/* Escáner y entrada SKU */}
      <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
        <input
          type="text"
          className="border px-3 py-2 rounded w-full sm:w-auto flex-1"
          placeholder="Escribe o escanea SKU"
          value={sku}
          onChange={e => setSku(e.target.value)}
        />
        <button onClick={() => buscarProducto(sku)} className="bg-blue-600 text-white px-4 py-2 rounded">Buscar</button>
        <button onClick={iniciarEscaner} className="bg-green-600 text-white px-4 py-2 rounded">📷 Escanear</button>
      </div>

      {/* Scanner */}
      {scannerActivo && (
        <div id="scanner" className="w-full h-60 border rounded mb-4" ref={scannerRef}></div>
      )}

      {/* Producto encontrado */}
        {productoActual && (
        <div className="bg-white border border-gray-300 rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">{productoActual.nombre}</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Stock disponible */}
            <div>
                <label className="text-sm font-medium text-gray-600">Stock disponible</label>
                <div className="text-base font-semibold text-gray-800">{productoActual.stock}</div>
            </div>

            {/* Precio editable */}
            <div>
                <label className="text-sm font-medium text-gray-600">Precio de venta ($)</label>
                <input
                type="number"
                min={(productoActual.precio_unitario * 1.10).toFixed(2)}
                step="0.01"
                value={productoActual.precio_venta || (productoActual.precio_unitario * 1.10).toFixed(2)}
                onChange={(e) =>
                    setProductoActual((prev) => ({
                    ...prev,
                    precio_venta: parseFloat(e.target.value),
                    }))
                }
                className={`mt-1 w-full border px-3 py-2 rounded-md shadow-sm text-sm focus:outline-none ${
                    (productoActual.precio_venta || 0) < productoActual.precio_unitario * 1.10
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
                />
                <p className="text-xs text-gray-500 mt-1">
                Mínimo permitido: ${(productoActual.precio_unitario * 1.10).toFixed(2)}
                </p>
            </div>

            {/* Cantidad */}
            <div>
                <label className="text-sm font-medium text-gray-600">Cantidad a vender</label>
                <input
                type="number"
                min="1"
                max={productoActual.stock}
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value))}
                className={`mt-1 w-full border px-3 py-2 rounded-md shadow-sm text-sm focus:outline-none ${
                    cantidad > productoActual.stock
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
                />
                <p className="text-xs text-gray-500 mt-1">Máximo permitido: {productoActual.stock}</p>
            </div>

            {/* Botón Agregar */}
            <div className="pt-2 md:pt-6">
                <button
                onClick={() => {
                    if (
                    cantidad > productoActual.stock ||
                    (productoActual.precio_venta || 0) < productoActual.precio_unitario * 1.10
                    ) return;

                    const subtotal = cantidad * productoActual.precio_venta;
                    const iva = parseFloat((subtotal * 0.13).toFixed(2));
                    const total = parseFloat((subtotal + iva).toFixed(2));

                    setDetalles(prev => [
                    ...prev,
                    {
                        producto: productoActual._id,
                        descripcion: productoActual.nombre,
                        cantidad,
                        precio_unitario: productoActual.precio_venta,
                        subtotal,
                        iva,
                        total,
                    },
                    ]);

                    // Limpiar formulario
                    setProductoActual(null);
                    setCantidad(1);
                }}
                disabled={
                    cantidad > productoActual.stock ||
                    (productoActual.precio_venta || 0) < productoActual.precio_unitario * 1.10
                }
                className={`w-full px-4 py-2 rounded-md text-white text-sm font-semibold transition ${
                    cantidad > productoActual.stock ||
                    (productoActual.precio_venta || 0) < productoActual.precio_unitario * 1.10
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                >
                Agregar producto
                </button>
            </div>
            </div>

            {/* Total en tiempo real */}
            <div className="mt-4 text-right text-sm text-gray-700">
            <p>Subtotal: ${(productoActual.precio_venta * cantidad).toFixed(2)}</p>
            <p>IVA (13%): ${((productoActual.precio_venta * cantidad) * 0.13).toFixed(2)}</p>
            <p className="font-semibold text-base">Total: ${(productoActual.precio_venta * cantidad * 1.13).toFixed(2)}</p>
            </div>

            {/* Mensajes de advertencia */}
            {(productoActual.precio_venta || 0) < productoActual.precio_unitario * 1.10 && (
            <div className="mt-2 text-sm text-red-600">
                ⚠️ El precio ingresado es inferior al mínimo permitido.
            </div>
            )}
            {cantidad > productoActual.stock && (
            <div className="text-sm text-red-600">
                ⚠️ La cantidad excede el stock disponible.
            </div>
            )}
        </div>
        )}


      {/* Detalles */}
        {detalles.length > 0 && (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Productos en la factura</h2>
            <div className="overflow-x-auto">
            <table className="min-w-full border text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                    <th className="px-3 py-2">Descripción</th>
                    <th className="px-3 py-2 text-center">Cantidad</th>
                    <th className="px-3 py-2 text-center">P/U</th>
                    <th className="px-3 py-2 text-center">IVA</th>
                    <th className="px-3 py-2 text-center">Total</th>
                    <th className="px-3 py-2 text-center">🗑</th>
                </tr>
                </thead>
                <tbody>
                {detalles.map((d, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50 transition">
                    <td className="px-3 py-2">{d.descripcion}</td>
                    <td className="px-3 py-2 text-center">{d.cantidad}</td>
                    <td className="px-3 py-2 text-center">${d.precio_unitario.toFixed(2)}</td>
                    <td className="px-3 py-2 text-center">${d.iva.toFixed(2)}</td>
                    <td className="px-3 py-2 text-center font-semibold">${d.total.toFixed(2)}</td>
                    <td className="px-3 py-2 text-center">
                        <button
                        onClick={() => eliminarDetalle(i)}
                        className="text-red-600 hover:text-red-800"
                        >
                        ✕
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

            {/* Totales */}
            <div className="text-right text-sm mt-4 space-y-1 text-gray-800">
            <div>Subtotal: <strong>${total_sin_iva.toFixed(2)}</strong></div>
            <div>IVA: <strong>${total_iva.toFixed(2)}</strong></div>
            <div className="text-base font-bold">Total a Pagar: ${total_con_iva.toFixed(2)}</div>
            </div>

            <div className="mt-6 flex gap-4 justify-end">
            <button
                onClick={() => navigate(-1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
                Cancelar
            </button>
            <button
                onClick={guardarFactura}
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded font-semibold"
            >
                Guardar Factura
            </button>
            </div>
        </div>
        )}

    </div>
  );
}
