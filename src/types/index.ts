export interface User {
  id: number
  username: string
  password: string
  name: string
  email: string
  phone: string
  balance: number
  address: string
}

export interface Package {
  id: number
  name: string
  quota: string
  validity: string
  price: number
  description: string
  category: string
}

export interface Transaction {
  id: number
  userId: number
  packageId: number
  packageName: string
  quota: string
  validity: string
  price: number
  date: string
  status: string
}
