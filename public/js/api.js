// public/js/api.js
const API_BASE = '/api';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Helper function to handle responses
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || 
                        `HTTP error! status: ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }
  return response.json();
}

// Auth API
export const authApi = {
  login: (credentials) => {
    return fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(credentials),
      credentials: 'include'
    }).then(handleResponse);
  },
  
  register: (userData) => {
    return fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(userData)
    }).then(handleResponse);
  },
  
  logout: () => {
    return fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    }).then(handleResponse);
  },
  
  getProfile: () => {
    return fetch(`${API_BASE}/auth/profile`, {
      credentials: 'include'
    }).then(handleResponse);
  },
  
  refreshToken: () => {
    return fetch(`${API_BASE}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include'
    }).then(handleResponse);
  }
};

// Car API
export const carApi = {
  getAll: (query = {}) => {
    const queryString = new URLSearchParams(query).toString();
    return fetch(`${API_BASE}/cars?${queryString}`).then(handleResponse);
  },
  
  getFeatured: () => {
    return fetch(`${API_BASE}/cars/featured`).then(handleResponse);
  },
  
  getById: (id) => {
    return fetch(`${API_BASE}/cars/${id}`).then(handleResponse);
  },
  
  create: (carData) => {
    return fetch(`${API_BASE}/cars`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(carData),
      credentials: 'include'
    }).then(handleResponse);
  },
  
  update: (id, carData) => {
    return fetch(`${API_BASE}/cars/${id}`, {
      method: 'PUT',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(carData),
      credentials: 'include'
    }).then(handleResponse);
  },
  
  delete: (id) => {
    return fetch(`${API_BASE}/cars/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(handleResponse);
  },
  
  search: (keyword) => {
    return fetch(`${API_BASE}/cars/search?q=${encodeURIComponent(keyword)}`)
      .then(handleResponse);
  }
};

// Cart API
export const cartApi = {
  getCart: () => {
    return fetch(`${API_BASE}/cart`, {
      credentials: 'include'
    }).then(handleResponse);
  },
  
  addItem: (carId, quantity = 1) => {
    return fetch(`${API_BASE}/cart/items`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ carId, quantity }),
      credentials: 'include'
    }).then(handleResponse);
  },
  
  updateItem: (carId, quantity) => {
    return fetch(`${API_BASE}/cart/items/${carId}`, {
      method: 'PUT',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ quantity }),
      credentials: 'include'
    }).then(handleResponse);
  },
  
  removeItem: (carId) => {
    return fetch(`${API_BASE}/cart/items/${carId}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(handleResponse);
  },
  
  applyCoupon: (couponCode) => {
    return fetch(`${API_BASE}/cart/coupon`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ couponCode }),
      credentials: 'include'
    }).then(handleResponse);
  },
  
  checkout: (paymentMethod = 'cod') => {
    return fetch(`${API_BASE}/cart/checkout`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ paymentMethod }),
      credentials: 'include'
    }).then(handleResponse);
  }
};

// Order API
export const orderApi = {
  getAll: (query = {}) => {
    const queryString = new URLSearchParams(query).toString();
    return fetch(`${API_BASE}/orders?${queryString}`, {
      credentials: 'include'
    }).then(handleResponse);
  },
  
  getById: (id) => {
    return fetch(`${API_BASE}/orders/${id}`, {
      credentials: 'include'
    }).then(handleResponse);
  },
  
  cancel: (id) => {
    return fetch(`${API_BASE}/orders/${id}/cancel`, {
      method: 'PUT',
      credentials: 'include'
    }).then(handleResponse);
  },
  
  getPaymentMethods: () => {
    return fetch(`${API_BASE}/orders/payment-methods`).then(handleResponse);
  }
};

// Category API
export const categoryApi = {
  getAll: () => {
    return fetch(`${API_BASE}/categories`).then(handleResponse);
  },
  
  getWithCars: () => {
    return fetch(`${API_BASE}/categories/with-cars`).then(handleResponse);
  }
};

// User API
export const userApi = {
  getProfile: () => {
    return fetch(`${API_BASE}/users/profile`, {
      credentials: 'include'
    }).then(handleResponse);
  },
  
  updateProfile: (userData) => {
    return fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(userData),
      credentials: 'include'
    }).then(handleResponse);
  },
  
  updatePassword: (currentPassword, newPassword) => {
    return fetch(`${API_BASE}/users/password`, {
      method: 'PUT',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ currentPassword, newPassword }),
      credentials: 'include'
    }).then(handleResponse);
  },
  
  getOrders: () => {
    return fetch(`${API_BASE}/users/orders`, {
      credentials: 'include'
    }).then(handleResponse);
  }
};

// Upload API
export const uploadApi = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    return fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    }).then(handleResponse);
  }
};

// Helper functions
export const setAuthToken = (token) => {
  if (token) {
    DEFAULT_HEADERS['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  } else {
    delete DEFAULT_HEADERS['Authorization'];
    localStorage.removeItem('authToken');
  }
};

export const checkUnauthorized = (error) => {
  if (error.status === 401) {
    // Clear token and redirect to login
    setAuthToken(null);
    window.location.href = `/login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
    return true;
  }
  return false;
};

// Auto set token from localStorage on load
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('authToken');
  if (token) {
    setAuthToken(token);
  }
}

// Export all APIs
export default {
  auth: authApi,
  cars: carApi,
  cart: cartApi,
  orders: orderApi,
  categories: categoryApi,
  users: userApi,
  upload: uploadApi,
  setAuthToken,
  checkUnauthorized
};