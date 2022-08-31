import Card from '../models/Card.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';
import Lock from '../models/Lock.js';
import { checkCardNumber, checkCardName } from '../regex/checkCard.js';
export async function getCards(req, res, next) {
  const userId = req.user.email;

  try {
    const userId = req.user.email;
    const cards = await Card.find({ userId });
    res.status(200).json({ success: true, data: cards });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
}

export async function shareCard(req, res, next) {
  const userId = req.user.email;
  const { recipient, cardNumber, remark, cardName } = req.body;
  if (recipient == '' || cardNumber == '' || cardName == '') {
    return next(new ErrorResponse('Invalid input', 400));
  }
  try {
    const existingUser = await User.findOne({ email: recipient });
    if (!existingUser) {
      return next(new ErrorResponse('User email does not exist', 400));
    }
    const userAlreadyHasCard = await Card.findOne({
      userId: recipient,
      cardNumber,
    });
    if (userAlreadyHasCard) {
      return next(new ErrorResponse('User already has access', 400));
    }
    const card = await Card.create({
      userId: recipient,
      cardNumber,
      remark,
      cardName,
    });
    res.status(200).json({ success: true, data: card });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
}

export async function updateCard(req, res, next) {
  const { cardId, cardName, cardRemark, locks } = req.body;
  try {
    Card.findOneAndUpdate(
      { _id: cardId },
      { cardName, remark: cardRemark, locks },
      { upsert: false },
      function (err, doc) {
        if (err) return res.send(500, { error: err });
        return res.send('Succesfully saved.');
      }
    );
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
}

export async function deleteCard(req, res, next) {
  const { email } = req.user;
  const { _id } = req.body;

  try {
    const card = await Card.deleteOne({ userId: email, _id });
    if (card.acknowledged == true && card.deletedCount == 1) {
      res.status(200).json({ success: true, data: card });
    }
    if (card.acknowledged == true && card.deletedCount == 0) {
      return next(
        new ErrorResponse('Only lock owner can delete this lock', 400)
      );
    }
  } catch (err) {
    return next(new ErrorResponse(err, 500));
  }
}

export async function createCard(req, res, next) {
  try {
    const { cardNumber, remark, cardName, checked } = req.body;
    const userId = req.user.email;
    const checkCardNumberResponse = checkCardNumber(cardNumber);
    if (checkCardNumberResponse !== 'Valid card') {
      return next(new ErrorResponse(checkCardNumberResponse, 400));
    }

    const checkCardNameResponse = checkCardName(cardName);
    if (checkCardNameResponse !== 'Valid card') {
      return next(new ErrorResponse(checkCardNameResponse, 400));
    }

    const existingCard = await Card.findOne({ userId, cardNumber });
    if (existingCard) {
      return next(new ErrorResponse('Card number already exists', 400));
    }
    if (checked) {
      let locks = await Lock.find({ access: userId });
      locks = JSON.stringify(locks);
      locks = JSON.parse(locks);
      const card = await Card.create({
        userId,
        cardNumber,
        remark,
        cardName,
        locks,
      });
      if (card) {
        return res.status(200).json({ success: true, data: 'Card created' });
      }
      return next(new ErrorResponse('Could not create card', 400));
    }
    const card = await Card.create({ userId, cardNumber, remark, cardName });

    if (!card) {
      return next(new ErrorResponse('Could not create card', 400));
    }
    res.status(200).json({ success: true, data: 'Card created' });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
}
