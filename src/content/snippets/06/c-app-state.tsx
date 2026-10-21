
import { useMemo, useState } from 'react'
import { ShoppingCart } from 'lucide-react'

import Header from './components/Header'
import MenuCard from './components/MenuCard'
import MenuDetailModal from './components/MenuDetailModal'
import CartPanel, { type CartItem } from './components/CartPanel'
import Footer from './components/Footer'

import { menuItems, type MenuCategory, type MenuItem } from './data/menu'

function App() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] =
    useState<'Semua' | MenuCategory>('Semua')
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const categories: ('Semua' | MenuCategory)[] = [
    'Semua',
    'Makanan',
    'Minuman',
    'Camilan',
  ]

  const filteredMenus = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return menuItems.filter((menu) => {
      const matchesSearch =
        menu.name.toLowerCase().includes(keyword) ||
        menu.description.toLowerCase().includes(keyword) ||
        menu.tenant.toLowerCase().includes(keyword)

      const matchesCategory =
        activeCategory === 'Semua' ||
        menu.category === activeCategory

      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory])

  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  )

// Handler keranjang dan checkout menyusul di bagian bawah App.
