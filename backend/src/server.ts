import express from 'express';
import payload from 'payload';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

app.use(express.json());

const AUTH_SECRET = process.env.PAYLOAD_SECRET || 'mysecretkey123';

// ==================== CORS ====================

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// ==================== AUTH MIDDLEWARE ====================

const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;

    console.log('🔐 [DEBUG] Authorization Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ [DEBUG] No token provided');

      return res.status(401).json({
        error: 'No token provided',
      });
    }

    const token = authHeader.replace('Bearer ', '');

    console.log(
      '🔐 [DEBUG] Extracted Token:',
      token ? token.substring(0, 50) + '...' : 'NO TOKEN'
    );

    // ✅ VERIFY TOKEN
    const decoded: any = jwt.verify(token, AUTH_SECRET);

    console.log('✅ [DEBUG] Token verified, userId:', decoded.id);

    // ✅ FIND USER
    const user = await payload.findByID({
      collection: 'users',
      id: decoded.id,
    });

    if (!user) {
      console.log('❌ [DEBUG] User not found for id:', decoded.id);

      return res.status(401).json({
        error: 'User not found',
      });
    }

    console.log('✅ [DEBUG] User authenticated:', user.email);

    req.user = {
      ...user,
      collection: 'users',
    };

    next();
  } catch (error: any) {
    console.error('❌ [DEBUG] Token verification error:', error.message);

    return res.status(401).json({
      error: 'Invalid token',
    });
  }
};

// ==================== START SERVER ====================

