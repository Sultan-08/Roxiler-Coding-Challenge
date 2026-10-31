// Centralized API configuration using Vite environment variables
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL
).replace(/\/+$/, '');

export default API_BASE_URL;

