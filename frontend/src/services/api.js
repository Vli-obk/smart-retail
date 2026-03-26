import axios from 'axios';

const api = axios.create({
  // T2kdi mn l-port dyal Laravel (ghalebiyane 8000)
  baseURL: 'http://127.0.0.1:8000/api', 
});

// Had l-interceptors drouriyin bach l-Backend i-fhem l-data
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Accept'] = 'application/json'; // Drouri bach Laravel i-jaweb b JSON
  return config;
});

// Response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;