import express from 'express';
import payload from 'payload';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const authMiddleware = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await payload.findByID({ collection: 'users', id: decoded.userId });
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await payload.find({ collection: 'users', where: { email: { equals: email } } });
    if (existing.docs.length > 0) return res.status(400).json({ error: 'User exists' });
    
    const user = await payload.create({ collection: 'users', data: { name, email, password } });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await payload.login({ collection: 'users', data: { email, password } });
    if (!result) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: result.user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: result.user.id, name: result.user.name, email: result.user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authMiddleware, (req: any, res) => {
  res.json({ user: req.user });
});

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'secret',
    express: app,
    onInit: () => console.log(`Admin panel: http://localhost:5000/admin`),
  });
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();