import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  token: { type: String, required: true },
  authTokenExpire: { type: Date, required: true },
});

const Token = mongoose.model('Token', TokenSchema);

export default Token;
