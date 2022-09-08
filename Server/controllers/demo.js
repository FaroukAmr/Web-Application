import Card from '../models/Card.js';
import ErrorResponse from '../utils/errorResponse.js';
import Lock from '../models/Lock.js';

export async function getDemo(req, res, next) {
  try {
    const userId = 'faroukzach@gmail.com';
    const lock = await Lock.findOne({ userId });
    let cards = await Card.find({ userId }).select('cardNumber');
    let tempOutput = [];
    for (let i = 0; i < cards.length; i++) {
      tempOutput.push(cards[i].cardNumber);
    }
    res
      .status(200)
      .json({ success: true, data: { lock: lock._id, cards: tempOutput } });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
}
