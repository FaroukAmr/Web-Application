import Ekey from '../models/Ekey.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import Lock from '../models/Lock.js';
import Log from '../models/Logs.js';
import crypto from 'crypto';
export async function getEkeys(req, res, next) {
  const recipient = req.user.email;
  try {
    const eKeys = await Ekey.find({ recipient });
    res.status(200).json({ success: true, data: eKeys });
  } catch (err) {
    return next(new ErrorResponse("Can't get eKeys", 400));
  }
}

export async function getLockEkeys(req, res, next) {
  const { lockId } = req.body;
  try {
    const eKeys = await Ekey.find({ lockId });
    res.status(200).json({ success: true, data: eKeys });
  } catch (err) {
    return next(new ErrorResponse("Can't get eKeys", 400));
  }
}

export async function deleteLockEkeys(req, res, next) {
  const userId = req.user.email;
  const { lockId } = req.body;
  try {
    const eKeys = await Ekey.deleteMany({ userId, lockId });
    res.status(200).json({ success: true, data: eKeys });
  } catch (err) {
    return next(new ErrorResponse("Can't delete eKeys", 400));
  }
}

export async function deleteEkey(req, res, next) {
  const userId = req.user.email;
  const { _id, lockId } = req.body;
  try {
    const owner = await Lock.findOne({ _id: lockId, userId });
    if (!owner) {
      const admin = await Ekey.findOne({
        lockId,
        recipient: userId,
        authorizedAdmin: 'true',
      });
      if (!admin) {
        const ownEkey = await Ekey.findOne({ _id, recipient: userId });
        if (!ownEkey) {
          return next(
            new ErrorResponse(
              'Only authorized admins can delete this eKey',
              400
            )
          );
        }
      }
    }

    const recipient = await Ekey.findOne({ _id }).select('recipient');
    const eKey = await Ekey.deleteOne({ _id });

    Lock.updateOne(
      { _id: lockId },
      { $pull: { access: recipient.recipient } },
      { safe: true, multi: true },
      function (err, obj) {}
    );
    await Log.create({
      lockId,
      userId,
      action: `Deleted an eKey`,
      detail: `${userId} deleted ${recipient.recipient}'s eKey`,
    });
    if (recipient.recipient == userId) {
      return res.status(200).json({ success: true, data: 'Same user' });
    }
    res.status(200).json({ success: true, data: recipient });
  } catch (err) {
    return next(new ErrorResponse("Can't delete eKey", 400));
  }
}

export async function createEkey(req, res, next) {
  const { lockId, recipient, name, authorizedAdmin } = req.body;
  const userId = req.user.email;
  if (lockId == '' || recipient == '' || name == '') {
    return next(new ErrorResponse('Invalid input', 500));
  }
  if (userId === recipient) {
    return next(new ErrorResponse("Can't send eKey to yourself", 500));
  }
  try {
    const owner = await Lock.findOne({ _id: lockId, userId: userId });

    if (!owner) {
      const admin = await Ekey.findOne({
        lockId,
        recipient: userId,
        authorizedAdmin: 'true',
      });
      if (!admin) {
        return next(
          new ErrorResponse('Only authorized admins can send an eKey', 400)
        );
      }
    }

    const existingUser = await User.findOne({ email: recipient });

    if (existingUser) {
      const existingEkey = await Lock.findOne({
        _id: lockId,
        access: recipient,
      });
      if (existingEkey) {
        return next(new ErrorResponse('User already has access', 500));
      }
      const eKey = await Ekey.create({
        lockId,
        recipient,
        name,
        userId,
        authorizedAdmin,
      });
      Lock.updateOne(
        { _id: lockId },
        { $push: { access: recipient } },
        { safe: true, multi: true },
        function (err, obj) {}
      );
      await Log.create({
        lockId,
        userId,
        action: `Created a new eKey`,
        detail: `${userId} added ${recipient}'s eKey${
          authorizedAdmin ? ' (Authorized Admin)' : ''
        }`,
      });
      res.status(200).json({ success: true, data: eKey });
    } else {
      const user = await User.create({
        username: recipient,
        email: recipient,
        password: crypto.randomBytes(20).toString('hex'),
        verified: true,
      });
      const resetToken = user.getResetPasswordToken();
      await user.save();
      Lock.updateOne(
        { _id: lockId },
        { $push: { access: recipient } },
        { safe: true, multi: true },
        function (err, obj) {}
      );
      await Log.create({
        lockId,
        userId,
        action: `Created a new eKey`,
        detail: `${userId} added ${recipient}'s eKey${
          authorizedAdmin ? ' (Authorized Admin)' : ''
        }`,
      });
      // Create reset url to email to provided email
      const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;
      const forgotPasswordurl = 'http://localhost:3000/forgotpassword/';
      // HTML Message
      const message = `
            <h1>You have recieved an eKey access from ${userId}</h1>
            <p>You can access your eKey by visting this url and creating a new password:</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
            <p>If you don't use this link within 10 minutes, it will expire. To get a new password reset link, visit:</p>
            <a href=${forgotPasswordurl} clicktracking=off>${forgotPasswordurl}</a>
      `;

      try {
        sendEmail({
          to: recipient,
          subject: '[ASG] eKey access',
          text: message,
        });
        const eKey = await Ekey.create({
          lockId,
          recipient,
          authorizedAdmin,
          name,
          userId,
        });
        return res.status(200).json({ success: true, data: eKey });
      } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return next(new ErrorResponse('Email could not be sent', 500));
      }
    }
  } catch (error) {
    return next(new ErrorResponse("Can't send eKey", 400));
  }
}

export async function updateEkey(req, res, next) {
  const { _id, name, authorizedAdmin, lockId } = req.body;
  const userId = req.user.email;
  if (name == '') {
    return next(new ErrorResponse('Name cannot be empty', 500));
  }

  try {
    const owner = await Lock.findOne({ _id: lockId, userId });
    if (!owner) {
      const admin = await Ekey.findOne({
        lockId,
        recipient: userId,
        authorizedAdmin: 'true',
      });
      if (!admin) {
        return next(
          new ErrorResponse('Only authorized admins can edit this eKey', 400)
        );
      }
    }
    Ekey.findOneAndUpdate(
      { _id },
      { name, authorizedAdmin },
      { upsert: false },
      function (err, doc) {
        if (err) return res.send(500, { error: err });
        return res.send('Succesfully saved.');
      }
    );
    const updated = await Ekey.findOne({ _id });
    await Log.create({
      lockId,
      userId,
      action: `Updated an eKey`,
      detail: `${userId} updated ${updated.recipient}'s eKey`,
    });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
}
