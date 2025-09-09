// API Configuration
export const API_CONFIG = {
  BASE_URL: "http://localhost:3000/api",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      PROFILE: "/auth/profile",
    },
    PENAWARAN: {
      BASE: "/penawaran",
      BY_ID: (id) => `/penawaran/${id}`,
      BY_STATUS: (status) => `/penawaran/status/${status}`,
    },
    ADMIN: {
      USERS: "/admin/users",
      LAYANAN: "/admin/layanan",
    },
    PENGELUARAN: "/pengeluaran",
  },
};

// API Helper Functions
export const getAuthToken = () => {
  // For now, we'll use userData from localStorage since JWT is not implemented yet
  const userData = localStorage.getItem("userData");
  if (userData) {
    try {
      const parsedData = JSON.parse(userData);
      return parsedData.id_user; // Return user ID as a simple token
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }
  return null;
};

export const getUserData = () => {
  const userData = localStorage.getItem("userData");
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }
  return null;
};

export const getAuthHeaders = () => {
  const userData = getUserData();
  if (!userData) {
    throw new Error("User data tidak ditemukan. Silakan login kembali.");
  }

  return {
    "Content-Type": "application/json",
    // Send user info in headers for authentication (temporary solution)
    "X-User-ID": userData.id_user.toString(),
    "X-User-Role": userData.role_user,
    "X-User-Email": userData.email_user,
  };
};

export const apiRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: getAuthHeaders(),
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, mergedOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

// Specific API functions for Penawaran
export const penawaranAPI = {
  // Get all penawaran
  getAll: () => apiRequest(API_CONFIG.ENDPOINTS.PENAWARAN.BASE),

  // Get penawaran by ID
  getById: (id) => apiRequest(API_CONFIG.ENDPOINTS.PENAWARAN.BY_ID(id)),

  // Create new penawaran
  create: (data) =>
    apiRequest(API_CONFIG.ENDPOINTS.PENAWARAN.BASE, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update penawaran
  update: (id, data) =>
    apiRequest(API_CONFIG.ENDPOINTS.PENAWARAN.BY_ID(id), {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete penawaran
  delete: (id) =>
    apiRequest(API_CONFIG.ENDPOINTS.PENAWARAN.BY_ID(id), {
      method: "DELETE",
    }),

  // Get by status
  getByStatus: (status) =>
    apiRequest(API_CONFIG.ENDPOINTS.PENAWARAN.BY_STATUS(status)),
};
