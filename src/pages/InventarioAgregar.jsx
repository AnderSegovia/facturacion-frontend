import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Link } from 'react-router-dom';
import api from '../api';

export default function FacturaCompraAgregar() {
  const [sku, setSku] = useState('');
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [escanerActivo, setEscanerActivo] = useState(false);
  const [proveedor, setProveedor] = useState('');
  const [proveedores, setProveedores] = useState([]);
  const scannerRef = useRef(null);
  const [detalles, setDetalles] = useState([]);
  const [archivoPdf, setArchivoPdf] = useState(null);


  useEffect(() => {
    api.get('/proveedores').then(res => setProveedores(res.data)).catch(console.error);
  }, []);

  const buscarProducto = async (sku) => {
    try {
      const res = await api.get(`/factura-compra/sku/${sku}`);
      setProducto(res.data);
      setMensaje('');
      setSku('');
    } catch (err) {
      setProducto(null);
      setMensaje('Producto no encontrado');
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
          setSku(decodedText);
          buscarProducto(decodedText);
          html5QrCode.stop();
          setEscanerActivo(false);
        }
      );
    } catch (err) {
      console.error("Error al iniciar escáner:", err);
      setEscanerActivo(false);
    }
  };

  const agregarDetalle = () => {
    if (!producto || !cantidad || !precio) return;

    const existe = detalles.find(p => p._id === producto._id);
    if (existe) {
      setDetalles(prev =>
        prev.map(p =>
          p._id === producto._id
            ? { ...p, cantidad: p.cantidad + parseInt(cantidad) }
            : p
        )
      );
    } else {
      const cantidadInt = parseInt(cantidad);
      const precioNum = parseFloat(precio);
      const iva = +(precioNum * cantidadInt * 0.13).toFixed(2);
      const total = +(precioNum * cantidadInt + iva).toFixed(2);

      setDetalles([...detalles, {
        _id: producto._id,
        nombre: producto.nombre,
        sku: producto.sku,
        cantidad: cantidadInt,
        precio_unitario: precioNum,
        iva,
        total
      }]);
    }

    setProducto(null);
    setCantidad('');
    setPrecio('');
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    setDetalles(prev =>
      prev.map(p =>
        p._id === id
          ? {
              ...p,
              cantidad: parseInt(nuevaCantidad),
              iva: +(p.precio_unitario * nuevaCantidad * 0.13).toFixed(2),
              total: +(p.precio_unitario * nuevaCantidad * 1.13).toFixed(2),
            }
          : p
      )
    );
  };

  const eliminarDetalle = (id) => {
    setDetalles(prev => prev.filter(p => p._id !== id));
  };

  const guardarFactura = async () => {
    if (!proveedor || detalles.length === 0) {
      alert("Debes seleccionar un proveedor y agregar productos.");
      return;
    }

    try {
        console.log({
        proveedor,
        detalles: detalles.map(({ _id, cantidad, precio_unitario, iva, total }) => ({
            producto: _id,
            cantidad,
            precio_unitario,
            iva,
            total
        }))
        });

      const response = await api.post('/factura-compra', {
        proveedor,
        detalles: detalles.map(({ _id, cantidad, precio_unitario, iva, total }) => ({
          producto: _id,
          cantidad,
          precio_unitario,
          iva,
          total
        })),
      });

      alert(" Factura guardada correctamente");
      setProveedor('');
      setDetalles([]);
    } catch (err) {
      console.error(err);
      alert(" Error al guardar la factura");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto bg-white rounded shadow">
    {/* Encabezado con botón */}
    <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Registrar Factura de Compra</h1>
        <Link
        to="/historial-compras"
        className="bg-gray-700 text-white px-3 py-2 rounded text-sm hover:bg-gray-800 transition"
        >
        Ver Historial
        </Link>
    </div>

      {/* Selección de proveedor */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Proveedor</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={proveedor}
          onChange={e => setProveedor(e.target.value)}
        >
          <option value="">-- Selecciona un proveedor --</option>
          {proveedores.map(p => (
            <option key={p._id} value={p._id}>{p.nombre}</option>
          ))}
        </select>
      </div>

      {/* Input SKU y botones */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={sku}
          onChange={e => setSku(e.target.value)}
          placeholder="Escribe o escanea SKU"
          className="flex-1 border px-3 py-2 rounded"
        />
        <button onClick={() => buscarProducto(sku)} className="bg-blue-600 text-white px-4 py-2 rounded">Buscar</button>
        <button onClick={iniciarEscaner} className="bg-green-600 text-white px-4 py-2 rounded">Escanear</button>
      </div>

      {escanerActivo && (
        <div id="scanner" className="w-full h-[300px] border mb-4 rounded" ref={scannerRef}></div>
      )}

      {mensaje && <p className="text-blue-600 mb-4 text-sm">{mensaje}</p>}

      {/* Detalle del producto encontrado */}
      {producto && (
        <div className="space-y-3 mb-4">
          <div><strong>Producto:</strong> {producto.nombre}</div>
          <div><strong>Stock actual:</strong> {producto.stock}</div>

          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            placeholder="Cantidad"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="Precio unitario"
            className="w-full border px-3 py-2 rounded"
          />

          <button
            onClick={agregarDetalle}
            className="bg-blue-700 text-white px-4 py-2 rounded"
          >
            Agregar a lista
          </button>
        </div>
      )}

      {/* Tabla de productos */}
      {detalles.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Productos en la factura</h2>
          <table className="min-w-full border border-gray-300 rounded shadow text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-2">SKU</th>
                <th className="px-2 py-2">Nombre</th>
                <th className="px-2 py-2">Cant.</th>
                <th className="px-2 py-2">P/U</th>
                <th className="px-2 py-2">IVA</th>
                <th className="px-2 py-2">Total</th>
                <th className="px-2 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="px-2 py-1">{item.sku}</td>
                  <td className="px-2 py-1">{item.nombre}</td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      value={item.cantidad}
                      onChange={(e) => actualizarCantidad(item._id, e.target.value)}
                      className="w-16 border rounded px-1"
                    />
                  </td>
                  <td className="px-2 py-1">${item.precio_unitario.toFixed(2)}</td>
                  <td className="px-2 py-1">${item.iva.toFixed(2)}</td>
                  <td className="px-2 py-1 font-semibold">${item.total.toFixed(2)}</td>
                  <td className="px-2 py-1 text-center">
                    <button
                      onClick={() => eliminarDetalle(item._id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Factura PDF de la empresa (opcional)</label>
            <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setArchivoPdf(e.target.files[0])}
                className="text-sm"
            />
            </div>


          <button
            onClick={guardarFactura}
            className="mt-4 bg-blue-700 text-white px-4 py-2 rounded"
          >
            Guardar Factura de Compra
          </button>
        </div>
      )}
    </div>
  );
}
