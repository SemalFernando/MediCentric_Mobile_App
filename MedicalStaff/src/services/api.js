// Use your computer's IP address instead of localhost
const BASE_URLS = {
  doctor: 'http://192.168.8.102:8085', // Replace with your computer's IP
  radiologist: 'http://192.168.8.102:8086',
  lab_technician: 'http://192.168.8.102:8087'
};

// Enhanced API call function with better error handling
export const apiCall = async (url, options = {}) => {
  console.log('Making API call to:', url);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('API Response status:', response.status);
    
    const text = await response.text();
    console.log('API Response text:', text);
    
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON response from server');
    }
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API call error:', error.message);
    throw new Error(error.message || 'Network request failed. Check your connection and server.');
  }
};

// Role-specific API functions
export const authAPI = {
  // Login for all roles
  login: async (role, email, password) => {
    const baseUrl = BASE_URLS[role];
    let endpoint;
    
    switch (role) {
      case 'doctor':
        endpoint = '/doctors/login';
        break;
      case 'radiologist':
        endpoint = '/radiologists/login';
        break;
      case 'lab_technician':
        endpoint = '/lab-technicians/login';
        break;
      default:
        throw new Error('Invalid role');
    }
    
    const fullUrl = `${baseUrl}${endpoint}`;
    console.log('Login URL:', fullUrl);
    
    return apiCall(fullUrl, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Signup for different roles
  signup: async (role, userData) => {
    const baseUrl = BASE_URLS[role];
    let endpoint;
    
    switch (role) {
      case 'doctor':
        endpoint = '/doctors';
        break;
      case 'radiologist':
        endpoint = '/radiologists';
        break;
      case 'lab_technician':
        endpoint = '/lab-technicians';
        break;
      default:
        throw new Error('Invalid role');
    }
    
    const fullUrl = `${baseUrl}${endpoint}`;
    console.log('Signup URL:', fullUrl);
    
    return apiCall(fullUrl, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};