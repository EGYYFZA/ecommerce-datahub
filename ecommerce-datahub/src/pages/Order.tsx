import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle2, AlertCircle, ArrowLeft, Wifi } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface Package {
  id: number;
  name: string;
  title: string;
  description: string;
  price: number;
}

export default function Order() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"confirm" | "processing" | "success">("confirm");
  const [error, setError] = useState("");

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchPackage = async () => {
      try {
        const res = await fetch(`/api/packages/${id}`);
        if (!res.ok) throw new Error("Package not found");
        const data = await res.json();
        setPkg(data);
      } catch (err) {
        setError("Paket tidak ditemukan.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id, user, navigate]);

  const handlePurchase = async () => {
    if (!pkg || !user) return;
    setError("");

    if (user.balance < pkg.price) {
      setError("Saldo Anda tidak mencukupi untuk membeli paket ini.");
      return;
    }

    setStep("processing");

    try {
      // Simulate network delay for verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const transactionResponse = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          packageId: pkg.id,
          date: new Date().toISOString(),
          status: "success",
          amount: pkg.price,
        }),
      });

      if (!transactionResponse.ok) throw new Error("Transaction failed");

      const newBalance = user.balance - pkg.price;
      const userResponse = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: newBalance }),
      });

      if (!userResponse.ok) throw new Error("Failed to update balance");

      const updatedUser = await userResponse.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("user-updated"));

      setStep("success");
    } catch (err) {
      setError("Terjadi kesalahan saat memproses pembelian.");
      setStep("confirm");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !pkg) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">{error}</h2>
        <Button onClick={() => navigate("/")} className="mt-4">Kembali ke Beranda</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto py-12 px-4"
    >
      <button onClick={() => navigate("/")} className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {step === "confirm" && pkg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Verifikasi Pembelian</h2>
            
            <div className="bg-blue-50 rounded-xl p-6 mb-6 flex items-start gap-4 border border-blue-100">
              <div className="bg-blue-600 p-3 rounded-full text-white shrink-0">
                <Wifi className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900">{pkg.title}</h3>
                <p className="text-blue-700 mt-1">{pkg.description}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Harga Paket</span>
                <span className="font-semibold text-gray-900">Rp. {pkg.price.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Saldo Anda</span>
                <span className="font-semibold text-gray-900">Rp. {user?.balance.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Sisa Saldo Nanti</span>
                <span className={`font-bold ${user?.balance - pkg.price < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  Rp. {(user?.balance - pkg.price).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-3 border border-red-200">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <Button 
              onClick={handlePurchase} 
              disabled={user?.balance < pkg.price}
              className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-6 text-lg font-semibold transition-all"
            >
              Konfirmasi Pembelian
            </Button>
          </motion.div>
        )}

        {step === "processing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-16 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900">Memproses Pembelian...</h2>
            <p className="text-gray-500 mt-2">Mohon tunggu sebentar, jangan tutup halaman ini.</p>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-16 text-center">
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Pembelian Berhasil!</h2>
            <p className="text-gray-600 mb-8">Paket {pkg?.name} Anda telah aktif dan siap digunakan.</p>
            <Button 
              onClick={() => navigate("/transactions")} 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 text-lg font-semibold transition-all"
            >
              Lihat Transaksi
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
