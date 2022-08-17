import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import multer from 'multer';
import bcrypt from 'bcryptjs';

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

export async function updatePassword(req, res, next) {
  const { email } = req.user;
  const { password } = req.body;
  if (password.length < 8) {
    return next(
      new ErrorResponse('Password length must be grather than 8 charaters', 400)
    );
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { upsert: false },
      function (err, doc) {
        if (err) return res.send(500, { error: err });
        return res
          .status(200)
          .json({ success: true, data: 'Password updated' });
      }
    );
  } catch (error) {
    return next(new ErrorResponse(error, 404));
  }
}

export async function updateUser(req, res, next) {
  const { email } = req.user;
  const { username, gender } = req.body;
  if (username === '' || gender === '') {
    return next(new ErrorResponse('Invalid input', 400));
  }
  try {
    User.findOneAndUpdate(
      { email },
      { username, gender },
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
