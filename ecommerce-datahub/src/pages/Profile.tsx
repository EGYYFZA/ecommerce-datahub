import React, { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { User, Phone, Wallet, CheckCircle2 } from "lucide-react";

export default function Profile() {
  const userStr = localStorage.getItem("user");
  const [user, setUser] = useState(userStr ? JSON.parse(userStr) : null);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    const amount = parseInt(topUpAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      setLoading(false);
      return;
    }

    try {
      const newBalance = user.balance + amount;
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          balance: newBalance,
        }),
      });

      if (!response.ok) throw new Error("Failed to top up");

      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess(`Successfully topped up Rp ${amount.toLocaleString('id-ID')}`);
      setTopUpAmount("");
      
      // Force re-render to update balance in header
      window.dispatchEvent(new Event('user-updated'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-3 rounded-full">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customer Profile</h1>
          <p className="text-gray-500 mt-1">Manage your account and balance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-sm border-0">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Full Name</p>
                <p className="text-lg font-semibold text-gray-900">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <Phone className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                <p className="text-lg font-semibold text-gray-900">{user.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Current Balance</p>
                <p className="text-2xl font-bold text-blue-600">Rp {user.balance.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0">
          <CardHeader>
            <CardTitle>Top Up Balance</CardTitle>
            <CardDescription>Add funds to your account to purchase packages.</CardDescription>
          </CardHeader>
          <form onSubmit={handleTopUp}>
            <CardContent className="space-y-4">
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="text-sm font-medium">{success}</p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="amount">
                  Amount (Rp)
                </label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g. 50000"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  required
                  min="10000"
                  step="10000"
                  className="focus:ring-blue-500 focus:border-blue-500 text-lg py-6"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[50000, 100000, 150000].map((amt) => (
                  <Button
                    key={amt}
                    type="button"
                    variant="outline"
                    className="text-sm font-medium"
                    onClick={() => setTopUpAmount(amt.toString())}
                  >
                    {amt.toLocaleString('id-ID')}
                  </Button>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-xl shadow-sm transition-all"
                disabled={loading || !topUpAmount}
              >
                {loading ? "Processing..." : "Top Up Now"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </motion.div>
  );
}