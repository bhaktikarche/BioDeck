// server/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import deckRoutes from './routes/decks.js';
import userRoutes from './routes/users.js'; // <-- ADD this

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI, { dbName: 'bd' })
  .then(()=> console.log('MongoDB connected'))
  .catch(err=> console.error('MongoDB error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/decks', deckRoutes);
app.use('/api/users', userRoutes); // <-- ensure this is present

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
