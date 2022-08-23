import LockGroup from '../models/LockGroup.js';
import ErrorResponse from '../utils/errorResponse.js';
import { checkGroupName, checkGroupRemark } from '../regex/checkLogGroups.js';
export async function createGroup(req, res, next) {
  const { name, remark, locks } = req.body;
  const userId = req.user.email;

  const checkGroupNameResponse = checkGroupName(name);
  if (checkGroupNameResponse !== 'Valid group') {
    return next(new ErrorResponse(checkGroupNameResponse, 400));
  }
  const checkGroupRemarkResponse = checkGroupRemark(remark);
  if (checkGroupRemarkResponse !== 'Valid remark') {
    return next(new ErrorResponse(checkGroupRemarkResponse, 400));
  }
  const existingGroup = await LockGroup.findOne({ userId, name });

  if (existingGroup) {
    return next(new ErrorResponse('Lock group already exists', 400));
  }

  try {
    const group = await LockGroup.create({
      userId,
      name,
      remark,
      locks,
    });

    if (!group) {
      return next(new ErrorResponse('Could not create lock', 400));
    }
    res.status(200).json({ success: true, data: 'Group created' });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
}

export async function getGroups(req, res, next) {
  const { email } = req.user;
  try {
    let groups = await LockGroup.find({ userId: email });
    if (!groups) {
      return next(new ErrorResponse('Could not get lock groups', 404));
    }
    res.status(200).json({ success: true, data: groups });
  } catch (err) {
    return next(new ErrorResponse(err, 500));
  }
}

export async function deleteGroup(req, res, next) {
  const { email } = req.user;
  const { _id } = req.body;
  try {
    let group = await LockGroup.deleteOne({ userId: email, _id });
    if (group.deletedCount === 0) {
      return next(new ErrorResponse('Could not delete lock group', 404));
    }
    res.status(200).json({ success: true, data: group });
  } catch (err) {
    return next(new ErrorResponse(err, 500));
  }
}

export async function updateGroup(req, res, next) {
  const { _id, name, remark, locks } = req.body;
  const { email } = req.user;
  if (name === '' || _id === '') {
    return next(new ErrorResponse('Invalid input', 500));
  }
  try {
    LockGroup.findOneAndUpdate(
      { _id, userId: email },
      { name, remark, locks },
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
