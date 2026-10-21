// src/App.tsx (bagian tampilan)

  return (
    <div
      id="top"
      className="min-h-screen bg-page text-text"
    >
      <Header
        search={search}
        onSearchChange={setSearch}
      />

      <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Judul halaman */}
        <section className="mb-6">
          <p className="text-sm font-semibold text-primary-1">
            MAEM BOLO
          </p>

          <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Mau makan apa hari ini?
              </h1>

              <p className="mt-2 text-sm text-muted">
                Temukan makanan dan minuman favoritmu.
              </p>
            </div>

            <a
              href="#keranjang"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-primary-1 transition hover:bg-primary-soft"
            >
              <ShoppingCart size={18} />
              Keranjang
              <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs">
                {totalCartItems}
              </span>
            </a>
          </div>
        </section>

        {/* Katalog di kiri dan keranjang di kanan */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_370px]">
          <section
            id="menu"
            className="min-w-0 scroll-mt-24"
          >
            {/* Filter kategori */}
            <div className="mb-5 flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = activeCategory === category

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={isActive}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-primary-1 text-white'
                        : 'border border-border bg-surface text-muted hover:border-border-hover hover:text-primary-1'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>

            {/* Daftar menu */}
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold sm:text-xl">
                {activeCategory === 'Semua'
                  ? 'Semua Menu'
                  : `Menu ${activeCategory}`}
              </h2>

              <span className="text-sm text-muted">
                {filteredMenus.length} menu
              </span>
            </div>

            {filteredMenus.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredMenus.map((menu) => (
                  <MenuCard
                    key={menu.id}
                    menu={menu}
                    onSelect={setSelectedMenu}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-surface px-5 py-14 text-center">
                <p className="font-bold">
                  Menu tidak ditemukan
                </p>

                <p className="mt-2 text-sm text-muted">
                  Coba kata kunci lain atau pilih kategori berbeda.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setActiveCategory('Semua')
                  }}
                  className="mt-4 rounded-xl bg-primary-1 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-2"
                >
                  Reset Pencarian
                </button>
              </div>
            )}
          </section>

          {/* Keranjang belanja */}
          <aside
            className="min-w-0 scroll-mt-24 lg:sticky lg:top-5"
          >
            <CartPanel
              items={cartItems}
              onChangeQuantity={changeQuantity}
              onRemove={removeFromCart}
              onCheckout={handleCheckout}
            />
          </aside>
        </div>
      </main>

      <Footer />

      {/* Popup detail menu */}
      {selectedMenu && (
        <MenuDetailModal
          menu={selectedMenu}
          onClose={() => setSelectedMenu(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  )
}

export default App
