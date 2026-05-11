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

  // Login route - using payload internal method
  app.post('/api/users/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Use payload's built-in login
      const result = await payload.login({
        collection: 'users',
        data: { email, password }
      });
      
      if (!result) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      res.json({ 
        success: true, 
        user: result.user
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Register route
  app.post('/api/users/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      const result = await payload.create({
        collection: 'users',
        data: { name, email, password }
      });
      
      res.status(201).json({ 
        success: true, 
        user: result
      });
    } catch (error: any) {
      console.error('Register error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

start();