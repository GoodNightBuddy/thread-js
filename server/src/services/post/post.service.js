/* eslint-disable linebreak-style */
class Post {
  constructor({ postRepository, postReactionRepository }) {
    this._postRepository = postRepository;
    this._postReactionRepository = postReactionRepository;
  }

  getPosts(filter) {
    return this._postRepository.getPosts(filter);
  }

  getPostById(id) {
    return this._postRepository.getPostById(id);
  }

  deletePostById(id) {
    return this._postRepository.deleteById(id);
  }

  updatePostById(id, { imageId, body }) {
    return this._postRepository.updateById(id, { imageId, body });
  }

  create(userId, post) {
    return this._postRepository.create({
      ...post,
      userId
    });
  }

  async setReaction(userId, { postId, isLike, isDislike }) {
    // define the callback for future use as a promise
    let isSwitched = false;

    const updateOrDelete = async react => {
      if ((react.isLike === isLike) || (react.isDislike === isDislike)) {
        return this._postReactionRepository.deleteById(react.id);
      }
      isSwitched = true;
      return this._postReactionRepository.updateById(react.id, { isLike, isDislike });
    };

    const reaction = await this._postReactionRepository.getPostReaction(
      userId,
      postId
    );

    let result = reaction
      ? await updateOrDelete(reaction)
      : await this._postReactionRepository.create({ userId, postId, isLike, isDislike });

    // the result is an integer when an entity is deleted
    if (Number.isInteger(result)) {
      return {};
    }
    result = await this._postReactionRepository.getPostReaction(userId, postId);
    result.isSwitched = isSwitched;
    return result;
  }
}

export { Post };
