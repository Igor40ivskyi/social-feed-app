import { postKeys } from '@/api/keys/postKeys';
import { PostsResponse } from '@/api/services/postsApi';
import { deletePost as deletePostRequest } from '@/services/postsService';
import { deleteLocalPost, saveLocalPost } from '@/services/storage';
import { Post } from '@/types/post';
import { isLocalPost } from '@/utils/postId';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

type DeletePostContext = {
  previousPosts: InfiniteData<PostsResponse> | undefined;
  deletedPost: Post | undefined;
};

const removePost = (
  data: InfiniteData<PostsResponse> | undefined,
  postId: number
): InfiniteData<PostsResponse> | undefined => {
  if (!data) {
    return data;
  }

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      posts: page.posts.filter((post) => post.id !== postId),
    })),
  };
};

export const useDeletePost = (postId: number) => {
  const queryClient = useQueryClient();
  const homeListKey = postKeys.list({ search: '' });

  return useMutation<void, unknown, void, DeletePostContext>({
    mutationFn: () => deletePostRequest(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });

      const previousPosts = queryClient.getQueryData<InfiniteData<PostsResponse>>(homeListKey);

      const deletedPost = previousPosts?.pages
        .flatMap((page) => page.posts)
        .find((post) => post.id === postId);

      queryClient.setQueryData<InfiniteData<PostsResponse>>(homeListKey, (old) => removePost(old, postId));

      deleteLocalPost(postId);

      return { previousPosts, deletedPost };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(homeListKey, context.previousPosts);

      if (context.deletedPost && isLocalPost(postId)) {
        saveLocalPost(context.deletedPost);
      }

      Alert.alert('Failed to delete post', 'Please try again.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};
