import { apiClient } from '@/api/client';
import { apiEndpoints } from '@/api/endpoints';
import { postKeys } from '@/api/keys/postKeys';
import { PostsResponse } from '@/api/services/postsApi';
import { updateLocalPost } from '@/services/storage';
import { Post } from '@/types/post';
import { isLocalPost } from '@/utils/postId';
import { InfiniteData, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

export type UpdatePostInput = {
  title: string;
  body: string;
  tags: string[];
};

type PostsListSnapshot = [QueryKey, InfiniteData<PostsResponse> | undefined][];

type UpdatePostContext = {
  previousPost: Post | undefined;
  previousPostsList: PostsListSnapshot;
};

const updatePostApi = async (postId: number, input: UpdatePostInput): Promise<void> => {
  if (isLocalPost(postId)) {
    return;
  }

  await apiClient.put(apiEndpoints.posts.detail(postId), input);
};

const replacePostInLists = (
  data: InfiniteData<PostsResponse> | undefined,
  updatedPost: Post
): InfiniteData<PostsResponse> | undefined => {
  if (!data) {
    return data;
  }

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      posts: page.posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
    })),
  };
};

export const useUpdatePost = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, UpdatePostInput, UpdatePostContext>({
    mutationFn: (input) => updatePostApi(postId, input),
    onMutate: async ({ title, body, tags }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });

      const previousPostsList = queryClient.getQueriesData<InfiniteData<PostsResponse>>({
        queryKey: postKeys.lists(),
      });

      const previousPost =
        queryClient.getQueryData<Post>(postKeys.detail(postId)) ??
        previousPostsList
          .flatMap(([, data]) => data?.pages.flatMap((page) => page.posts) ?? [])
          .find((post) => post.id === postId);

      if (previousPost) {
        const optimisticPost: Post = { ...previousPost, title, body, tags };

        queryClient.setQueryData<Post>(postKeys.detail(postId), optimisticPost);

        queryClient.setQueriesData<InfiniteData<PostsResponse>>({ queryKey: postKeys.lists() }, (old) =>
          replacePostInLists(old, optimisticPost)
        );

        updateLocalPost(optimisticPost);
      }

      return { previousPost, previousPostsList };
    },
    onError: (_error, _input, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(postKeys.detail(postId), context.previousPost);

      context.previousPostsList.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      if (context.previousPost) {
        updateLocalPost(context.previousPost);
      }

      Alert.alert('Failed to update post. Changes reverted.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};
