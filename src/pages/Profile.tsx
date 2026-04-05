import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../hooks/useApi'
import Layout from '../components/Layout'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Wallet,
  Plus,
  CheckCircle,
  AlertCircle,
  Loader2,
  Edit2,
  X,
} from 'lucide-react'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const TOP_UP_AMOUNTS = [10000, 25000, 50000, 100000, 200000, 500000]

export default function Profile() {
  const { user } = useAuth()
  const [showTopUp, setShowTopUp] = useState(false)
  const [customAmount, setCustomAmount] = useState('')
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleTopUp = async () => {
    if (!user) return
    const amount = selectedAmount ?? parseInt(customAmount, 10)
    if (!amount || amount <= 0) {
      showNotification('error', 'Masukkan nominal top up yang valid.')
      return
    }
    if (amount < 5000) {
      showNotification('error', 'Minimal top up adalah Rp 5.000.')
      return
    }

    setLoading(true)
    try {
      const newBalance = user.balance + amount
      const updatedUser = await api.updateUser(user.id, { balance: newBalance })

      // Dispatch custom event so navbar updates in real-time
      window.dispatchEvent(
        new CustomEvent('user-updated', { detail: updatedUser })
      )

      showNotification(
        'success',
        `Top Up ${formatCurrency(amount)} berhasil! Saldo sekarang ${formatCurrency(newBalance)}.`
      )
      setShowTopUp(false)
      setSelectedAmount(null)
      setCustomAmount('')
    } catch {
      showNotification('error', 'Top Up gagal. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  const infoItems = [
    { icon: <User className="w-4 h-4" />, label: 'Nama Lengkap', value: user.name },
    { icon: <Mail className="w-4 h-4" />, label: 'Email', value: user.email },
    { icon: <Phone className="w-4 h-4" />, label: 'Nomor Telepon', value: user.phone },
    { icon: <MapPin className="w-4 h-4" />, label: 'Alamat', value: user.address },
  ]

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Notification */}
        {notification && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
              notification.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            {notification.message}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <p className="text-blue-100 text-sm">@{user.username}</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-6 space-y-4">
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-sm font-medium text-gray-800">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Saldo Anda</h3>
            </div>
            <button
              onClick={() => setShowTopUp((v) => !v)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {showTopUp ? (
                <>
                  <X className="w-4 h-4" />
                  Batal
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Top Up
                </>
              )}
            </button>
          </div>

          <div className="text-3xl font-bold text-blue-600">
            {formatCurrency(user.balance)}
          </div>

          {/* Top Up Form */}
          {showTopUp && (
            <div className="mt-6 pt-6 border-t border-blue-50 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  <Edit2 className="w-4 h-4 inline mr-1" />
                  Pilih nominal top up:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {TOP_UP_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        setSelectedAmount(amt)
                        setCustomAmount('')
                      }}
                      className={`py-2 px-3 rounded-xl text-sm font-medium border transition-colors ${
                        selectedAmount === amt
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                      }`}
                    >
                      {formatCurrency(amt)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Atau masukkan nominal lain:
                </p>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setSelectedAmount(null)
                  }}
                  placeholder="Contoh: 75000"
                  min="5000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                />
              </div>

              <button
                onClick={handleTopUp}
                disabled={loading || (!selectedAmount && !customAmount)}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Memproses...' : 'Konfirmasi Top Up'}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
