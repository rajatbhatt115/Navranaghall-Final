import express from 'express';
import payload from 'payload';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'mysecretkey123',
    express: app,
    onInit: () => {
      console.log(`✅ Payload Admin URL: http://localhost:5000/admin`);
    },
  });

  // ==================== CORS Middleware ====================
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // ==================== PUBLIC ROUTES (No Auth Required) ====================
  
  // Discover Products
  app.get('/api/discoverProducts', async (req, res) => {
    try {
      const result = await payload.find({ collection: 'discoverProducts', limit: 100 });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Categories
  app.get('/api/categories', async (req, res) => {
    try {
      const result = await payload.find({ collection: 'categories', limit: 100 });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Testimonials
  app.get('/api/testimonials', async (req, res) => {
    try {
      const result = await payload.find({ collection: 'testimonials', limit: 100 });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Products
  app.get('/api/products', async (req, res) => {
    try {
      const result = await payload.find({ collection: 'products', limit: 100 });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const result = await payload.findByID({ collection: 'products', id: req.params.id });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Team
  app.get('/api/team', async (req, res) => {
    try {
      const result = await payload.find({ collection: 'team', limit: 100 });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // About Content
  app.get('/api/aboutContent', async (req, res) => {
    try {
      const result = await payload.find({ collection: 'aboutContent', limit: 1 });
      res.json(result.docs[0] || {});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/aboutContent/1', async (req, res) => {
    try {
      const result = await payload.find({ collection: 'aboutContent', limit: 1 });
      res.json(result.docs[0] || {});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Home Banners
  app.get('/api/homeBanners', async (req, res) => {
    try {
      const { pageName } = req.query;
      if (pageName) {
        const result = await payload.find({
          collection: 'homeBanners',
          where: { pageName: { equals: pageName } },
        });
        res.json(result.docs[0] || {});
      } else {
        const result = await payload.find({ collection: 'homeBanners', limit: 100 });
        res.json(result);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/homeBanners/page/:pageName', async (req, res) => {
    try {
      const { pageName } = req.params;
      const result = await payload.find({
        collection: 'homeBanners',
        where: { pageName: { equals: pageName } },
      });
      res.json(result.docs[0] || {});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Top Rating Products
  app.get('/api/topRatingProducts/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const result = await payload.find({
        collection: 'topRatingProducts',
        where: { category: { equals: category } },
      });
      res.json(result.docs[0]?.products || []);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Blogs
  app.get('/api/blogs', async (req, res) => {
    try {
      const { isMainBlog, limit = 100 } = req.query;
      const where: any = {};
      if (isMainBlog !== undefined) {
        where.isMainBlog = { equals: isMainBlog === 'true' };
      }
      const result = await payload.find({
        collection: 'blogs',
        where,
        limit: parseInt(limit as string),
      });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/blogs/:id', async (req, res) => {
    try {
      const result = await payload.findByID({ collection: 'blogs', id: req.params.id });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/blogHome', async (req, res) => {
    try {
      const mainBlog = await payload.find({
        collection: 'blogs',
        where: { isMainBlog: { equals: true } },
        limit: 1,
      });
      const smallBlogs = await payload.find({
        collection: 'blogs',
        where: { isMainBlog: { equals: false } },
        limit: 2,
      });
      res.json({
        mainBlog: mainBlog.docs[0] || null,
        smallBlogs: smallBlogs.docs,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== AUTH ROUTES ====================

  app.post('/api/users/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await payload.login({
        collection: 'users',
        data: { email, password }
      });
      if (!result) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      res.json({ success: true, user: result.user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/users/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const result = await payload.create({
        collection: 'users',
        data: { name, email, password }
      });
      res.status(201).json({ success: true, user: result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

start();