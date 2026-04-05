import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../hooks/useApi'
import type { Transaction } from '../types'
import Layout from '../components/Layout'
import {
  List,
  CheckCircle,
  Wifi,
  Clock,
  Loader2,
  Receipt,
} from 'lucide-react'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

export default function Transactions() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    api
      .getTransactions(user.id)
      .then((data) =>
        setTransactions(data.sort((a, b) => (a.date < b.date ? 1 : -1)))
      )
      .finally(() => setLoading(false))
  }, [user])

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-1">
            <Receipt className="w-6 h-6" />
            <h1 className="text-xl font-bold">Riwayat Transaksi</h1>
          </div>
          <p className="text-blue-100 text-sm">
            Semua pembelian paket yang pernah Anda lakukan
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-blue-100">
            <List className="w-12 h-12 text-blue-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Belum ada transaksi</p>
            <p className="text-gray-400 text-sm mt-1">
              Beli paket internet pertama Anda di halaman beranda.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <Wifi className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {tx.packageName}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Wifi className="w-3 h-3" />
                          {tx.quota}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {tx.validity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(tx.date)}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="text-right shrink-0">
                    <p className="font-bold text-blue-600">
                      {formatCurrency(tx.price)}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === 'success'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {tx.status === 'success' && (
                        <CheckCircle className="w-3 h-3" />
                      )}
                      {tx.status === 'success' ? 'Berhasil' : 'Gagal'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
