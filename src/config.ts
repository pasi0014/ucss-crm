const API_BASE_URL =
  import.meta.env.MODE === 'production' ? 'https://api.ucssottawa.com' : 'http://localhost:3005';

export default API_BASE_URL;
