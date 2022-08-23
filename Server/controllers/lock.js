import Lock from '../models/Lock.js';
import ErrorResponse from '../utils/errorResponse.js';
import LockGroup from '../models/LockGroup.js';
import Log from '../models/Logs.js';
import { buildLockPDF } from '../utils/generatePdf.js';
import { checkLockName, checkLockMAC } from '../regex/checkLock.js';

export async function createLock(req, res, next) {
  const { lockName, lockMac } = req.body;
  const userId = req.user.email;

  const checkLockNameResponse = checkLockName(lockName);
  if (checkLockNameResponse !== 'Valid lock') {
    return next(new ErrorResponse(checkLockNameResponse, 400));
  }
  const checkLockMACResponse = checkLockMAC(lockMac);
  if (checkLockMACResponse !== 'Valid lock') {
    return next(new ErrorResponse(checkLockMACResponse, 400));
  }

  const existingLock = await Lock.findOne({ userId, lockMac });

  if (existingLock) {
    return next(new ErrorResponse('Lock with this MAC already added', 400));
  }

  try {
    const lock = await Lock.create({
      userId,
      lockName,
      lockMac,
      access: userId,
    });

    if (!lock) {
      return next(new ErrorResponse('Could not create lock', 400));
    }
    const log = await Log.create({
      lockId: lock._id,
      userId,
      action: `Created a new lock`,
      detail: `${userId} created a new lock (${lockName})`,
    });
    res.status(200).json({ success: true, data: 'Lock created' });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
}

export async function getLock(req, res, next) {
  const { email } = req.user;
  const _id = req.body.lockId;

  try {
    const lock = await Lock.findOne({ access: email, _id }).catch(() => {
      return next(new ErrorResponse('Could not get lock', 400));
    });
    if (!lock) {
      return next(new ErrorResponse('Could not get lock', 400));
    }
    res.status(200).json({ success: true, data: lock });
  } catch (error) {
    return next(new ErrorResponse('err', 500));
  }
}

export async function getLocks(req, res, next) {
  const { email } = req.user;
  try {
    let locks = await Lock.find({ access: email });
    if (!locks) {
      return next(new ErrorResponse('Could not get locks', 400));
    }
    res.status(200).json({ success: true, data: locks });
  } catch (err) {
    return next(new ErrorResponse(err, 500));
  }
}

export async function deleteLock(req, res, next) {
  const { email } = req.user;
  const _id = req.body.lockId;
  try {
    const lock = await Lock.deleteOne({ userId: email, _id });
    if (lock.acknowledged == true && lock.deletedCount == 1) {
      LockGroup.updateMany(
        {},
        { $pull: { locks: _id } },
        { safe: true, multi: true },
        function (err, obj) {}
      );
      await Log.deleteMany({ lockId: _id });
      res.status(200).json({ success: true, data: lock });
    }
    if (lock.acknowledged == true && lock.deletedCount == 0) {
      return next(
        new ErrorResponse(
          'Only lock owner can delete this lock, you can remove your eKey instead',
          400
        )
      );
    }
  } catch (err) {
    return next(new ErrorResponse(err, 500));
  }
}

export async function exportLocks(req, res, next) {
  const { email } = req.user;
  try {
  } catch (error) {}
  const locks = await Lock.find({ access: email });
  if (!locks) {
    new ErrorResponse('No locks to export', 400);
  }

  const stream = res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment;filename=logs.pdf',
  });

  buildLockPDF(
    locks,
    (chunk) => stream.write(chunk),
    () => stream.end()
  );
}
