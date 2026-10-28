export function getMenus(): Promise<MenuItem[]> {
  return request<MenuItem[]>('/menu');
}

export function getMenuById(id: number): Promise<MenuItem> {
  return request<MenuItem>(`/menu/${id}`);
}

export function getStalls(): Promise<Stall[]> {
  return request<Stall[]>('/stalls');
}
