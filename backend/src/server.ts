import express from 'express';
import payload from 'payload';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== SECURITY CHECKS ====================
const AUTH_SECRET = process.env.PAYLOAD_SECRET || process.env.JWT_SECRET;
if (!AUTH_SECRET) {
  console.error('❌ ERROR: JWT_SECRET or PAYLOAD_SECRET is required in .env file');
  process.exit(1);
}

// ==================== CORS ====================
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ==================== AUTH MIDDLEWARE ====================
const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded: any = jwt.verify(token, payload.secret);

    const user = await payload.findByID({
      collection: 'users',
      id: decoded.id,
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
      collection: 'users',
    };

    next();
  } catch (error: any) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ==================== AUTH ROUTES ====================

// REGISTER
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
    });

    if (existing.docs.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await payload.create({
      collection: 'users',
      data: { name, email, password, role: 'user' },
    });

    const loginResult = await payload.login({
      collection: 'users',
      data: { email, password },
    });

    res.status(201).json({
      token: loginResult.token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error: any) {
    console.error('Register error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// CURRENT USER
app.get('/api/auth/me', authMiddleware, (req: any, res) => {
  res.json({ user: req.user });
});

// ==================== CART ROUTES ====================

// GET USER CART
app.get('/api/cart/user/:userId', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const items = await payload.find({
      collection: 'cart-items',
      where: { user: { equals: req.params.userId } },
      sort: '-createdAt',
    });

    res.json(items.docs);
  } catch (error: any) {
    console.error('Fetch cart error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ADD TO CART
app.post('/api/cart', authMiddleware, async (req: any, res) => {
  try {
    const { productId, name, image, color, size, price, quantity } = req.body;

    const existing = await payload.find({
      collection: 'cart-items',
      where: {
        and: [
          { user: { equals: req.user.id } },
          { productId: { equals: productId } },
        ],
      },
    });

    if (existing.docs.length > 0) {
      const updated = await payload.update({
        collection: 'cart-items',
        id: existing.docs[0].id,
        data: { quantity: existing.docs[0].quantity + (quantity || 1) },
      });
      return res.json(updated);
    }

    const item = await payload.create({
      collection: 'cart-items',
      data: {
        user: req.user.id,
        productId,
        name,
        image,
        color: color || '',
        size: size || '',
        price,
        quantity: quantity || 1,
        inStock: true,
        createdAt: new Date().toISOString(),
      },
    });

    res.status(201).json(item);
  } catch (error: any) {
    console.error('Add to cart error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE CART ITEM
app.patch('/api/cart/:id', authMiddleware, async (req: any, res) => {
  try {
    const item = await payload.update({
      collection: 'cart-items',
      id: req.params.id,
      data: req.body,
    });
    res.json(item);
  } catch (error: any) {
    console.error('Update cart error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE CART ITEM
app.delete('/api/cart/:id', authMiddleware, async (req: any, res) => {
  try {
    await payload.delete({
      collection: 'cart-items',
      id: req.params.id,
    });
    res.status(204).send();
  } catch (error: any) {
    console.error('Delete cart error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ==================== WISHLIST ROUTES ====================

// GET USER WISHLIST
app.get('/api/wishlist/user/:userId', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const items = await payload.find({
      collection: 'wishlist-items',
      where: { user: { equals: req.params.userId } },
      sort: '-createdAt',
    });

    res.json(items.docs);
  } catch (error: any) {
    console.error('Fetch wishlist error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ADD TO WISHLIST
app.post('/api/wishlist', authMiddleware, async (req: any, res) => {
  try {
    const { productId, name, image, color, size, unitPrice } = req.body;

    const existing = await payload.find({
      collection: 'wishlist-items',
      where: {
        and: [
          { user: { equals: req.user.id } },
          { productId: { equals: productId } },
        ],
      },
    });

    if (existing.docs.length > 0) {
      return res.status(400).json({ error: 'Item already in wishlist' });
    }

    const item = await payload.create({
      collection: 'wishlist-items',
      data: {
        user: req.user.id,
        productId,
        name,
        image,
        color: color || '',
        size: size || '',
        unitPrice,
        quantity: 1,
        inStock: true,
        createdAt: new Date().toISOString(),
      },
    });

    res.status(201).json(item);
  } catch (error: any) {
    console.error('Add to wishlist error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE WISHLIST ITEM
app.patch('/api/wishlist/:id', authMiddleware, async (req: any, res) => {
  try {
    const item = await payload.update({
      collection: 'wishlist-items',
      id: req.params.id,
      data: req.body,
    });
    res.json(item);
  } catch (error: any) {
    console.error('Update wishlist error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE WISHLIST ITEM
app.delete('/api/wishlist/:id', authMiddleware, async (req: any, res) => {
  try {
    await payload.delete({
      collection: 'wishlist-items',
      id: req.params.id,
    });
    res.status(204).send();
  } catch (error: any) {
    console.error('Delete wishlist error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ORDER ROUTES ====================

app.post('/api/orders', authMiddleware, async (req: any, res) => {
  try {
    const order = await payload.create({
      collection: 'orders',
      data: {
        ...req.body,
        user: req.user.id,
        createdAt: new Date().toISOString(),
      },
    });
    res.status(201).json(order);
  } catch (error: any) {
    console.error('Create order error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/user/:userId', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const orders = await payload.find({
      collection: 'orders',
      where: { user: { equals: req.params.userId } },
      sort: '-createdAt',
    });

    res.json(orders.docs);
  } catch (error: any) {
    console.error('Fetch orders error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ==================== PUBLIC ROUTES ====================

app.get('/api', (req, res) => {
  res.json({ message: 'Navrang Hall API is running', version: '1.0.0' });
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await payload.findByID({ collection: 'products', id: req.params.id });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/home-banners/page/:pageName', async (req, res) => {
  try {
    const result = await payload.find({
      collection: 'home-banners',
      where: { pageName: { equals: req.params.pageName } },
      limit: 1,
    });
    res.json(result.docs[0] || null);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/about-content', async (req, res) => {
  try {
    const result = await payload.find({ collection: 'about-contents', limit: 1 });
    res.json(result.docs[0] || null);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== BLOG COMMENTS ====================
app.post('/api/blogs/:id/comments', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { name, email, contact, text } = req.body;

    const blog = await payload.findByID({
      collection: 'blogs',
      id: id,
    });

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const existingComments = (blog.comments as any[]) || [];
    const newComment = {
      id: Date.now().toString(),
      name: name,
      email: email,
      contact: contact,
      text: text,
      date: new Date().toISOString(),
    };

    await payload.update({
      collection: 'blogs',
      id: id,
      data: {
        comments: [...existingComments, newComment],
      },
    });

    res.status(201).json(newComment);
  } catch (error: any) {
    console.error('Add comment error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ==================== PRODUCT REVIEWS ====================
app.post('/api/products/:productId/reviews', authMiddleware, async (req: any, res) => {
  try {
    const { productId } = req.params;
    const { name, rating, comment, avatar } = req.body;

    const product = await payload.findByID({
      collection: 'products',
      id: productId,
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existingReviews: any[] = Array.isArray(product.reviews) ? product.reviews : [];

    const newReview = {
      id: Date.now().toString(),
      name: name || req.user.name,
      rating: Number(rating),
      text: comment,
      avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || req.user.name)}&background=FF7E00&color=fff`,
      date: new Date().toISOString(),
    };

    let totalRating = newReview.rating;
    for (let i = 0; i < existingReviews.length; i++) {
      totalRating += existingReviews[i].rating;
    }
    const newAvgRating = totalRating / (existingReviews.length + 1);

    await payload.update({
      collection: 'products',
      id: productId,
      data: {
        reviews: [...existingReviews, newReview],
        rating: parseFloat(newAvgRating.toFixed(1)),
      },
    });

    res.status(201).json(newReview);
  } catch (error: any) {
    console.error('Add review error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ==================== INITIALIZE ADMIN USER ====================
const initializeAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'change-me-now';
    
    const existingAdmins = await payload.find({
      collection: 'users',
      where: {
        email: { equals: adminEmail }
      }
    });

    if (existingAdmins.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: adminEmail,
          password: adminPassword,
          name: 'Admin User',
          role: 'admin',
        },
      });
      console.log(`✅ Admin user created - Email: ${adminEmail}`);
    } else {
      console.log('✅ Admin user exists');
      const adminUser = existingAdmins.docs[0];
      if (adminUser.role !== 'admin') {
        await payload.update({
          collection: 'users',
          id: adminUser.id,
          data: { role: 'admin' },
        });
        console.log('✅ Admin user role updated to admin');
      }
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};

// ==================== START SERVER ====================
const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || AUTH_SECRET,
    express: app,
    onInit: async () => {
      console.log('✅ Payload CMS initialized');
      console.log('📍 Admin URL: http://localhost:5000/admin');
      await initializeAdmin();
    },
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  });
};

start();