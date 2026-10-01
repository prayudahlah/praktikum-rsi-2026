// src/docs/openapi.ts (bagian keamanan)
registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Token JWT dari endpoint POST /api/v1/auth/login.',
});

// Route terlindungi memakai daftar security ini.
const secured = [{ bearerAuth: [] }];

const unauthorizedResponse = {
  401: {
    description: 'Token tidak ada, kedaluwarsa, atau signature tidak cocok',
    content: { 'application/json': { schema: errorSchema } },
  },
};

const forbiddenResponse = {
  403: {
    description: 'Role dari token tidak punya izin untuk endpoint ini',
    content: { 'application/json': { schema: errorSchema } },
  },
};

registry.registerPath({
  method: 'get',
  path: '/api/v1/admin/reports',
  summary: 'Ringkasan laporan (khusus admin)',
  security: secured,
  responses: {
    200: {
      description: 'Ringkasan data',
      content: { 'application/json': { schema: reportSchema } },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});
