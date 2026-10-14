
const store = require('../data/postStore');

function listPosts(query = {}) {
  function parsePositiveInteger(value, fallback, name) {
    if (value === undefined) {
      return fallback;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < 1) {
      const err = new Error(
        `${name} must be a positive integer`
      );
      err.statusCode = 400;
      throw err;
    }

    return parsed;
  }

  const page = parsePositiveInteger(query.page, 1, 'page');
  const requestedLimit = parsePositiveInteger(
    query.limit,
    2,
    'limit'
  );

  // Default limit = 2; maximum limit = 10.
  const limit = Math.min(10, requestedLimit);

  const allPosts = store.getAllPosts();
  const total = allPosts.length;
  const pages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;

  return {
    data: allPosts.slice(startIndex, startIndex + limit),
    meta: {
      page,
      limit,
      total,
      pages
    }
  };
}

function getPost(id) {
  return store.getPostById(id);
}

function createPost(body = {}) {
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body) ||
    typeof body.title !== 'string' ||
    !body.title.trim() ||
    typeof body.author !== 'string' ||
    !body.author.trim()
  ) {
    const err = new Error(
      'title and author must be non-empty strings'
    );
    err.statusCode = 400;
    throw err;
  }

  return store.createPost({
    title: body.title.trim(),
    author: body.author.trim()
  });
}

function likePost(id) {
  const post = store.incrementLikes(id);

  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    throw err;
  }

  return post;
}

function explode() {
  const err = new Error('Intentional internal failure');
  err.statusCode = 500;
  throw err;
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};
