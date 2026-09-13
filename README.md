# Praktikum RSI 2026

Scrollytelling website untuk pembelajaran Praktikum Rekayasa Sistem Informasi, FATISDA UNS. Materi disajikan per pertemuan dengan narasi berjalan (scroll) berdampingan dengan diagram, lengkap dengan mode terang/gelap.

## Tech Stack

- **Astro** (static site generation)
- **React** (komponen interaktif)
- **Tailwind CSS v4** (CSS-first config)
- **Framer Motion** (animasi)
- **Shiki** (syntax highlighting, dual theme)
- **TypeScript**

## Persyaratan

- Node.js **>= 22.12.0**
- npm

## Menjalankan

```bash
npm install      # install dependensi
npm run dev      # server pengembangan (http://localhost:4321)
npm run build    # build produksi ke ./dist
npm run preview  # preview hasil build
```

Script lain:

```bash
npm run check    # type-check Astro/TypeScript
npm run format   # format kode dengan Prettier
```

## Struktur Proyek

```
src/
├── components/
│   ├── scrolly/   # kerangka scrollytelling (ScrollyLayout, Step, StepHeader, TOC)
│   └── ui/        # CodeBlock, TerminalBlock, FloatingBubbles, dsb.
├── content/
│   ├── meetings/  # konten tiap pertemuan (satu file .astro per pertemuan)
│   └── snippets/  # cuplikan kode mentah per pertemuan
├── data/
│   └── meetings.ts  # registry kurikulum (sumber kebenaran)
├── layouts/       # BaseLayout, MeetingLayout
├── lib/           # scrollyClient.ts (engine scroll), copyButton.ts
├── pages/         # index, 404, meetings/[slug]
└── styles/        # global.css (design token)
public/            # aset statis (diagram, ikon)
```

## Menambah Pertemuan Baru

1. Tambah entri di `src/data/meetings.ts` dan set `published: true`.
2. Buat file konten `src/content/meetings/<slug>.astro` (samakan `<slug>` dengan `slug` di registry).
3. Susun konten memakai komponen scrolly:

```astro
---
import { ScrollySection, ScrollyLayout, Step, StepHeader, SectionDivider, ScrollyTOC } from '../../components/scrolly';
import type { TOCSection } from '../../components/scrolly';

const tocSections: TOCSection[] = [
  { label: 'Bagian 1', items: [{ id: 'step-1', title: 'Judul Langkah' }] },
];
---

<ScrollySection>
  <ScrollyLayout defaultSrc="/diagrams/01/step1.webp">
    <Step id="step-1" diagram="/diagrams/01/step1.webp">
      <StepHeader title="Judul Langkah" tone="primary" />
      <p class="text-foreground-secondary leading-relaxed">Isi materi…</p>
    </Step>
  </ScrollyLayout>

  <ScrollyTOC sections={tocSections} />
</ScrollySection>

<script>
  import { initScrolly } from '../../lib/scrollyClient';
  initScrolly();
</script>
```

Halaman akan otomatis dibuat oleh `src/pages/meetings/[slug].astro`. Jika file konten belum ada, halaman menampilkan status terkunci.

## Konvensi

- **Warna**: gunakan token semantik (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`, dst.) yang otomatis menyesuaikan mode terang/gelap. Hindari warna hardcoded.
- **Tipografi**: body mengikuti skala responsif di `MeetingLayout`; heading lewat `StepHeader`.
- **Blok kode**: gunakan `CodeBlock` (snippet dari file) atau `TerminalBlock` (sesi terminal).
- **Konten**: Bahasa Indonesia.

## Lisensi

MIT
