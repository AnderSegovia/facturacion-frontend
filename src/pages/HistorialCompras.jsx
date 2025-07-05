  import { useEffect, useState } from 'react';
  import api from '../api';
  import { useNavigate } from 'react-router-dom';

  export default function HistorialCompras() {
    const [facturas, setFacturas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    const [filtros, setFiltros] = useState({
      proveedor: '',
      desde: '',
      hasta: '',
      numero_factura: '',
      tipo_factura: '',
      forma_pago: ''
    });

    useEffect(() => {
      const timeout = setTimeout(() => {
        buscarFacturasCompraConFiltros();
      }, 300);
      return () => clearTimeout(timeout);
    }, [filtros]);

    const buscarFacturasCompraConFiltros = async () => {
      const query = new URLSearchParams(filtros).toString();
      try {
        const res = await api.get(`/factura-compra?${query}`);
        setFacturas(res.data);
      } catch (error) {
        console.error('Error al obtener facturas de compra:', error);
      } finally {
        setCargando(false);
      }
    };

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Facturas de Compra</h1>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-md">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-2 text-left">Proveedor</th>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">N° Factura</th>
                <th className="px-4 py-2 text-left">Tipo</th>
                <th className="px-4 py-2 text-left">Forma Pago</th>
                <th className="px-4 py-2 text-right">Subtotal</th>
                <th className="px-4 py-2 text-right">IVA</th>
                <th className="px-4 py-2 text-right">Total</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
              <tr>
                <th className="px-4 py-1">
                  <input
                    type="text"
                    placeholder="Proveedor..."
                    value={filtros.proveedor}
                    onChange={(e) => setFiltros({ ...filtros, proveedor: e.target.value })}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </th>
                <th className="px-2 py-1 text-center">
                  <div className="flex flex-col space-y-[2px]">
                    <input
                      type="date"
                      value={filtros.desde}
                      onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })}
                      className="border border-gray-300 rounded px-1 py-[2px] text-xs"
                      placeholder="Desde"
                    />
                    <input
                      type="date"
                      value={filtros.hasta}
                      onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })}
                      className="border border-gray-300 rounded px-1 py-[2px] text-xs"
                      placeholder="Hasta"
                    />
                  </div>
                </th>
                <th className="px-2 py-1">
                  <input
                    type="text"
                    placeholder="N° Factura"
                    value={filtros.numero_factura}
                    onChange={(e) => setFiltros({ ...filtros, numero_factura: e.target.value })}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </th>
                <th className="px-2 py-1">
                  <select
                    value={filtros.tipo_factura}
                    onChange={(e) => setFiltros({ ...filtros, tipo_factura: e.target.value })}
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    <option value="">Tipo</option>
                    <option value="Crédito Fiscal">Crédito Fiscal</option>
                    <option value="Consumidor Final">Consumidor Final</option>
                  </select>
                </th>
                <th className="px-2 py-1">
                  <select
                    value={filtros.forma_pago}
                    onChange={(e) => setFiltros({ ...filtros, forma_pago: e.target.value })}
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    <option value="">Pago</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Crédito">Crédito</option>
                  </select>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 py-10">
                    Cargando facturas de compra...
                  </td>
                </tr>
              ) : facturas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 py-10">
                    No hay facturas registradas.
                  </td>
                </tr>
              ) : (
                facturas.map((factura) => (
                  <tr key={factura._id} className="border-t border-gray-200 text-sm">
                    <td className="px-4 py-2">{factura.proveedor?.nombre || 'Sin proveedor'}</td>
                    <td className="px-4 py-2">{new Date(factura.fecha).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{factura.numero_factura}</td>
                    <td className="px-4 py-2">{factura.tipo_factura}</td>
                    <td className="px-4 py-2">{factura.forma_pago}</td>
                    <td className="px-4 py-2 text-right">${factura.total_sin_iva.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">${factura.total_iva.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">${factura.total_con_iva.toFixed(2)}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => navigate(`/facturas-compra/ver/${factura._id}`)}
                        className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  }