// Rutas CRUD de usuarios
import { Router } from 'express';
import User from '../models/user.model.js';

const router = Router();

// ==========================
// SIMPLE LOGIN / REGISTER
// ==========================

router.post('/simple-login', async (req, res) => {
  try {

    const { name, email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        error: 'El email es requerido'
      });
    }

    let user = await User.findOne({
      email: email.toLowerCase()
    });

    // SI NO EXISTE → CREAR
    if (!user) {

      if (!name) {
        return res.status(400).json({
          error: 'El nombre es requerido'
        });
      }

      user = await User.create({
        name,
        email: email.toLowerCase()
      });

    }

    res.json(user);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Error en login simple',
      details: error.message
    });
  }
});

// ==========================
// GET USERS
// ==========================

router.get('/', async (_req, res) => {
  try {

    const users = await User.find().sort({
      createdAt: -1
    });

    res.json(users);

  } catch {

    res.status(500).json({
      error: 'Error fetching users'
    });
  }
});

// ==========================
// CREATE USER
// ==========================

router.post('/', async (req, res) => {
  try {

    const { name, email } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({
        error: 'name and email are required'
      });
    }

    const created = await User.create({
      name,
      email
    });

    res.status(201).json(created);

  } catch (err) {

    if (err.code === 11000) {
      return res.status(409).json({
        error: 'email already exists'
      });
    }

    res.status(500).json({
      error: 'Error creating user'
    });
  }
});

// ==========================
// UPDATE USER
// ==========================

router.put('/:id', async (req, res) => {
  try {

    const { name, email } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({
        error: 'name and email are required'
      });
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        error: 'user not found'
      });
    }

    res.json(updated);

  } catch (err) {

    if (err.code === 11000) {
      return res.status(409).json({
        error: 'email already exists'
      });
    }

    res.status(500).json({
      error: 'Error updating user'
    });
  }
});

// ==========================
// DELETE USER
// ==========================

router.delete('/:id', async (req, res) => {
  try {

    const deleted = await User.findByIdAndDelete(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        error: 'user not found'
      });
    }

    res.json({
      message: 'user deleted'
    });

  } catch {

    res.status(500).json({
      error: 'Error deleting user'
    });
  }
});

export default router;