/* This function it's created to send a generic response message/body + not write the same thing on every route */
function success({ req, res, message, data, status }) {
  const statusCode = status | 200;
  const statusMessage = message | 'All OK';

  return res.status(status).send({
    error: false,
    status: statusCode,
    message: statusMessage,
    body: data,
  });
}

/* The same follows for this */
function error({ req, res, message, status }) {
  const statusCode = status | 500;
  const statusMessage = message | 'Internal server error';

  return res.status(status).send({
    error: true,
    status: statusCode,
    body: statusMessage,
  });
}

module.exports = { success, error };
