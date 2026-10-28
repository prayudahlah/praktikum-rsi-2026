http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? '';
      const isSessionCheck = url.endsWith('/auth/me');
      const isLoginOrRegister =
        url.endsWith('/auth/login') || url.endsWith('/auth/register');

      if (!isSessionCheck && !isLoginOrRegister) {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }

    return Promise.reject(error);
  },
);
