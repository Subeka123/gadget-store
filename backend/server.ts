import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './src/routes/authRoutes';
import gadgetRoutes from './src/routes/gadgetRoutes';
import { initializeDatabase } from './src/config/db';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase().catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gadgets', gadgetRoutes);

// Error handling
process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
