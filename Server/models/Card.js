import mongoose from 'mongoose';
const CardSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    cardNumber: {
      type: String,
      required: true,
    },
    cardName: {
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

const Card = mongoose.model('Card', CardSchema);

export default Card;
