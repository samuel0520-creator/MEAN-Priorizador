import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    // ==========================
    // USUARIO DUEÑO DE LA TAREA
    // ==========================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ==========================
    // DATOS TAREA
    // ==========================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: '',
    },

    urgency: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    importance: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    priority: {
      type: Number,
      default: 0,
    },

    classification: {
      type: String,
      enum: ['Alta', 'Media', 'Baja'],
      default: 'Media',
    },

    critical: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ['Pendiente', 'En progreso', 'Completada'],
      default: 'Pendiente',
    },
  },
  {
    timestamps: true,
  }
);

// ==========================
// CALCULAR PRIORIDAD
// ==========================

taskSchema.pre('save', function () {

  this.priority = this.urgency * this.importance;

  if (this.priority >= 16) {
    this.classification = 'Alta';
  } else if (this.priority >= 8) {
    this.classification = 'Media';
  } else {
    this.classification = 'Baja';
  }

  this.critical = this.priority >= 20;

});

export default mongoose.model('Task', taskSchema);