import mongoose from 'mongoose';
const LockGroupSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    remark: {
      type: String,
    },
    locks: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const LockGroup = mongoose.model('LockGroup', LockGroupSchema);

export default LockGroup;
