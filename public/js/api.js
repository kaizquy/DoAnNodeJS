const api = {
  auth: {
    async login({ username, password }) {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Lỗi đăng nhập');
      }

      return response.json(); // { user, token, ... }
    }
  },
  checkUnauthorized(error) {
    return error.message.includes('401') || error.message.includes('Unauthorized');
  }
};

export default api;
