import { wpService } from '../services/wpService.js';

export const wpController = {
  getPosts: async (req, res) => {
    try {
      const posts = await wpService.getPosts(req.query);
      res.json(posts);
    } catch (error) {
      console.error('Error fetching WP posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts from WordPress' });
    }
  },
  getPages: async (req, res) => {
    try {
      const pages = await wpService.getPages(req.query);
      res.json(pages);
    } catch (error) {
      console.error('Error fetching WP pages:', error);
      res.status(500).json({ error: 'Failed to fetch pages from WordPress' });
    }
  }
};
