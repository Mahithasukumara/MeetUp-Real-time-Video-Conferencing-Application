function isValidFormat(str) {
  const regex = /^[A-Za-z0-9]{4}-[A-Za-z0-9]{3}-[A-Za-z0-9]{3}$/;
  return regex.test(str);
}

export default isValidFormat;
