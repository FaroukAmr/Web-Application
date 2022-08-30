export function checkCardNumber(value) {
  const isValidLength = /^.{8,20}$/;
  if (!isValidLength.test(value)) {
    return 'Invalid card number';
  }

  const isOnlyNumbers = /^\d+$/;
  if (!isOnlyNumbers.test(value)) {
    return 'Invalid card number';
  }

  return 'Valid card';
}

export function checkCardName(value) {
  const isValidLength = /^.{3,16}$/;
  if (!isValidLength.test(value)) {
    return 'Card name must be between 3-16 characters long';
  }

  return 'Valid card';
}
