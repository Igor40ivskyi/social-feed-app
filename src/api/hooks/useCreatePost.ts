import { apiClient } from '@/api/client';
import { apiEndpoints } from '@/api/endpoints';
import { postKeys } from '@/api/keys/postKeys';
import { saveCreatedPost } from '@/services/storage';
import { Post } from '@/types/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CREATED_POST_USER_ID = 5;

export type CreatePostInput = {
  title: string;
  body: string;
  tags: string[];
};

const createPost = async ({ title, body, tags }: CreatePostInput): Promise<Post> => {
  await apiClient.post(apiEndpoints.posts.create, {
    title,
    body,
    tags,
    userId: CREATED_POST_USER_ID,
  });

  return {
    id: -Date.now(),
    userId: CREATED_POST_USER_ID,
    title,
    body,
    tags,
    reactions: { likes: 0, dislikes: 0 },
  };
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: (post) => {
      saveCreatedPost(post);
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
};
