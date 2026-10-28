export function createMenu(payload: MenuPayload): Promise<MenuItem> {
  return request<MenuItem>('/menu', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
