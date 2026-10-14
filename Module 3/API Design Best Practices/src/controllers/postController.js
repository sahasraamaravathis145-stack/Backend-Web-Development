
const service = require('../services/postService');
const http = require('../utils/http');

function handleError(res, err) {
  const status = err.statusCode || 500;

  if (status === 500) {
    // Keep diagnostics on the server, not in the API response.
    console.error('Internal API error:', err);
  }

  return http.sendError(res, status, {
    code: status === 404
      ? 'NOT_FOUND'
      : status === 400
        ? 'BAD_REQUEST'
        : 'INTERNAL_ERROR',
    message: status === 404
      ? 'Post not found'
      : status === 400
        ? err.message
        : 'Internal server error'
  });
}

function listPosts(req, res) {
  try {
    const result = service.listPosts(req.query);
    return http.sendList(res, result);
  } catch (err) {
    return handleError(res, err);
  }
}

function getPost(req, res) {
  try {
    const post = service.getPost(req.params.id);

    if (!post) {
      return http.sendError(res, 404, {
        code: 'NOT_FOUND',
        message: 'Post not found'
      });
    }

    return http.sendOk(res, post);
  } catch (err) {
    return handleError(res, err);
  }
}

function createPost(req, res) {
  try {
    const post = service.createPost(req.body);
    return http.sendCreated(res, post);
  } catch (err) {
    return handleError(res, err);
  }
}

function likePost(req, res) {
  try {
    const post = service.likePost(req.params.id);

    return http.sendOk(res, {
      ok: true,
      likes: post.likes
    });
  } catch (err) {
    return handleError(res, err);
  }
}

function explode(req, res) {
  try {
    service.explode();
  } catch (err) {
    // Do not pass err.message, err.stack, or err.debug to sendError.
    console.error('Intentional internal failure:', err);

    return http.sendError(res, 500, {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    });
  }
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};
