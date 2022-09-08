import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema(
  {
    lockId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Log = mongoose.model('Log', LogSchema);

export default Log;
