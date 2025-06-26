import axios from 'axios';

const api = axios.create({
  //  baseURL: 'https://facturacion-backend-92qu.onrender.com/api/', 
  baseURL: 'http://localhost:3001/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
  