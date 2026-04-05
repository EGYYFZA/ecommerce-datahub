import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Wifi } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";

interface Package {
  id: string;
  name: string;
  title: string;
  description: string;
  price: number;
}

export default function Products() {
  const [packages, setPackages] = useState<Package[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/packages")
      .then((res) => res.json())
      .then((data) => setPackages(data))
      .catch((err) => console.error("Failed to fetch packages:", err));
  }, []);

  const handleOrder = (pkgId: string) => {
    navigate(`/order/${pkgId}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="text-center mb-16">
        <p className="text-sm font-bold tracking-wider text-gray-500 mb-2 uppercase">Nikmati Jaringan Global</p>
        <h2 className="text-4xl font-extrabold text-gray-900">Internet Package</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
              <div className="bg-blue-300 p-6 flex flex-col items-center justify-center text-white h-32">
                <Wifi className="w-10 h-10 mb-2" />
                <h3 className="text-xl font-bold text-center">{pkg.name}</h3>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">{pkg.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600 text-sm mb-6">{pkg.description}</p>
                <div className="text-3xl font-extrabold text-gray-900">
                  Rp. {pkg.price.toLocaleString("id-ID")}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 rounded-xl text-lg"
                  onClick={() => handleOrder(pkg.id)}
                >
                  Order Sekarang
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
