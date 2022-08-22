export function checkGroupName(value) {
  const isValidLength = /^.{3,16}$/;
  if (!isValidLength.test(value)) {
    return 'Lock group name must be between 3-16 characters long';
  }

  return 'Valid group';
}

export function checkGroupRemark(value) {
  const isValidLength = /^.{0,100}$/;
  if (!isValidLength.test(value)) {
    return 'Remark length cannot exceed 100 characters';
  }

  return 'Valid remark';
}
