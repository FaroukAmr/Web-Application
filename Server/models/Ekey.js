import mongoose from 'mongoose';
const EkeySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    lockId: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    authorizedAdmin: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Ekey = mongoose.model('Ekey', EkeySchema);

export default Ekey;
