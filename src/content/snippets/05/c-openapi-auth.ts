// src/docs/openapi.ts (bagian endpoint /auth)
const authUserSchema = registry.register(
  'AuthUser',
  z.object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: 'Admin Kantin' }),
    email: z.string().openapi({ example: 'admin@kantin.test' }),
    role: z.enum(['admin', 'owner', 'customer']).openapi({ example: 'admin' }),
  }),
);

const registerInput = registry.register('RegisterInput', registerSchema);
const loginInput = registry.register('LoginInput', loginSchema);

registry.registerPath({
  method: 'post',
  path: '/api/v1/auth/register',
  summary: 'Daftar akun baru',
  request: {
    body: {
      description: 'Data pendaftaran',
      content: { 'application/json': { schema: registerInput } },
    },
  },
  responses: {
    201: {
      description: 'Akun berhasil dibuat',
      content: { 'application/json': { schema: registerResponse } },
    },
    400: { description: 'Body tidak valid', content: { 'application/json': { schema: errorSchema } } },
    409: { description: 'Email sudah terdaftar', content: { 'application/json': { schema: errorSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/auth/login',
  summary: 'Login dan terima token JWT',
  request: {
    body: {
      description: 'Kredensial login',
      content: { 'application/json': { schema: loginInput } },
    },
  },
  responses: {
    200: {
      description: 'Login berhasil, token dikembalikan',
      content: { 'application/json': { schema: loginResponse } },
    },
    400: { description: 'Body tidak valid', content: { 'application/json': { schema: errorSchema } } },
    401: { description: 'Email atau password salah', content: { 'application/json': { schema: errorSchema } } },
  },
});
