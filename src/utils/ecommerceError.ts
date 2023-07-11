function ecommerceError(error, code) {
  const err: any = new Error(error);

  if (code) {
    err.statusCode = code;
  }

  return err;
}
export { ecommerceError };
/* module.exports = ecommerceError; */