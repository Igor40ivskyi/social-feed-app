import { apiClient } from '@/api/client';
import { apiEndpoints } from '@/api/endpoints';
import { postKeys } from '@/api/keys/postKeys';
import { PostsResponse } from '@/api/services/postsApi';
import { deleteLocalPost, saveLocalPost } from '@/services/storage';
import { Post } from '@/types/post';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

const CREATED_POST_USER_ID = 5;

export type CreatePostInput = {
  title: string;
  body: string;
};

type CreatePostContext = {
  previousPosts: InfiniteData<PostsResponse> | undefined;
  optimisticPost: Post;
};

const createPostApi = async (title: string, body: string): Promise<void> => {
  await apiClient.post(apiEndpoints.posts.create, {
    title,
    body,
    tags: [],
    userId: CREATED_POST_USER_ID,
  });
};

const prependPost = (
  data: InfiniteData<PostsResponse> | undefined,
  post: Post
): InfiniteData<PostsResponse> | undefined => {
  if (!data) {
    return data;
  }

  const [firstPage, ...restPages] = data.pages;

  return {
    ...data,
    pages: [{ ...firstPage, posts: [post, ...firstPage.posts] }, ...restPages],
  };
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const homeListKey = postKeys.list({ search: '' });

  return useMutation<void, unknown, CreatePostInput, CreatePostContext>({
    mutationFn: ({ title, body }) => createPostApi(title, body),
    onMutate: async ({ title, body }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });

      const previousPosts = queryClient.getQueryData<InfiniteData<PostsResponse>>(homeListKey);

      const optimisticPost: Post = {
        id: -Date.now(),
        userId: CREATED_POST_USER_ID,
        title,
        body,
        tags: [],
        reactions: { likes: 0, dislikes: 0 },
      };

      queryClient.setQueryData<InfiniteData<PostsResponse>>(homeListKey, (old) =>
        prependPost(old, optimisticPost)
      );

      saveLocalPost(optimisticPost);

      return { previousPosts, optimisticPost };
    },
    onError: (_error, _input, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(homeListKey, context.previousPosts);
      deleteLocalPost(context.optimisticPost.id);

      Alert.alert('Failed to publish post', 'Please try again.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};
