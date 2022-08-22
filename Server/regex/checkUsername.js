const checkUsername = (value) => {
  const isValidLength = /^.{3,16}$/;
  if (!isValidLength.test(value)) {
    return 'Username must be 3-16 Characters Long.';
  }

  return 'Valid username';
};

export default checkUsername;
