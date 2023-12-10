const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:bD4-ba2BA4EF1CG1e25adBdE3D2gCg*E@roundhouse.proxy.rlwy.net:34839/railway',
    },
  },
});

const signupRouter = express.Router();

signupRouter.post('/', async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (!fullname || !username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user_accounts.create({
      data: {
        fullname,
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully!',
      user: { fullname, username, email },
    });
  } catch (error) {
    console.error('Error creating account', error);
    res.status(500).json({ error: 'Error creating account' });
  }
});

module.exports = signupRouter;
