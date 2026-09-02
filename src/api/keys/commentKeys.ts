import { postKeys } from '@/api/keys/postKeys';

export const commentKeys = {
  list: (postId: number) => postKeys.comments(postId),
};
