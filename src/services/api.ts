const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface LoginCredentials {
  username: string;
  password: string;
}

interface User {
  _id: string;
  username: string;
  fullName: string;
  role: string;
  isActive?: boolean;
}

interface Item {
  _id: string;
  code: string;
  name: string;
  category: string;
  unitPrice: number;
  costPrice: number;
  unit: string;
  stock: number;
  minStock: number;
  isActive: boolean;
}

interface SaleItem {
  itemId: string;
  quantity: number;
}

interface Sale {
  _id: string;
  transactionNumber: string;
  items: any[];
  totalAmount: number;
  totalProfit: number;
  clerkName: string;
  saleDate: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get current user');
    return response.json();
  },
};

export const usersAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  create: async (userData: Partial<User> & { password: string }) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  update: async (id: string, userData: Partial<User>) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
  },
};

export const itemsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/items`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch items');
    return response.json();
  },

  getAllForManager: async () => {
    const response = await fetch(`${API_URL}/items/all`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch items');
    return response.json();
  },

  getLowStock: async () => {
    const response = await fetch(`${API_URL}/items/low-stock`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch low stock items');
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/items/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch item');
    return response.json();
  },

  create: async (itemData: Partial<Item>) => {
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error('Failed to create item');
    return response.json();
  },

  update: async (id: string, itemData: Partial<Item>) => {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error('Failed to update item');
    return response.json();
  },

  updateStock: async (id: string, quantity: number) => {
    const response = await fetch(`${API_URL}/items/${id}/stock`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error('Failed to update stock');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete item');
    return response.json();
  },
};

export const salesAPI = {
  create: async (saleData: { items: SaleItem[] }) => {
    const response = await fetch(`${API_URL}/sales`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(saleData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create sale');
    }
    return response.json();
  },

  getAll: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await fetch(`${API_URL}/sales?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch sales');
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/sales/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch sale');
    return response.json();
  },

  getStatistics: async (startDate?: string, endDate?: string, itemId?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (itemId) params.append('itemId', itemId);

    const response = await fetch(`${API_URL}/sales/statistics?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch statistics');
    return response.json();
  },
};
