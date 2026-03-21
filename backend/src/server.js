import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'Accept']
}));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Factory Scan API is running' });
});

import refundRoutes from './routes/refund.js';
import documentRoutes from './routes/document.js';
import idRoutes from './routes/id.js';
import reviewRoutes from './routes/review.js';
import userRoutes from './routes/user.js';
import profileRoutes from './routes/profile.js';
import dashboardRoutes from './routes/dashboard.js';
import apiKeyRoutes from './routes/keys.js';
import { validateApiKey } from './middleware/auth.js';

app.use('/api/v1/keys', apiKeyRoutes);

// Protected SDK endpoints
app.use('/api/v1/refund', validateApiKey, refundRoutes);
app.use('/api/v1/document', validateApiKey, documentRoutes);
app.use('/api/v1/id', validateApiKey, idRoutes);
app.use('/api/v1/review', validateApiKey, reviewRoutes);

// For simplicity, dashboard and profile remains unprotected from API key constraints, 
// as they are meant for the frontend dashboard session.
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
