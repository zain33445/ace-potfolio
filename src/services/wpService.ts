import axios from 'axios';

const wpClient = axios.create({
  baseURL: process.env.WORDPRESS_API_URL,
  timeout: 5000,
});

export const wpService = {
  getPosts: async (params = {}) => {
    const { data } = await wpClient.get('/posts', { params });
    return data;
  },
  getPages: async (params = {}) => {
    const { data } = await wpClient.get('/pages', { params });
    return data;
  },
};
