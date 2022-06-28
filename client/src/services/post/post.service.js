/* eslint-disable linebreak-style */
import {
  ApiPath,
  PostsApiPath,
  HttpMethod,
  ContentType
} from 'common/enums/enums';

class Post {
  constructor({ apiPath, http }) {
    this._apiPath = apiPath;
    this._http = http;
  }

  getAllPosts(filter) {
    return this._http.load(`${this._apiPath}${ApiPath.POSTS}`, {
      method: HttpMethod.GET,
      query: filter
    });
  }

  getPost(id) {
    return this._http.load(
      `${this._apiPath}${ApiPath.POSTS}${PostsApiPath.ROOT}${id}`,
      {
        method: HttpMethod.GET
      }
    );
  }

  addPost(payload) {
    return this._http.load(`${this._apiPath}${ApiPath.POSTS}`, {
      method: HttpMethod.POST,
      contentType: ContentType.JSON,
      payload: JSON.stringify(payload)
    });
  }

  likePost(postId) {
    return this._http.load(
      `${this._apiPath}${ApiPath.POSTS}${PostsApiPath.REACT}`,
      {
        method: HttpMethod.PUT,
        contentType: ContentType.JSON,
        payload: JSON.stringify({
          postId,
          isLike: true,
          isDislike: false
        })
      }
    );
  }

  dislikePost(postId) {
    return this._http.load(
      `${this._apiPath}${ApiPath.POSTS}${PostsApiPath.REACT}`,
      {
        method: HttpMethod.PUT,
        contentType: ContentType.JSON,
        payload: JSON.stringify({
          postId,
          isLike: false,
          isDislike: true
        })
      }
    );
  }

  deletePost(postId) {
    this._http.load(
      `${this._apiPath}${ApiPath.POSTS}${PostsApiPath.ROOT}${postId}`,
      {
        method: HttpMethod.DELETE
      }
    );
    const postsFilter = {
      userId: undefined,
      from: 0,
      count: 10
    };

    const result = this.getAllPosts(postsFilter);
    return result;
  }

  updatePost(payload) {
    return this._http.load(`${this._apiPath}${ApiPath.POSTS}${PostsApiPath.ROOT}${payload.id}`, {
      method: HttpMethod.PUT,
      contentType: ContentType.JSON,
      payload: JSON.stringify(payload)
    });
  }
}

export { Post };
