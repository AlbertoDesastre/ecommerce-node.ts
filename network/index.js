/* This function it's created to send a generic response message/body + not write the same thing on every route */
function success({ res, message, data, status }) {
  const statusCode = status || 200;
  const statusMessage = message || 'All OK';

  console.log(statusMessage);

  return res.status(statusCode).send({
    error: false,
    status: statusCode,
    message: statusMessage,
    body: data,
  });
}

/* The same follows for this */
function error({ res, message, status }) {
  const statusCode = status || 500;
  const statusMessage = message || 'Internal server error';

  console.log(message);
  /*   console.log(statusMessage); */

  return res.status(statusCode).send({
    error: true,
    status: statusCode,
    body: statusMessage,
  });
}

module.exports = { response: success, error };
