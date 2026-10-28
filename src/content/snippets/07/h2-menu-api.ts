export const menuApi = {
  list: (params?: MenuQuery) =>
    http.get<ApiResponse<MenuItem[]>>('/menu', { params }).then(data),
  create: (input: MenuInput) =>
    http.post<ApiResponse<MenuItem>>('/menu', input).then(data),
  update: (id: number, input: MenuInput) =>
    http.put<ApiResponse<MenuItem>>(`/menu/${id}`, input).then(data),
  remove: (id: number) => http.delete(`/menu/${id}`),
};
