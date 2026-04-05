import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, ChevronDown, Facebook, Twitter, Youtube, Instagram, Linkedin, Wallet } from "lucide-react";
import { Button } from "./UI/button";
import { getStoredUser } from "@/src/lib/auth";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getStoredUser());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("user-updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("user-updated", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <nav className="bg-white sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
                Data<span className="text-blue-400">Hub</span>
              </Link>
            </div>
            
            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                Beranda
              </Link>
              <Link to="/products" className={`flex items-center text-sm font-medium ${location.pathname === '/products' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                Produk <ChevronDown className="w-4 h-4 ml-1" />
              </Link>
              <Link to="/promosi" className={`flex items-center text-sm font-medium ${location.pathname === '/promosi' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                Promo <ChevronDown className="w-4 h-4 ml-1" />
              </Link>
              <Link to="/transactions" className={`text-sm font-medium ${location.pathname === '/transactions' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                Order
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="hidden lg:flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-full transition-colors border border-blue-200"
                  >
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm font-bold">
                      Rp {(Number(user.balance) || 0).toLocaleString('id-ID')}
                    </span>
                  </Link>
                  <div className="flex items-center space-x-3">
                    <Link to="/profile">
                      <Button variant="ghost" size="sm" className="text-gray-700 font-medium">
                        <User className="w-4 h-4 mr-2" />
                        {user.name}
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-600 hidden lg:block">Nikmati Layanan Sekarang</span>
                  <Link to="/login">
                    <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-6 transition-all">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="grow">
        <Outlet />
      </main>

      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center text-white font-medium cursor-pointer">
              <span className="mr-1">🌐</span> ID <ChevronDown className="w-4 h-4 ml-1" />
            </div>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Sitemap</Link>
            <Link to="#" className="hover:text-white transition-colors">Privacy Choices</Link>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors"><Youtube className="w-4 h-4" /></a>
            <a href="#" className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors"><Linkedin className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
