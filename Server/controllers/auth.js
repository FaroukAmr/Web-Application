import ErrorResponse from '../utils/errorResponse.js';
import Token from '../models/Token.js';
import User from '../models/User.js';
import checkPassword from '../regex/checkPassword.js';
import checkUsername from '../regex/checkUsername.js';
import crypto from 'crypto';
import jwt_decode from 'jwt-decode';
import sendEmail from '../utils/sendEmail.js';

export async function handleExternalAuth(req, res, next) {
  const { response } = req.body;
  const userObject = jwt_decode(response.credential);
  const { email } = userObject;
  const username = userObject.name;
  const image = userObject.picture;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.verified = true;
      user.save();
      sendToken(user, 200, res);
    } else {
      const user = await User.create({
        username,
        email,
        image,
        password: crypto.randomBytes(20).toString('hex'),
        verified: true,
      });
      sendToken(user, 200, res);
    }
  } catch (error) {
    return next(new ErrorResponse(error, 400));
  }
}
export async function register(req, res, next) {
  const { username, email, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return next(new ErrorResponse('Email already exists', 400));
    }
    const checkPasswordResponse = checkPassword(password);
    if (checkPasswordResponse !== 'Valid password') {
      return next(new ErrorResponse(checkPasswordResponse, 400));
    }

    const checkUsernameResponse = checkUsername(username);
    if (checkUsernameResponse !== 'Valid username') {
      return next(new ErrorResponse(checkUsernameResponse, 400));
    }

    const user = await User.create({
      username,
      email,
      password,
    });
    const authToken = await new Token({
      userId: user._id,
      token: crypto.randomBytes(20).toString('hex'),
      authTokenExpire: Date.now() + 10 * (60 * 1000),
    }).save();

    const url = `https://asg-smartlock.herokuapp.com/verify/${user._id}/${authToken.token}`;

    const message = `
        <h1>Welcome to ASG App!</h1>
        <p>We are happy you are here, lets get your email verified, simply click the link below to get started.</p>
        <a href=${url} clicktracking=off>${url}</a>
        <p>This link will expire after 10 minutes.</p>
      `;

    try {
      sendEmail({
        to: user.email,
        subject: '[ASG] Email Verification',
        text: message,
      });

      res.status(200).json({ success: true, data: 'Email Sent' });
    } catch (err) {
      await User.deleteOne({ _id: user._id });

      return next(new ErrorResponse('Email could not be sent', 400));
    }
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
}

export async function login(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid credintials', 401));
    }

    if (!user.verified) {
      let token = await Token.findOne({
        userId: user._id,
        authTokenExpire: { $gt: Date.now() },
      });
      if (!token) {
        await Token.deleteOne({ userId: user._id });
        const authToken = await new Token({
          userId: user._id,
          token: crypto.randomBytes(20).toString('hex'),
          authTokenExpire: Date.now() + 10 * (60 * 1000),
        }).save();

        const url = `https://asg-smartlock.herokuapp.com/verify/${user._id}/${authToken.token}`;

        const message = `
        <h1>Verify Your Email</h1>
        <p>Please visit this link to verify your email</p>
        <a href=${url} clicktracking=off>${url}</a>
        <p>This link will expire after 10 minutes.</p>
      `;

        try {
          sendEmail({
            to: user.email,
            subject: '[ASG] Email Verification',
            text: message,
          });

          return res.status(200).json({ success: true, data: 'Email Sent' });
        } catch (err) {
          await User.deleteOne({ _id: user._id });

          return next(new ErrorResponse('Email could not be sent', 400));
        }
      }
      return next(
        new ErrorResponse(
          'Please check your inbox for a verification email',
          401
        )
      );
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credintials', 401));
    }

    sendToken(user, 200, res);
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
}

export async function forgotpassword(req, res, next) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse('Email could not be sent', 400));
    }

    // Reset Token Gen and add to database hashed version of token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset url to email to provided email
    const resetUrl = `https://asg-smartlock.herokuapp.com/passwordreset/${resetToken}`;
    const forgotPasswordurl =
      'https://asg-smartlock.herokuapp.com/forgotpassword/';
    // HTML Message
    const message = `
        <h1>You have requested a password reset</h1>
        <p>Don't worry we got you covered, click the link below to reset your password</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        <p>If you don't use this link within 10 minutes, it will expire. To get a new password reset link, visit:</p>
        <a href=${forgotPasswordurl} clicktracking=off>${forgotPasswordurl}</a>
      `;

    try {
      sendEmail({
        to: user.email,
        subject: '[ASG] Password Reset Request',
        text: message,
      });

      res.status(200).json({ success: true, data: 'Email Sent' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse('Email could not be sent', 400));
    }
  } catch (err) {
    return next(new ErrorResponse('Email could not be sent', 500));
  }
}

export async function verifyUser(req, res, next) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return next(new ErrorResponse('Invalid link', 400));
    }
    const authToken = await Token.findOne({
      userId: user._id,
      token: req.params.token,
      authTokenExpire: { $gt: Date.now() },
    });
    if (!authToken) {
      return next(new ErrorResponse('Invalid link', 400));
    }
    await User.updateOne({ _id: user._id }, { verified: true });
    await Token.deleteMany({ userId: user._id });
    res.status(200).send({ success: true, data: 'Email verified' });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
}

export async function resetpassword(req, res, next) {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse('Invalid Token', 400));
    }

    const checkPasswordResponse = checkPassword(req.body.password);
    if (checkPasswordResponse !== 'Valid password') {
      return next(new ErrorResponse(checkPasswordResponse, 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: 'Password Updated Success',
      token: user.getSignedJwtToken(),
    });
  } catch (err) {
    return next(new ErrorResponse('Internal server error', 500));
  }
}
const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({ sucess: true, token });
};
