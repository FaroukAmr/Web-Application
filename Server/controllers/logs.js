import Log from '../models/Logs.js';
import Ekey from '../models/Ekey.js';
import Lock from '../models/Lock.js';
import ErrorResponse from '../utils/errorResponse.js';
import { buildPDF } from '../utils/generatePdf.js';
import moment from 'moment';
import XLSX from 'xlsx';

export async function exportLogsXcel(req, res, next) {
  try {
    const { lockId } = req.body;
    const { email } = req.user;
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
        new ErrorResponse('Only authorized admins can view logs', 401)
      );
    }

    let log = await Log.find({ lockId });
    const stream = res.writeHead(200, {
      'Content-Type':
        'application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment;filename=${email}_${lockId}_logs.xlsx`,
    });
    let dataArray = [];
    let temp = JSON.stringify(log);
    temp = JSON.parse(temp);
    for (let i = 0; i < temp.length; i++) {
      let tempArray = {
        'Lock ID': temp[i].lockId,
        'User ID': temp[i].userId,
        Action: temp[i].action,
        Details: temp[i].detail,
        Date: moment(temp[i].createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
      };
      dataArray.push(tempArray);
    }
    const workSheet = XLSX.utils.json_to_sheet(dataArray);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Logs');

    stream.write(XLSX.write(workBook, { bookType: 'xlsx', type: 'buffer' }));

    stream.end();
  } catch (err) {
    return next(new ErrorResponse(err, 500));
  }
}

export async function exportLogs(req, res, next) {
  const { lockId } = req.body;
  const { email } = req.user;
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
    return next(new ErrorResponse('Only authorized admins can view logs', 401));
  }

  let log = await Log.find({ lockId });

  const stream = res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment;filename=${lockId}_logs.pdf`,
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
        new ErrorResponse('Only authorized admins can view logs', 401)
      );
    }
    const logs = await Log.find({ lockId });
    if (!logs) {
      return next(new ErrorResponse('Could not get logs', 400));
    }

    res
      .status(200)
      .json({ success: true, data: logs, lockName: lock.lockName });
  } catch (error) {
    return next(new ErrorResponse('err', 500));
  }
}
