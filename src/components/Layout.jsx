import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { HiMenu } from 'react-icons/hi';

const navItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Clientes', path: '/clientes/lista' },
  { name: 'Productos', path: '/productos/lista' },
  { name: 'Facturas', path: '/facturas/lista' },
  { name: 'Inventario', path: '/inventario/agregar' },
];

export default function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar como drawer (oculto hasta que se abre) */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md p-4 space-y-6 transform transition-transform duration-300 z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <h2 className="text-xl font-bold text-blue-700">OneDevsAnd</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-3 py-2 rounded-md font-medium transition ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSidebarOpen(false)} // Cierra menú al hacer clic
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay en todas las resoluciones */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content, no se mueve */}
      <div className="flex-1 flex flex-col">
        {/* Header (botón visible siempre) */}
<header className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex items-center justify-between z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-700 text-2xl"
          >
            <HiMenu />
          </button>
          <h1 className="text-lg font-semibold text-blue-700">SS Facturación</h1>
        </header>

        {/* Page content */}
<main className="flex-1 p-6 pt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
