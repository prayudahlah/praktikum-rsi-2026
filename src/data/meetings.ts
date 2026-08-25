export interface Meeting {
    slug: string;
    title: string;
    description: string;
    order: number;
    published: boolean;
}

export const meetings: Meeting[] = [
    {
        slug: '01-web-intro-git',
        title: 'Pengantar Web Application & Git Version Control',
        description: 'Peran frontend, backend, database. Client-server architecture. HTTP request-response cycle. Git dasar dan kolaborasi dengan remote repo.',
        order: 1,
        published: true,
    },
    {
        slug: '02-backend-rest-api-crud',
        title: 'Pengantar Backend & Implementasi REST API dengan CRUD Dasar',
        description: 'Routing, CRUD dasar (GET/POST/PUT/DELETE), response format.',
        order: 2,
        published: false,
    },
    {
        slug: '03-database-backend-crud',
        title: 'Recall Desain Database, Integrasi dengan Backend, ORM',
        description: 'Recall desain database (ERD), koneksi backend ke SQL Server, parameterized query dengan ORM',
        order: 3,
        published: false,
    },
    {
        slug: '04-api-security-docs',
        title: 'API Security dan Dokumentasi',
        description: 'Input validation, sanitization, error handling terstruktur, dokumentasi API dengan Swagger/OpenAPI.',
        order: 4,
        published: false,
    },
    {
        slug: '05-auth-middleware',
        title: 'Auth dan Middleware',
        description: 'Autentikasi login, token/session concept, middleware dasar, parameterized middleware, protected routes.',
        order: 5,
        published: false,
    },
    {
        slug: '06-frontend-react-tailwind',
        title: 'Pengantar Frontend, Dasar React + Tailwind',
        description: 'Component-based architecture, JSX/TSX & props, struktur project React, styling dengan Tailwind.',
        order: 6,
        published: false,
    },
    {
        slug: '07-form-routing-hooks',
        title: 'Form, Routing, dan React Hooks Dasar',
        description: 'Form handling & controlled input, React Router, event handling, useState & useEffect dasar.',
        order: 7,
        published: false,
    },
    {
        slug: '08-backend-frontend-integration',
        title: 'Integrasi Backend & Frontend',
        description: 'Fetch/axios ke REST API, menampilkan data backend di frontend, mengirim form ke backend, auth flow di sisi frontend.',
        order: 8,
        published: false,
    },
    {
        slug: '09-validation-error-handling',
        title: 'Validasi & Error Handling',
        description: 'Validasi input di frontend dan backend, konsistensi format error, error handling lintas layer, menampilkan error ke user.',
        order: 9,
        published: false,
    },
    {
        slug: '10-audit-log',
        title: 'Audit Log System',
        description: 'Desain tabel audit log, mencatat aktivitas CRUD, menampilkan riwayat log.',
        order: 10,
        published: false,
    },
    {
        slug: '11-testing-deployment',
        title: 'Testing & Deployment',
        description: 'Testing manual API, environment configuration & .env, dan tunnel-based exposure.',
        order: 11,
        published: false,
    },
    {
        slug: '12-best-practices-review',
        title: 'Best Practice, Penutup Materi, dan Materi Lanjutan',
        description: 'Review alur end-to-end aplikasi, best practice dasar, dan yang bisa dipelajari berikutnya',
        order: 12,
        published: false,
    },
];
