import { useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../api';

export default function InventarioAgregar() {
  const [sku, setSku] = useState('');
  const [producto, setProducto] = useState(null);
  const [cantidadAgregar, setCantidadAgregar] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [escanerActivo, setEscanerActivo] = useState(false);
  const scannerRef = useRef(null);

  const buscarProducto = async (sku) => {
    try {
      const res = await api.get(`/productos/sku/${sku}`);
      setProducto(res.data);
      setMensaje('');
    } catch (err) {
      setProducto(null);
      setMensaje('Producto no encontrado con ese SKU');
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

  const actualizarStock = async () => {
    if (!producto || !cantidadAgregar || isNaN(cantidadAgregar)) return;

    try {
      const nuevoStock = producto.stock + parseInt(cantidadAgregar);
      await api.put(`/productos/${producto._id}/stock`, { stock: nuevoStock });
      setMensaje('✅ Stock actualizado correctamente');
      setProducto({ ...producto, stock: nuevoStock });
      setCantidadAgregar('');
    } catch (error) {
      setMensaje('❌ Error al actualizar stock');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Agregar Stock por SKU</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          placeholder="Escanea o escribe SKU"
          className="flex-1 border px-3 py-2 rounded"
        />
        <button onClick={() => buscarProducto(sku)} className="bg-blue-600 text-white px-4 rounded">Buscar</button>
        <button onClick={iniciarEscaner} className="bg-green-600 text-white px-4 rounded">Escanear</button>
      </div>

      {escanerActivo && (
        <div id="scanner" className="w-full h-[300px] border mb-4" ref={scannerRef}></div>
      )}

      {mensaje && <p className="text-blue-600 mb-4">{mensaje}</p>}

      {producto && (
        <div className="space-y-3">
          <div><strong>Producto:</strong> {producto.nombre}</div>
          <div><strong>Stock actual:</strong> {producto.stock}</div>

          <input
            type="number"
            min="1"
            value={cantidadAgregar}
            onChange={(e) => setCantidadAgregar(e.target.value)}
            placeholder="Cantidad a agregar"
            className="w-full border px-3 py-2 rounded"
          />

          <button
            onClick={actualizarStock}
            className="bg-blue-700 text-white px-4 py-2 rounded mt-2"
          >
            Actualizar Stock
          </button>
        </div>
      )}
    </div>
  );
}
