import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/src/components/ui/button";
import { Globe2, Infinity, Network, Shield, Wifi } from "lucide-react";

interface Package {
  id: number;
  name: string;
  title: string;
  description: string;
  price: number;
}

export default function Home() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/packages");
        const data = await response.json();
        setPackages(data);
      } catch (err) {
        console.error("Failed to load packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleOrder = (pkgId?: number) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
    } else {
      if (pkgId) {
        navigate(`/order/${pkgId}`);
      } else {
        // Scroll to packages section
        document.getElementById("packages-section")?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      {/* Hero Section */}
      <section className="bg-[#e0f0ff] py-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm font-bold tracking-wider text-gray-800 mb-4 uppercase">E-Commerce Paket Data Internet</p>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Internet Lancar,<br />Harga Terjangkau
              </h1>
              <p className="text-lg text-gray-700 mb-8 max-w-lg">
                Nikmati layanan berkualitas dengan harga yang ramah dikantong.
              </p>
              <Button onClick={() => handleOrder()} className="bg-black hover:bg-gray-800 text-white rounded-full px-8 py-6 text-lg font-medium transition-all">
                Order Sekarang
              </Button>
            </motion.div>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative flex justify-center"
            >
              <div className="w-80 h-80 md:w-96 md:h-96 bg-gray-200 border-4 border-dashed border-gray-400 rounded-full flex items-center justify-center overflow-hidden">
                <span className="text-gray-500 font-medium text-center px-4">Hero Image Placeholder<br/>(Upload Asset Here)</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Network Section */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-bold tracking-wider text-gray-500 mb-2 uppercase">Jaringan Global</p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Nikmati Jaringan Secara Global</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
              DataHub hadir di seluruh dunia dengan jaringan yang tak terbatas di berbagai tempat dan dapat di nikmati dengan aman
            </p>
          </motion.div>

          {/* Placeholder for Global Network Illustration */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-4xl mx-auto h-80 bg-gray-100 border-4 border-dashed border-gray-300 rounded-3xl flex items-center justify-center mb-16"
          >
            <span className="text-gray-500 font-medium text-lg text-center">Global Network Asset Placeholder<br/>(Upload Asset Here)</span>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {[
              { icon: Globe2, title: "Jaringan Global", desc: "Akses Internasional dan dapat dijangkau dimana Saja", color: "text-green-500", bg: "bg-green-50" },
              { icon: Infinity, title: "Unlimited", desc: "Nikmati Jaringan Tak Terbatas Kemanapun", color: "text-pink-500", bg: "bg-pink-50" },
              { icon: Network, title: "Connecting", desc: "Terhubung ke Semua Orang Dengan Cepat", color: "text-blue-500", bg: "bg-blue-50" },
              { icon: Shield, title: "Security", desc: "Build the future of commerce with Shopify's powerful API", color: "text-red-500", bg: "bg-red-50" }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-full ${feature.bg} flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages-section" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <p className="text-sm font-bold tracking-wider text-gray-500 mb-2 uppercase">Nikmati Jaringan Global</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Internet Package</h2>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg, idx) => (
                <motion.div 
                  key={pkg.id}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col"
                >
                  <div className="bg-[#dbeafe] p-6 flex items-center gap-4">
                    <div className="bg-blue-500 p-3 rounded-full text-white">
                      <Wifi className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{pkg.title}</h4>
                    <p className="text-gray-600 text-sm mb-6 flex-grow">{pkg.description}</p>
                    <div className="mb-6">
                      <span className="text-gray-900 text-sm font-bold">Rp. </span>
                      <span className="text-3xl font-extrabold text-gray-900">{pkg.price.toLocaleString('id-ID')}</span>
                    </div>
                    <Button 
                      onClick={() => handleOrder(pkg.id)} 
                      className="w-full bg-[#5b9cff] hover:bg-blue-600 text-white font-semibold py-6 rounded-xl transition-colors"
                    >
                      Order Sekarang
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#60b0ff] py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-10 leading-tight">
              Nikmati Layanan Yang Luar Biasa<br />Dengan Jangkauan Global
            </h2>
            <Button onClick={() => handleOrder()} className="bg-black hover:bg-gray-800 text-white rounded-full px-10 py-6 text-lg font-medium transition-all">
              Order Sekarang
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
