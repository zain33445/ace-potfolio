import axios from 'axios';

const wpClient = axios.create({
  baseURL: process.env.WORDPRESS_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const wordpressService = {
  getPosts: async (params = {}) => {
    const { data } = await wpClient.get('/posts', { params });
    return data;
  },
  getProducts: async (params = {}) => {
    // Assuming product endpoint is 'product' based on standard WP/WooCommerce
    const { data } = await wpClient.get('/product', { params });
    return data;
  },
};
