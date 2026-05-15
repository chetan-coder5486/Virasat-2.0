import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './utils/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import storyRoutes from './routes/story.route.js';
import familyRoutes from './routes/family.route.js';
import inviteRoutes from './routes/invite.route.js';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}))

//apis

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/story', storyRoutes); 
app.use('/api/v1/family', familyRoutes); // New family routes
app.use('/api/v1/invite', inviteRoutes); // New invite routes

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is healthy' });
});


app.get('/', (req, res) => {
  res.send('Family Trunk API is running');
});

const startServer = async () => {
  try {
    // 1. Attempt DB Connection
    await connectDB();

    // 2. Only start listening if DB is successful
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed. Server not started.");
    process.exit(1); // Stop the process entirely
  }
};

startServer();