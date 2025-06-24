import { Link, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Clientes', path: '/clientes/lista' },
  { name: 'Productos', path: '/productos/lista' },
  { name: 'Facturas', path: '/facturas/lista' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 space-y-6">
        <h2 className="text-xl font-bold text-blue-700">SS Facturación</h2>
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
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
