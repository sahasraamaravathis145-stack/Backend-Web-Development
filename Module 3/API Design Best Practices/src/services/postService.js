
const store = require('../data/postStore');

function listPosts(query = {}) {
  const allPosts = store.getAllPosts();

  // Pagination
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const requestedLimit = parseInt(query.limit, 10) || 2;
  const limit = Math.min(10, Math.max(1, requestedLimit));

  const total = allPosts.length;
  const pages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;

  const data = allPosts.slice(startIndex, startIndex + limit);

  return {
    data,
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
  return store.createPost({
    title: body.title,
    author: body.author
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
  const err = new Error('Internal server error');
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
