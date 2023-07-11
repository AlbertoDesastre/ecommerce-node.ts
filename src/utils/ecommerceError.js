function ecommerceError(error, code) {
  const err = new Error(error);

  if (code) {
    err.statusCode = code;
  }

  return err;
}

module.exports = ecommerceError;
