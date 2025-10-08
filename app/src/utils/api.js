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

  console.log("🔐 Auth headers being sent:", {
    "X-User-ID": userData.id_user.toString(),
    "X-User-Role": userData.role_user,
    "X-User-Email": userData.email_user,
  });

  console.log("🔍 Full userData from localStorage:", userData);

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
    console.log(
      `🌐 Making API ${options.method || "GET"} request to:`,
      `${API_CONFIG.BASE_URL}${url}`
    );
    console.log("🌐 Request options:", {
      method: mergedOptions.method || "GET",
      headers: mergedOptions.headers,
      bodyPreview: mergedOptions.body
        ? `${mergedOptions.body.substring(0, 100)}...`
        : null,
    });

    const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, mergedOptions);

    // Try to parse the response body regardless of status
    let responseData;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      // Enhanced error with response data
      const enhancedError = new Error(`HTTP error! status: ${response.status}`);
      enhancedError.status = response.status;
      enhancedError.responseData = responseData;
      throw enhancedError;
    }

    console.log("🌐 API Response:", responseData);
    return responseData;
  } catch (error) {
    console.error("❌ API Request Error:", error);
    console.error("❌ Error details:", error.responseData || error.message);
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

  // Get hasil penawaran
  getHasil: (id) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.PENAWARAN.BASE}/${id}/hasil`),

  // Calculate result
  calculateResult: (id) =>
    apiRequest(
      `${API_CONFIG.ENDPOINTS.PENAWARAN.BASE}/${id}/calculate-result`,
      {
        method: "POST",
      }
    ),
};

// Specific API functions for Pengeluaran
export const pengeluaranAPI = {
  // Get all pengeluaran
  getAll: () => apiRequest(API_CONFIG.ENDPOINTS.PENGELUARAN),

  // Get pengeluaran by ID
  getById: (id) => apiRequest(`${API_CONFIG.ENDPOINTS.PENGELUARAN}/${id}`),

  // Create new pengeluaran
  create: (data) =>
    apiRequest(API_CONFIG.ENDPOINTS.PENGELUARAN, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update pengeluaran
  update: (id, data) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.PENGELUARAN}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Hapus pengeluaran
  delete: (id) =>
    apiRequest(`${API_CONFIG.ENDPOINTS.PENGELUARAN}/${id}`, {
      method: "DELETE",
    }),
};
