import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import bcrypt from 'bcryptjs';
import sendSMS from '../utils/sendSMS.js';
import checkPassword from '../regex/checkPassword.js';
import checkUsername from '../regex/checkUsername.js';

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
  const checkPasswordResponse = checkPassword(password);
  if (checkPasswordResponse !== 'Valid password') {
    return next(new ErrorResponse(checkPasswordResponse, 400));
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

export async function testSMS(req, res, next) {
  const { email } = req.user;
  const { number } = req.body;

  const forgotPasswordurl =
    'https://asg-smartlock.herokuapp.com/forgotpassword/';
  const message = `You have recieved an eKey access from ${email}`;
  const from = 'ASG';

  try {
    sendSMS({
      to: number,
      from: from,
      message: message,
    });

    res.status(200).json({ success: true, data: 'SMS Sent' });
  } catch (err) {
    return next(new ErrorResponse('SMS could not be sent', 500));
  }
}

export async function updateUser(req, res, next) {
  const { email } = req.user;
  const { username, gender } = req.body;
  if (gender === '') {
    return next(new ErrorResponse('Invalid input', 400));
  }
  const checkUsernameResponse = checkUsername(username);
  if (checkUsernameResponse !== 'Valid username') {
    return next(new ErrorResponse(checkUsernameResponse, 400));
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
