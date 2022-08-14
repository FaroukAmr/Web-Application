import mongoose from 'mongoose';
const LockSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    lockName: {
      type: String,
      required: true,
    },
    lockMac: {
      type: String,
      required: true,
    },
    access: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Lock = mongoose.model('Lock', LockSchema);

export default Lock;
