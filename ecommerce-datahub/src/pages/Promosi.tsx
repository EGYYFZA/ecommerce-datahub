import { motion } from "motion/react";
import { Tag, Percent, Gift } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";

export default function Promos() {
  const promos = [
    {
      id: 1,
      title: "Diskon Pengguna Baru",
      description: "Dapatkan potongan harga 20% untuk pembelian paket pertama Anda.",
      icon: <Percent className="w-8 h-8 text-blue-500" />,
      color: "bg-blue-100"
    },
    {
      id: 2,
      title: "Promo Akhir Pekan",
      description: "Beli paket Freedom 32GB di akhir pekan, dapatkan bonus kuota malam 10GB.",
      icon: <Gift className="w-8 h-8 text-purple-500" />,
      color: "bg-purple-100"
    },
    {
      id: 3,
      title: "Cashback Spesial",
      description: "Cashback hingga Rp 50.000 untuk pembelian paket Unlimited.",
      icon: <Tag className="w-8 h-8 text-green-500" />,
      color: "bg-green-100"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[70vh]"
    >
      <div className="text-center mb-16">
        <p className="text-sm font-bold tracking-wider text-gray-500 mb-2 uppercase">Penawaran Spesial</p>
        <h2 className="text-4xl font-extrabold text-gray-900">Promo Menarik Untukmu</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {promos.map((promo, index) => (
          <motion.div
            key={promo.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-full ${promo.color} flex items-center justify-center mb-6`}>
                  {promo.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{promo.title}</h3>
                <p className="text-gray-600">{promo.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}