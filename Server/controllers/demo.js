import Card from '../models/Card.js';

export const CLIENTS = [];
export async function wsDemo(ws) {
  try {
    const userId = 'faroukzach@gmail.com';
    let cards = await Card.find({ userId }).select('cardNumber');
    let tempOutput = [];
    for (let i = 0; i < cards.length; i++) {
      tempOutput.push(Number(cards[i].cardNumber).toString(16).toUpperCase());
    }
    tempOutput = JSON.stringify(tempOutput);
    ws.send(`UPDATE ${tempOutput}`);
  } catch {
    return ws.send('Internal Server Error');
  }
}

// export function clientsConnected() {
//   return CLIENTS.length !== 0;
// }
