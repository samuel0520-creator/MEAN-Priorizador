// API Express + conexión MongoDB
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';

import usersRouter from './routes/users.routes.js';
import tasksRouter from './routes/tasks.routes.js';

const app = express();

// =======================
// DEBUG ENV
// =======================

console.log('======================');
console.log('DEBUG .ENV');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('======================');

// =======================
// MIDDLEWARES
// =======================

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// =======================
// ROUTES
// =======================

app.use('/api/users', usersRouter);
app.use('/api/tasks', tasksRouter);

// =======================
// SERVER
// =======================

const PORT = process.env.PORT || 4000;

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
})
.then(() => {
  console.log('✅ MongoDB conectado correctamente');

  app.listen(PORT, () => {
    console.log(`🚀 API running on http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.log('\n❌ ERROR COMPLETO MONGODB:\n');

  console.error(err);

  console.log('\n======================');
  console.log('ERROR MESSAGE:');
  console.log(err.message);

  console.log('\nERROR NAME:');
  console.log(err.name);

  console.log('\nERROR CODE:');
  console.log(err.code);

  console.log('\nCAUSE:');
  console.log(err.cause);

  console.log('======================\n');

  process.exit(1);
});