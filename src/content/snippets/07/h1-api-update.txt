export function updateMenu(id: number, payload: MenuPayload): Promise<MenuItem> {
  return request<MenuItem>(`/menu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
