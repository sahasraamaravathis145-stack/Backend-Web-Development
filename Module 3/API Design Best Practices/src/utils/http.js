
function sendList(res, result) {
  return res.status(200).json({
    data: result.data,
    meta: result.meta
  });
}

function sendCreated(res, post) {
  return res.status(201).json({
    data: post
  });
}

function sendOk(res, payload) {
  return res.status(200).json({
    data: payload
  });
}

function sendError(res, status, payload = {}) {
  const messages = {
    400: 'Bad request',
    404: 'Resource not found',
    500: 'Internal server error'
  };

  const code = payload.code || (
    status === 404 ? 'NOT_FOUND' :
    status === 400 ? 'BAD_REQUEST' :
    'INTERNAL_ERROR'
  );

  const message =
    status === 500
      ? 'Internal server error'
      : payload.message || messages[status] || 'Request failed';

  return res.status(status).json({
    error: {
      code,
      message
    }
  });
}

module.exports = {
  sendList,
  sendCreated,
  sendOk,
  sendError
};
