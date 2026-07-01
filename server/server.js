import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic status check route
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', message: 'ClearFiling API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
