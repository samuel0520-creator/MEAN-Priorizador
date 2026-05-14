import { Router } from 'express';
import Task from '../models/Task.js';

const router = Router();

// ==========================
// GET TASKS BY USER
// ==========================

router.get('/user/:userId', async (req, res) => {
  try {

    const tasks = await Task.find({
      user: req.params.userId
    }).sort({
      createdAt: -1,
    });

    res.json(tasks);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error obteniendo tareas',
      error: error.message,
    });
  }
});

// ==========================
// GET TASK BY ID
// ==========================

router.get('/:id', async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Tarea no encontrada',
      });
    }

    res.json(task);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error obteniendo tarea',
      error: error.message,
    });
  }
});

// ==========================
// CREATE TASK
// ==========================

router.post('/', async (req, res) => {
  try {

    const task = new Task({
      user: req.body.user,
      title: req.body.title,
      description: req.body.description,
      urgency: req.body.urgency,
      importance: req.body.importance,
      status: req.body.status
    });

    const savedTask = await task.save();

    res.status(201).json(savedTask);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error creando tarea',
      error: error.message,
    });
  }
});

// ==========================
// UPDATE TASK
// ==========================

router.put('/:id', async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Tarea no encontrada',
      });
    }

    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.urgency = req.body.urgency ?? task.urgency;
    task.importance = req.body.importance ?? task.importance;
    task.status = req.body.status ?? task.status;

    task.priority = task.urgency * task.importance;

    if (task.priority >= 16) {
      task.classification = 'Alta';
    } else if (task.priority >= 8) {
      task.classification = 'Media';
    } else {
      task.classification = 'Baja';
    }

    task.critical = task.priority >= 20;

    const updatedTask = await task.save();

    res.json(updatedTask);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error actualizando tarea',
      error: error.message,
    });
  }
});

// ==========================
// DELETE TASK
// ==========================

router.delete('/:id', async (req, res) => {
  try {

    const deletedTask = await Task.findByIdAndDelete(
      req.params.id
    );

    if (!deletedTask) {
      return res.status(404).json({
        message: 'Tarea no encontrada',
      });
    }

    res.json({
      message: 'Tarea eliminada correctamente',
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error eliminando tarea',
      error: error.message,
    });
  }
});

export default router;