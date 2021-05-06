const initComment = (Router, services) => {
  const { comment: commentService } = services;
  const router = Router();

  router
    .get('/:id', (req, res, next) => commentService
      .getCommentById(req.params.id)
      .then(comment => res.send(comment))
      .catch(next))
    .post('/', (req, res, next) => commentService
      .create(req.user.id, req.body)
      .then(comment => res.send(comment))
      .catch(next));

  return router;
};

export { initComment };
