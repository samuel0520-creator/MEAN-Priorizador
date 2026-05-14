// Modelo Mongoose para la colección "users"
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true } // índice único
  },
  { timestamps: true } // createdAt / updatedAt
);

export default mongoose.model('User', userSchema);

