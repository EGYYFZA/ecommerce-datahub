import axios from 'axios'
import type { User, Package, Transaction } from '../types'

const BASE_URL = '/api'

export const api = {
  // Auth
  login: async (username: string, password: string): Promise<User | null> => {
    const res = await axios.get<User[]>(`${BASE_URL}/users`, {
      params: { username, password },
    })
    return res.data[0] ?? null
  },

  // Users
  getUser: async (id: number): Promise<User> => {
    const res = await axios.get<User>(`${BASE_URL}/users/${id}`)
    return res.data
  },
  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    const res = await axios.patch<User>(`${BASE_URL}/users/${id}`, data)
    return res.data
  },

  // Packages
  getPackages: async (): Promise<Package[]> => {
    const res = await axios.get<Package[]>(`${BASE_URL}/packages`)
    return res.data
  },

  // Transactions
  getTransactions: async (userId: number): Promise<Transaction[]> => {
    const res = await axios.get<Transaction[]>(`${BASE_URL}/transactions`, {
      params: { userId },
    })
    return res.data
  },
  createTransaction: async (
    data: Omit<Transaction, 'id'>
  ): Promise<Transaction> => {
    const res = await axios.post<Transaction>(`${BASE_URL}/transactions`, data)
    return res.data
  },
}
