import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../hooks/useApi'
import type { Package } from '../types'
import Layout from '../components/Layout'
import {
  Wifi,
  Clock,
  Tag,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Loader2,
  Zap,
  Gamepad2,
  Play,
  Star,
} from 'lucide-react'

const categoryIcons: Record<string, React.ReactNode> = {
  hemat: <Tag className="w-5 h-5" />,
  reguler: <Wifi className="w-5 h-5" />,
  unlimited: <Play className="w-5 h-5" />,
  gaming: <Gamepad2 className="w-5 h-5" />,
  super: <Star className="w-5 h-5" />,
}

const categoryColors: Record<string, string> = {
  hemat: 'bg-green-100 text-green-700',
  reguler: 'bg-blue-100 text-blue-700',
  unlimited: 'bg-purple-100 text-purple-700',
  gaming: 'bg-orange-100 text-orange-700',
  super: 'bg-yellow-100 text-yellow-700',
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function Home() {
  const { user } = useAuth()
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState<number | null>(null)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('semua')

  useEffect(() => {
    api
      .getPackages()
      .then(setPackages)
      .finally(() => setLoading(false))
  }, [])

  const categories = [
    'semua',
    ...Array.from(new Set(packages.map((p) => p.category))),
  ]

  const filtered =
    selectedCategory === 'semua'
      ? packages
      : packages.filter((p) => p.category === selectedCategory)

  const showNotification = (
    type: 'success' | 'error',
    message: string
  ) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleBuy = async (pkg: Package) => {
    if (!user) return
    if (user.balance < pkg.price) {
      showNotification(
        'error',
        'Saldo tidak cukup. Silakan top up terlebih dahulu.'
      )
      return
    }

    setBuying(pkg.id)
    try {
      const newBalance = user.balance - pkg.price

      // Update balance
      const updatedUser = await api.updateUser(user.id, {
        balance: newBalance,
      })

      // Create transaction
      await api.createTransaction({
        userId: user.id,
        packageId: pkg.id,
        packageName: pkg.name,
        quota: pkg.quota,
        validity: pkg.validity,
        price: pkg.price,
        date: new Date().toISOString(),
        status: 'success',
      })

      // Dispatch custom event to update navbar balance
      window.dispatchEvent(
        new CustomEvent('user-updated', { detail: updatedUser })
      )

      showNotification(
        'success',
        `Berhasil membeli ${pkg.name}! Saldo dikurangi ${formatCurrency(pkg.price)}.`
      )
    } catch {
      showNotification('error', 'Pembelian gagal. Coba lagi.')
    } finally {
      setBuying(null)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6" />
            <h1 className="text-xl font-bold">Pilih Paket Internet</h1>
          </div>
          <p className="text-blue-100 text-sm">
            Selamat datang, <strong>{user?.name}</strong>! Saldo Anda:{' '}
            <strong>{formatCurrency(user?.balance ?? 0)}</strong>
          </p>
        </div>

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

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Package Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-blue-50">
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        categoryColors[pkg.category] ??
                        'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {categoryIcons[pkg.category]}
                      {pkg.category.charAt(0).toUpperCase() +
                        pkg.category.slice(1)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-base leading-tight">
                    {pkg.name}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">{pkg.description}</p>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <Wifi className="w-4 h-4" />
                      <span className="text-sm font-semibold">{pkg.quota}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{pkg.validity}</span>
                    </div>
                  </div>

                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(pkg.price)}
                  </div>

                  <button
                    onClick={() => handleBuy(pkg)}
                    disabled={buying === pkg.id}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {buying === pkg.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Beli Sekarang
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
