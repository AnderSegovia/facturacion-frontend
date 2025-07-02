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
        setSku('');
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

    const [listaTemporal, setListaTemporal] = useState([]);

    const agregarAListaTemporal = () => {
    if (!producto || !cantidadAgregar) return;

    // Verifica si ya está en la lista
    const existente = listaTemporal.find(p => p._id === producto._id);
    if (existente) {
        // Actualiza cantidad sumando
        const nuevaLista = listaTemporal.map(p =>
        p._id === producto._id
            ? { ...p, cantidad: p.cantidad + parseInt(cantidadAgregar) }
            : p
        );
        setListaTemporal(nuevaLista);
    } else {
        // Agrega nuevo producto
        setListaTemporal([
        ...listaTemporal,
        {
            _id: producto._id,
            nombre: producto.nombre,
            cantidad: parseInt(cantidadAgregar),
            sku: producto.sku,
        },
        ]);
    }

    // Limpia campos
    setProducto(null);
    setCantidadAgregar('');
    setSku('');
    setMensaje('');
    };

    const actualizarCantidad = (id, nuevaCantidad) => {
    setListaTemporal(prev =>
        prev.map(p => (p._id === id ? { ...p, cantidad: parseInt(nuevaCantidad) } : p))
    );
    };

    const eliminarDeLista = (id) => {
    setListaTemporal(prev => prev.filter(p => p._id !== id));
    };

    const guardarTodoElStock = async () => {
    try {
        for (let item of listaTemporal) {
        // Buscar el producto completo para obtener el stock actual
        const res = await api.get(`/productos/sku/${item.sku}`);
        const producto = res.data;
        const nuevoStock = producto.stock + item.cantidad;

        // Actualiza stock como antes
        await api.put(`/productos/${producto._id}/stock`, { stock: nuevoStock });
        }

        setListaTemporal([]);
        alert("✅ Stock actualizado correctamente");
    } catch (error) {
        console.error(error);
        alert("❌ Error al actualizar el stock");
    }
    };


        return (
        <div className="p-4 sm:p-6 max-w-2xl mx-auto bg-white rounded shadow">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">Agregar Stock por SKU</h1>

            {/* Input + Botones */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-4 space-y-2 sm:space-y-0">
            <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Escanea o escribe SKU"
                className="flex-1 border px-3 py-2 rounded w-full"
            />
            <button
                onClick={() => buscarProducto(sku)}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
                Buscar
            </button>
            <button
                onClick={iniciarEscaner}
                className="bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
                Escanear
            </button>
            </div>

            {/* Escáner */}
            {escanerActivo && (
            <div
                id="scanner"
                className="w-full h-[300px] border mb-4 rounded"
                ref={scannerRef}
            ></div>
            )}

            {/* Mensaje */}
            {mensaje && <p className="text-blue-600 mb-4 text-sm">{mensaje}</p>}

            {/* Producto */}
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
                onClick={agregarAListaTemporal}
                disabled={!producto || !cantidadAgregar}
                className={`bg-blue-700 text-white px-4 py-2 rounded ${
                    (!producto || !cantidadAgregar) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                >
                Agregar a lista
                </button>
            </div>
            )}

                {listaTemporal.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-lg font-bold mb-2">Productos a ingresar</h2>
                    <table className="min-w-full border border-gray-300 rounded shadow text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                        <th className="px-3 py-2 text-left">SKU</th>
                        <th className="px-3 py-2 text-left">Producto</th>
                        <th className="px-3 py-2 text-left">Cantidad</th>
                        <th className="px-3 py-2 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaTemporal.map((item) => (
                        <tr key={item._id} className="border-t">
                            <td className="px-3 py-2">{item.sku}</td>
                            <td className="px-3 py-2">{item.nombre}</td>
                            <td className="px-3 py-2">
                            <input
                                type="number"
                                value={item.cantidad}
                                onChange={(e) => actualizarCantidad(item._id, e.target.value)}
                                className="w-20 border rounded px-2 py-1"
                            />
                            </td>
                            <td className="px-3 py-2 text-center">
                            <button
                                onClick={() => eliminarDeLista(item._id)}
                                className="text-red-600 hover:underline"
                            >
                                Eliminar
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>

                    <button
                    onClick={guardarTodoElStock}
                    className="mt-4 bg-blue-700 text-white px-4 py-2 rounded"
                    >
                    Confirmar y Guardar Todo
                    </button>
                </div>
                )}
        </div>
        );
    }
