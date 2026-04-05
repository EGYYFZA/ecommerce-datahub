import { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/UI/card";
import { Receipt, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "@/src/lib/auth";

interface Transaction {
  id: number;
  userId: number;
  packageId: number;
  date: string;
  status: string;
  amount: number;
}

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  data: string;
  validity: number;
  color: string;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [packages, setPackages] = useState<Record<number, Package>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = getStoredUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [txRes, pkgRes] = await Promise.all([
          fetch(`/api/transactions?userId=${user.id}&_sort=date&_order=desc`),
          fetch("/api/packages"),
        ]);

        if (!txRes.ok || !pkgRes.ok) {
          throw new Error("Failed to fetch transactions data");
        }

        const txData = await txRes.json();
        const pkgData = await pkgRes.json();

        const pkgMap: Record<number, Package> = {};
        pkgData.forEach((p: Package) => {
          pkgMap[p.id] = p;
        });

        setTransactions(txData);
        setPackages(pkgMap);
      } catch {
        console.error("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, user]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-3 rounded-full">
          <Receipt className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Transaction History</h1>
          <p className="text-gray-500 mt-1">View your recent package purchases.</p>
        </div>
      </div>

      <Card className="shadow-sm border-0">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Receipt className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p>No transactions found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {transactions.map((tx) => {
                const pkg = packages[tx.packageId];
                return (
                  <div key={tx.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{pkg?.name || "Unknown Package"}</p>
                        <p className="text-sm text-gray-500">{format(new Date(tx.date), "dd MMM yyyy, HH:mm")}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">Rp {tx.amount.toLocaleString('id-ID')}</p>
                      <p className="text-sm text-green-600 font-medium capitalize">{tx.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
