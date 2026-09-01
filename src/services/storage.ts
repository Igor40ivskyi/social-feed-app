import { Post } from '@/types/post';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV();

const CREATED_POSTS_KEY = 'createdPosts';
const UPDATED_POSTS_KEY = 'updatedPosts';

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
