
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
  const safeStatus = [400, 404, 500].includes(status)
    ? status
    : 500;

  const code =
    safeStatus === 400
      ? 'BAD_REQUEST'
      : safeStatus === 404
        ? 'NOT_FOUND'
        : 'INTERNAL_ERROR';

  // Never expose internal error details for server errors.
  const message =
    safeStatus === 500
      ? 'Internal server error'
      : payload.message ||
        (safeStatus === 404
          ? 'Resource not found'
          : 'Bad request');

  return res.status(safeStatus).json({
    error: {
      code: payload.code || code,
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
