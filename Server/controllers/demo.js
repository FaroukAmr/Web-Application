import Card from '../models/Card.js';
import Lock from '../models/Lock.js';

export async function wsDemo(ws) {
  try {
    const userId = 'faroukzach@gmail.com';
    const lock = await Lock.findOne({ userId });
    let cards = await Card.find({ userId }).select('cardNumber');
    let tempOutput = [];
    for (let i = 0; i < cards.length; i++) {
      tempOutput.push(Number(cards[i].cardNumber).toString(16).toUpperCase());
    }
    tempOutput = JSON.stringify(tempOutput);
    return ws.send(tempOutput);
  } catch (error) {
    return ws.send(error);
  }
}
