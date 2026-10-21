// src/App.tsx (bagian handler keranjang)

  const addToCart = (menu: MenuItem, quantity: number) => {
    if (!menu.available || quantity < 1) return

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.menu.id === menu.id,
      )

      if (existingItem) {
        return currentItems.map((item) =>
          item.menu.id === menu.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }

      return [...currentItems, { menu, quantity }]
    })
  }

  const changeQuantity = (menuId: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((currentItems) =>
        currentItems.filter((item) => item.menu.id !== menuId),
      )
      return
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.menu.id === menuId
          ? { ...item, quantity }
          : item,
      ),
    )
  }

  const removeFromCart = (menuId: number) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.menu.id !== menuId),
    )
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      window.alert('Keranjang masih kosong. Silakan pilih menu terlebih dahulu.')
      return
    }

    const confirmed = window.confirm(
      'Lanjutkan checkout? Keranjang akan dikosongkan setelah dikonfirmasi.',
    )

    if (!confirmed) return

    setCartItems([])
    window.alert(
      'Checkout demo berhasil. Pesanan belum dikirim ke server.',
    )
  }
