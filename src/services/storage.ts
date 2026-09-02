import { LocalComment } from '@/types/comment';
import { Post } from '@/types/post';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV();

const CREATED_POSTS_KEY = 'createdPosts';
const UPDATED_POSTS_KEY = 'updatedPosts';
const DELETED_POST_IDS_KEY = 'deletedPostIds';
const LOCAL_COMMENTS_KEY = 'localComments';

type LocalCommentsMap = Record<number, LocalComment[]>;

export const getCreatedPosts = (): Post[] => {
  const json = storage.getString(CREATED_POSTS_KEY);
  return json ? JSON.parse(json) : [];
};

export const saveCreatedPost = (post: Post): void => {
  const posts = getCreatedPosts();
  storage.set(CREATED_POSTS_KEY, JSON.stringify([post, ...posts]));
};

export const getUpdatedPostsMap = (): Record<number, Post> => {
  const json = storage.getString(UPDATED_POSTS_KEY);
  return json ? JSON.parse(json) : {};
};

export const saveUpdatedPost = (post: Post): void => {
  const map = getUpdatedPostsMap();
  map[post.id] = post;
  storage.set(UPDATED_POSTS_KEY, JSON.stringify(map));
};

export const findLocalPostById = (postId: number): Post | undefined => {
  const updatedPostsMap = getUpdatedPostsMap();
  if (updatedPostsMap[postId]) {
    return updatedPostsMap[postId];
  }

  return getCreatedPosts().find((post) => post.id === postId);
};

export const removeCreatedPost = (id: number): void => {
  const posts = getCreatedPosts().filter((post) => post.id !== id);
  storage.set(CREATED_POSTS_KEY, JSON.stringify(posts));
};

export const getDeletedPostIds = (): number[] => {
  const json = storage.getString(DELETED_POST_IDS_KEY);
  return json ? JSON.parse(json) : [];
};

export const addDeletedPostId = (id: number): void => {
  const ids = getDeletedPostIds();
  if (!ids.includes(id)) {
    storage.set(DELETED_POST_IDS_KEY, JSON.stringify([...ids, id]));
  }
};

const getLocalCommentsMap = (): LocalCommentsMap => {
  const json = storage.getString(LOCAL_COMMENTS_KEY);
  return json ? JSON.parse(json) : {};
};

export const getLocalCommentsByPostId = (postId: number): LocalComment[] => {
  return getLocalCommentsMap()[postId] ?? [];
};

export const saveLocalComment = (comment: LocalComment): void => {
  const map = getLocalCommentsMap();
  map[comment.postId] = [...(map[comment.postId] ?? []), comment];
  storage.set(LOCAL_COMMENTS_KEY, JSON.stringify(map));
};

export const deleteLocalComment = (postId: number, commentId: number): void => {
  const map = getLocalCommentsMap();
  if (!map[postId]) {
    return;
  }

  map[postId] = map[postId].filter((comment) => comment.id !== commentId);
  storage.set(LOCAL_COMMENTS_KEY, JSON.stringify(map));
};
