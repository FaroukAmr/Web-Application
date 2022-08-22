export function checkEKeyName(value) {
  const isValidLength = /^.{3,16}$/;
  if (!isValidLength.test(value)) {
    return 'eKey name must be between 3-16 characters long';
  }

  return 'Valid ekey';
}
