import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import Token from '../models/Token.js';

export async function getUser(req, res, next) {
  const { email } = req.user;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('Not found', 404));
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    return next(new ErrorResponse(error, 404));
  }
}

export async function updateUser(req, res, next) {
  const { email } = req.user;
  const { username, gender, image } = req.body;
  if (username === '' || gender === '') {
    return next(new ErrorResponse('Invalid input', 400));
  }
  try {
    User.findOneAndUpdate(
      { email },
      { username, gender, image },
      { upsert: false },
      function (err, doc) {
        if (err) return res.send(500, { error: err });
        return res.status(200).json({ success: true, data: 'User updated' });
      }
    );
  } catch (error) {
    return next(new ErrorResponse(error, 404));
  }
}
