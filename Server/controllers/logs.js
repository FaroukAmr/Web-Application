import Log from '../models/Logs.js';
import Ekey from '../models/Ekey.js';
import Lock from '../models/Lock.js';
import ErrorResponse from '../utils/errorResponse.js';
import { buildPDF } from '../utils/generatePdf.js';
export async function exportLogs(req, res, next) {
  const { lockId } = req.body;
  const { email } = req.user;
  try {
  } catch (error) {}
  const lock = await Lock.findOne({ _id: lockId });
  if (!lock) {
    new ErrorResponse('Lock does not exist', 404);
  }
  const admin = await Ekey.findOne({
    recipient: email,
    authorizedAdmin: true,
  });
  const owner = await Lock.findOne({ userId: email, _id: lockId });

  if (!owner && !admin) {
    return next(new ErrorResponse('Only authorized admins can view logs', 404));
  }

  let log = await Log.find({ lockId });

  const stream = res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment;filename=logs.pdf',
  });

  buildPDF(
    log,
    (chunk) => stream.write(chunk),
    () => stream.end()
  );
}

export async function getLogs(req, res, next) {
  const { lockId } = req.body;
  const { email } = req.user;

  try {
    const lock = await Lock.findOne({ _id: lockId });
    if (!lock) {
      new ErrorResponse('Lock does not exist', 404);
    }
    const admin = await Ekey.findOne({
      recipient: email,
      authorizedAdmin: true,
    });
    const owner = await Lock.findOne({ userId: email, _id: lockId });

    if (!owner && !admin) {
      return next(
        new ErrorResponse('Only authorized admins can view logs', 404)
      );
    }
    const logs = await Log.find({ lockId });
    if (!logs) {
      return next(new ErrorResponse('Could not get logs', 404));
    }

    res
      .status(200)
      .json({ success: true, data: logs, lockName: lock.lockName });
  } catch (error) {
    return next(new ErrorResponse('err', 500));
  }
}
