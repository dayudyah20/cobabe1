const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const signupRouter = require('./routes/signup.routes');
const loginRoutes = require('./routes/login.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const jwt = require('jsonwebtoken');

const DATABASE_URL = 'postgresql://postgres:bD4-ba2BA4EF1CG1e25adBdE3D2gCg*E@roundhouse.proxy.rlwy.net:34839/railway';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

app.get('/api/checkLoginStatus', (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.json({ loggedIn: false });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.json({ loggedIn: false });
    }

    res.json({ loggedIn: true });
  });
});

app.use('/signup', signupRouter);
app.use('/login', loginRoutes);
app.use('/appointment', authenticateToken, appointmentRoutes);

app.post('/logout', (req, res) => {
  // You can add some logic here to handle token-based logout, if needed.
  res.status(200).json({ status: 'success', message: 'Logout successful' });
});

function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    req.user = decoded;
    next();
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
