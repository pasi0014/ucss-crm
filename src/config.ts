const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "http://31.220.59.154:3005"
    : "http://localhost:3005";

export default API_BASE_URL;
