import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Home from './pages/Home';
import ClientesLista from './pages/ClientesLista';
import ClienteFormulario from './pages/ClienteFormulario';
import ClienteDetalle from './pages/ClienteDetalle';
import ProductosLista from './pages/ProductosLista'; 
import ProductoFormulario from './pages/ProductoFormulario';
import ProductoDetalle from './pages/ProductoDetalle';
import FacturasLista from './pages/FacturasLista';   
import FacturaFormulario from './pages/FacturaFormulario';
import FacturaDetalle from './pages/FacturaDetalle';
import InventarioAgregar from './pages/InventarioAgregar'; 
import ProveedoresLista from './pages/ProveedorLista';   
import ProveedorFormulario from './pages/ProveedorFormulario';
import ProveedorDetalle from './pages/ProveedorDetalle';   

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="clientes/lista" element={<ClientesLista />} />
          <Route path="clientes/nuevo" element={<ClienteFormulario />} />
          <Route path="/clientes/detalle/:id" element={<ClienteDetalle />} />
          <Route path="productos/lista" element={<ProductosLista />} />
          <Route path="productos/nuevo" element={<ProductoFormulario />} />
          <Route path="/productos/detalle/:id" element={<ProductoDetalle />} />
          <Route path="facturas/lista" element={<FacturasLista />} />
          <Route path="/facturas/nueva" element={<FacturaFormulario />} />
          <Route path="/facturas/ver/:id" element={<FacturaDetalle />} />
          <Route path="/inventario/agregar" element={<InventarioAgregar />} />
          <Route path="/proveedores/lista" element={<ProveedoresLista />} />
          <Route path="proveedores/nuevo" element={<ProveedorFormulario />} />
          <Route path="/proveedores/detalle/:id" element={<ProveedorDetalle />} />
        </Route>
      </Routes>
    </Router>
  );
}
