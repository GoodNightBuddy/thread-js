/* eslint-disable linebreak-style */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ActionType } from './common.js';

const loadPosts = createAsyncThunk(
  ActionType.SET_ALL_POSTS,
  async (filters, { extra: { services } }) => {
    const posts = await services.post.getAllPosts(filters);
    return { posts };
  }
);

const loadMorePosts = createAsyncThunk(
  ActionType.LOAD_MORE_POSTS,
  async (filters, { getState, extra: { services } }) => {
    const {
      posts: { posts }
    } = getState();
    const loadedPosts = await services.post.getAllPosts(filters);
    const filteredPosts = loadedPosts.filter(
      post => !(posts && posts.some(loadedPost => post.id === loadedPost.id))
    );

    return { posts: filteredPosts };
  }
);

const applyPost = createAsyncThunk(
  ActionType.ADD_POST,
  async (postId, { extra: { services } }) => {
    const post = await services.post.getPost(postId);
    return { post };
  }
);

const createPost = createAsyncThunk(
  ActionType.ADD_POST,
  async (post, { extra: { services } }) => {
    const { id } = await services.post.addPost(post);
    const newPost = await services.post.getPost(id);

    return { post: newPost };
  }
);

const toggleExpandedPost = createAsyncThunk(
  ActionType.SET_EXPANDED_POST,
  async (postId, { extra: { services } }) => {
    const post = postId ? await services.post.getPost(postId) : undefined;
    return { post };
  }
);

const likePost = createAsyncThunk(
  ActionType.REACT,
  async (postId, { getState, extra: { services } }) => {
    const response = await services.post.likePost(postId);
    const diff = response.id ? 1 : -1; // if ID exists then the post was liked, otherwise - like was removed

    let mapLikes;

    if (response.isSwitched) {
      mapLikes = post => ({
        ...post,
        likeCount: Number(post.likeCount) + diff, // diff is taken from the current closure
        dislikeCount: Number(post.dislikeCount) - 1 // put away dislike if it exists
      });
    } else {
      mapLikes = post => ({
        ...post,
        likeCount: Number(post.likeCount) + diff // diff is taken from the current closure
      });
    }

    const {
      posts: { posts, expandedPost }
    } = getState();
    const updated = posts.map(post => (
      post.id !== postId ? post : mapLikes(post)
    ));
    const updatedExpandedPost = expandedPost?.id === postId
      ? mapLikes(expandedPost)
      : undefined;

    return { posts: updated, expandedPost: updatedExpandedPost };
  }
);

// I know that the code is repeated, but how to make it better and(!) clearer - nedokumekal

const dislikePost = createAsyncThunk(
  ActionType.REACT,
  async (postId, { getState, extra: { services } }) => {
    const response = await services.post.dislikePost(postId);
    const diff = response.id ? 1 : -1; // if ID exists then the post was liked, otherwise - like was removed

    let mapDislikes;

    if (response.isSwitched) {
      mapDislikes = post => ({
        ...post,
        dislikeCount: Number(post.dislikeCount) + diff, // diff is taken from the current closure
        likeCount: Number(post.likeCount) - 1 // put away dislike if it exists
      });
    } else {
      mapDislikes = post => ({
        ...post,
        dislikeCount: Number(post.dislikeCount) + diff // diff is taken from the current closure
      });
    }

    const {
      posts: { posts, expandedPost }
    } = getState();
    const updated = posts.map(post => (
      post.id !== postId ? post : mapDislikes(post)
    ));
    const updatedExpandedPost = expandedPost?.id === postId
      ? mapDislikes(expandedPost)
      : undefined;

    return { posts: updated, expandedPost: updatedExpandedPost };
  }
);

const addComment = createAsyncThunk(
  ActionType.COMMENT,
  async (request, { getState, extra: { services } }) => {
    const { id } = await services.comment.addComment(request);
    const comment = await services.comment.getComment(id);

    const mapComments = post => ({
      ...post,
      commentCount: Number(post.commentCount) + 1,
      comments: [...(post.comments || []), comment] // comment is taken from the current closure
    });

    const {
      posts: { posts, expandedPost }
    } = getState();
    const updated = posts.map(post => (
      post.id !== comment.postId ? post : mapComments(post)
    ));

    const updatedExpandedPost = expandedPost?.id === comment.postId
      ? mapComments(expandedPost)
      : undefined;

    return { posts: updated, expandedPost: updatedExpandedPost };
  }
);

export {
  loadPosts,
  loadMorePosts,
  applyPost,
  createPost,
  toggleExpandedPost,
  likePost,
  dislikePost,
  addComment
};
