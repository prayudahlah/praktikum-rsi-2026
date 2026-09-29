// Satu endpoint, empat pemeriksaan berurutan.
// Urutan pemasangan middleware = urutan pemeriksaan.
router.post(
  '/stalls',
  authenticate,           // 1. token valid?         -> 401 kalau tidak
  authorize('owner'),     // 2. role-nya boleh?      -> 403 kalau tidak
  validate(createSchema), // 3. body sesuai aturan?  -> 400 kalau tidak
  stallController.create, // 4. baru logika bisnis dijalankan
);
