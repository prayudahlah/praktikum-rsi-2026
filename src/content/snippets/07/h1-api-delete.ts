export function deleteMenu(id: number): Promise<void> {
  return request<void>(`/menu/${id}`, {
    method: 'DELETE',
  });
}
