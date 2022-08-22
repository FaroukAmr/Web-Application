export function checkLockName(value) {
  const isValidLength = /^.{3,16}$/;
  if (!isValidLength.test(value)) {
    return 'Lock name must be between 3-16 characters long';
  }

  return 'Valid lock';
}

export function checkLockMAC(value) {
  const isValidLength = /^.{3,16}$/;
  if (!isValidLength.test(value)) {
    return 'Lock MAC must be between 3-16 characters long';
  }

  return 'Valid lock';
}