const start = async () => {
  // Custom API routes are registered before Payload's generated REST routes.
  // This keeps /api/cartItems and /api/wishlistItems on the authenticated
  // handlers below instead of Payload's raw collection endpoints.

  // =====================================================
  // ==================== AUTH ROUTES ====================
  // =====================================================

  // REGISTER

  app.post('/api/users/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existing = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (existing.docs.length > 0) {
        return res.status(400).json({
          error: 'User already exists',
        });
      }

      const user = await payload.create({
        collection: 'users',
        data: {
          name,
          email,
          password,
        },
      });

      // ✅ CREATE TOKEN
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        AUTH_SECRET,
        {
          expiresIn: '7d',
        }
      );

      console.log('✅ [DEBUG] User registered:', email);

      res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error: any) {
      console.error('❌ [DEBUG] Register error:', error.message);

      res.status(500).json({
        error: error.message,
      });
    }
  });

  // LOGIN

  app.post('/api/users/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log('🔐 [DEBUG] Login attempt:', email);

      const result = await payload.login({
        collection: 'users',
        data: {
          email,
          password,
        },
      });

      if (!result) {
        console.log('❌ [DEBUG] Login failed for:', email);

        return res.status(401).json({
          error: 'Invalid credentials',
        });
      }

      // ✅ CREATE TOKEN
      const token = jwt.sign(
        {
          id: result.user.id,
          email: result.user.email,
        },
        AUTH_SECRET,
        {
          expiresIn: '7d',
        }
      );

      console.log('✅ [DEBUG] Login successful:', email);

      res.json({
        token,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
        },
      });
    } catch (error: any) {
      console.error('❌ [DEBUG] Login error:', error.message);

      res.status(500).json({
        error: error.message,
      });
    }
  });

  // CURRENT USER

  app.get('/api/auth/me', authMiddleware, (req: any, res) => {
    res.json({
      user: req.user,
    });
  });

  // =====================================================
  // ==================== CART ROUTES ====================
  // =====================================================

  // GET USER CART ITEMS

  app.get(
    '/api/cartItems/user/:userId',
    authMiddleware,
    async (req: any, res) => {
      try {
        if (req.user.id !== req.params.userId) {
          return res.status(403).json({
            error: 'Unauthorized',
          });
        }

        const items = await payload.find({
          collection: 'cartItems',

          where: {
            user: {
              equals: req.params.userId,
            },
          },

          sort: '-createdAt',
        });

        res.json(items.docs);
      } catch (error: any) {
        console.error('❌ [DEBUG] Fetch cart error:', error.message);

        res.status(500).json({
          error: error.message,
        });
      }
    }
  );

  // ADD TO CART

  app.post('/api/cartItems', authMiddleware, async (req: any, res) => {
    try {
      console.log(
        '🛒 [DEBUG] Add to cart request:',
        req.body.name
      );

      console.log(
        '🛒 [DEBUG] Authenticated User:',
        req.user.id
      );

      const item = await payload.create({
        collection: 'cartItems',

        data: {
          name: req.body.name,
          image: req.body.image,
          color: req.body.color,
          size: req.body.size,
          price: req.body.price,
          quantity: req.body.quantity || 1,
          inStock: req.body.inStock ?? true,

          // ✅ IMPORTANT
          user: req.user.id,

          createdAt: new Date().toISOString(),
        },
      });

      console.log('✅ [DEBUG] Item added to cart:', item.id);

      res.status(201).json(item);
    } catch (error: any) {
      console.error('❌ [DEBUG] Add cart error:', error.message);

      res.status(500).json({
        error: error.message,
      });
    }
  });

  // UPDATE CART ITEM

  app.patch(
    '/api/cartItems/:id',
    authMiddleware,
    async (req: any, res) => {
      try {
        const item = await payload.update({
          collection: 'cartItems',
          id: req.params.id,
          data: req.body,
        });

        res.json(item);
      } catch (error: any) {
        console.error('❌ [DEBUG] Update cart error:', error.message);

        res.status(500).json({
          error: error.message,
        });
      }
    }
  );

  // DELETE CART ITEM

  app.delete(
    '/api/cartItems/:id',
    authMiddleware,
    async (req: any, res) => {
      try {
        await payload.delete({
          collection: 'cartItems',
          id: req.params.id,
        });

        res.status(204).send();
      } catch (error: any) {
        console.error('❌ [DEBUG] Delete cart error:', error.message);

        res.status(500).json({
          error: error.message,
        });
      }
    }
  );

  // =====================================================
  // ================= WISHLIST ROUTES ===================
  // =====================================================

  // GET USER WISHLIST ITEMS

  app.get(
    '/api/wishlistItems/user/:userId',
    authMiddleware,
    async (req: any, res) => {
      try {
        if (req.user.id !== req.params.userId) {
          return res.status(403).json({
            error: 'Unauthorized',
          });
        }

        const items = await payload.find({
          collection: 'wishlistItems',

          where: {
            user: {
              equals: req.params.userId,
            },
          },

          sort: '-createdAt',
        });

        res.json(items.docs);
      } catch (error: any) {
        console.error('❌ [DEBUG] Fetch wishlist error:', error.message);

        res.status(500).json({
          error: error.message,
        });
      }
    }
  );

  // ADD TO WISHLIST

  app.post('/api/wishlistItems', authMiddleware, async (req: any, res) => {
    try {
      console.log(
        '💚 [DEBUG] Add to wishlist request:',
        req.body.name
      );

      console.log(
        '💚 [DEBUG] Authenticated User:',
        req.user.id
      );

      const item = await payload.create({
        collection: 'wishlistItems',

        data: {
          name: req.body.name,
          image: req.body.image,
          color: req.body.color,
          size: req.body.size,
          unitPrice: req.body.unitPrice,
          quantity: req.body.quantity || 1,
          inStock: req.body.inStock ?? true,

          // ✅ IMPORTANT
          user: req.user.id,

          createdAt: new Date().toISOString(),
        },
      });

      console.log('✅ [DEBUG] Item added to wishlist:', item.id);

      res.status(201).json(item);
    } catch (error: any) {
      console.error('❌ [DEBUG] Add wishlist error:', error.message);

      res.status(500).json({
        error: error.message,
      });
    }
  });

  // ✅ UPDATE WISHLIST ITEM

  app.patch(
    '/api/wishlistItems/:id',
    authMiddleware,
    async (req: any, res) => {
      try {
        const item = await payload.update({
          collection: 'wishlistItems',
          id: req.params.id,
          data: req.body,
        });

        res.json(item);
      } catch (error: any) {
        console.error('❌ [DEBUG] Update wishlist error:', error.message);

        res.status(500).json({
          error: error.message,
        });
      }
    }
  );

  // DELETE WISHLIST ITEM

  app.delete(
    '/api/wishlistItems/:id',
    authMiddleware,
    async (req: any, res) => {
      try {
        await payload.delete({
          collection: 'wishlistItems',
          id: req.params.id,
        });

        res.status(204).send();
      } catch (error: any) {
        console.error('❌ [DEBUG] Delete wishlist error:', error.message);

        res.status(500).json({
          error: error.message,
        });
      }
    }
  );

  // =====================================================
  // ==================== ORDER ROUTES ===================
  // =====================================================

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
      console.error('❌ [DEBUG] Order error:', error.message);

      res.status(500).json({
        error: error.message,
      });
    }
  });

  app.get(
    '/api/orders/user/:userId',
    authMiddleware,
    async (req: any, res) => {
      try {
        if (req.user.id !== req.params.userId) {
          return res.status(403).json({
            error: 'Unauthorized',
          });
        }

        const orders = await payload.find({
          collection: 'orders',

          where: {
            user: {
              equals: req.params.userId,
            },
          },

          sort: '-createdAt',
        });

        res.json(orders.docs);
      } catch (error: any) {
        console.error('❌ [DEBUG] Fetch orders error:', error.message);

        res.status(500).json({
          error: error.message,
        });
      }
    }
  );

  // =====================================================
  // ==================== PUBLIC ROUTES ==================
  // =====================================================

  app.get('/api/products', async (req, res) => {
    try {
      const result = await payload.find({
        collection: 'products',
        limit: 100,
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const result = await payload.findByID({
        collection: 'products',
        id: req.params.id,
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  });

  // =====================================================
  // ==================== SERVER START ===================
  // =====================================================

  await payload.init({
    secret: AUTH_SECRET,
    express: app,

    onInit: () => {
      console.log('Admin: http://localhost:5000/admin');
    },
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

start();

