export const authApi = {
  register: (input: RegisterInput) =>
    http.post<ApiResponse<User>>('/auth/register', input).then(data),
  login: (input: LoginInput) =>
    http.post<ApiResponse<User>>('/auth/login', input).then(data),
  me: () => http.get<ApiResponse<User>>('/auth/me').then(data),
  logout: () => http.post('/auth/logout'),
};
