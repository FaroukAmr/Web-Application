import Card from '../models/Card.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';
import Lock from '../models/Lock.js';

export async function getDemo(req, res, next) {
  const userId = 'faroukzach@gmail.com';
  const lock = await Lock.findOne({ userId });
  const cards = await Card.find({ userId });
  res.status(200).json({ success: true, data: { lock, cards } });
}
