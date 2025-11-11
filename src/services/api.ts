const API_URL = import.meta.env.VITE_API_URL || 'https://supermarket-automation-backend-suai.onrender.com/api';

// Debug: Log the API URL being used
console.log('🔗 API URL:', API_URL);
console.log('🔑 Environment Variable:', import.meta.env.VITE_API_URL);

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

// Retry configuration
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 seconds
const COLD_START_TIMEOUT = 60000; // 60 seconds for cold start

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced fetch with retry logic
const fetchWithRetry = async (url: string, options: RequestInit = {}, attempt = 1): Promise<Response> => {
  try {
    console.log(`🌐 Attempt ${attempt}/${RETRY_ATTEMPTS}: Fetching ${url}`);
    
    // Increase timeout for first attempt (cold start)
    const timeout = attempt === 1 ? COLD_START_TIMEOUT : 30000;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    // If response is OK or it's a client error (4xx), don't retry
    if (response.ok || (response.status >= 400 && response.status < 500)) {
      return response;
    }
    
    // Server error (5xx), retry
    throw new Error(`Server error: ${response.status}`);
    
  } catch (error) {
    console.error(`❌ Attempt ${attempt} failed:`, error);
    
    // If it's the last attempt, throw the error
    if (attempt >= RETRY_ATTEMPTS) {
      if ((error as Error).name === 'AbortError') {
        throw new Error('Request timeout - Server might be waking up. Please try again in a moment.');
      }
      throw error;
    }
    
    // Wait before retrying (exponential backoff)
    const delay = RETRY_DELAY * attempt;
    console.log(`⏳ Waiting ${delay}ms before retry...`);
    await sleep(delay);
    
    // Retry
    return fetchWithRetry(url, options, attempt + 1);
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    if (error.sessionExpired) {
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
      window.location.reload();
    }
    throw error;
  }
  return response.json();
};

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    console.log('🔐 Attempting login to:', `${API_URL}/auth/login`);
    const response = await fetchWithRetry(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    console.log('📡 Login response status:', response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Login error:', errorData);
      throw new Error(errorData.message || 'Login failed');
    }
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await fetchWithRetry(`${API_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

export const usersAPI = {
  getAll: async () => {
    const response = await fetchWithRetry(`${API_URL}/users`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  create: async (userData: Partial<User> & { password: string }) => {
    const response = await fetchWithRetry(`${API_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  update: async (id: string, userData: Partial<User>) => {
    const response = await fetchWithRetry(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetchWithRetry(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
  },
};

export const itemsAPI = {
  getAll: async () => {
    const response = await fetchWithRetry(`${API_URL}/items`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch items');
    return response.json();
  },

  getAllForManager: async () => {
    const response = await fetchWithRetry(`${API_URL}/items/all`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch items');
    return response.json();
  },

  getLowStock: async () => {
    const response = await fetchWithRetry(`${API_URL}/items/low-stock`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch low stock items');
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetchWithRetry(`${API_URL}/items/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch item');
    return response.json();
  },

  create: async (itemData: Partial<Item>) => {
    const response = await fetchWithRetry(`${API_URL}/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error('Failed to create item');
    return response.json();
  },

  update: async (id: string, itemData: Partial<Item>) => {
    const response = await fetchWithRetry(`${API_URL}/items/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error('Failed to update item');
    return response.json();
  },

  updateStock: async (id: string, quantity: number) => {
    const response = await fetchWithRetry(`${API_URL}/items/${id}/stock`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error('Failed to update stock');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetchWithRetry(`${API_URL}/items/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete item');
    return response.json();
  },
};

export const salesAPI = {
  create: async (saleData: { items: SaleItem[] }) => {
    const response = await fetchWithRetry(`${API_URL}/sales`, {
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
    if
