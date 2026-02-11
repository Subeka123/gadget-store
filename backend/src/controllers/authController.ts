import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

export const registerController = async (req: Request, res: Response): Promise<void> => {
  console.log('Register request body:', req.body);
  
  const { username, email, password } = req.body;

  // Validate required fields
  if (!username || !password) {
    console.log('Missing required fields:', { username, email, password });
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await pool.getConnection();

    await connection.execute(
      'INSERT INTO users (username, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [username, email || null, hashedPassword]
    );

    connection.release();
    console.log('User registered:', username);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    console.error('Register error:', error.message);
    
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
  console.log('Login request body:', req.body);
  
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    connection.release();

    if ((rows as any[]).length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const user = (rows as any[])[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, name: user.name, email: user.email }
    });
  } catch (error: any) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
};
