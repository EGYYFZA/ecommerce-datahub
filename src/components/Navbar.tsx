import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Wifi, Home, List, User, LogOut } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white shadow-md border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <Wifi className="w-6 h-6" />
            <span>DataHub</span>
          </Link>

          {/* Nav Links */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Home className="w-4 h-4" />
                Beranda
              </Link>
              <Link
                to="/transactions"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/transactions')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <List className="w-4 h-4" />
                Transaksi
              </Link>
              <Link
                to="/profile"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/profile')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <User className="w-4 h-4" />
                Profil
              </Link>
            </div>
          )}

          {/* Right Section */}
          {user && (
            <div className="flex items-center gap-3">
              {/* Balance */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs text-gray-500">Saldo</span>
                <span className="text-sm font-semibold text-blue-600">
                  {formatCurrency(user.balance)}
                </span>
              </div>

              {/* User Avatar */}
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Nav */}
        {user && (
          <div className="flex md:hidden border-t border-blue-50 py-2 gap-1">
            <Link
              to="/"
              className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive('/')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <Home className="w-4 h-4" />
              Beranda
            </Link>
            <Link
              to="/transactions"
              className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive('/transactions')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <List className="w-4 h-4" />
              Transaksi
            </Link>
            <Link
              to="/profile"
              className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive('/profile')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <User className="w-4 h-4" />
              Profil
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
