import { apiClient } from '@/api/client';
import { apiEndpoints } from '@/api/endpoints';
import { postKeys } from '@/api/keys/postKeys';
import { saveUpdatedPost } from '@/services/storage';
import { Post } from '@/types/post';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

export type UpdatePostInput = {
  id: number;
  userId: number;
  reactions: Post['reactions'];
  title: string;
  body: string;
  tags: string[];
};

const updatePost = async ({ id, userId, reactions, title, body, tags }: UpdatePostInput): Promise<Post> => {
  await apiClient.put(apiEndpoints.posts.detail(id), { title, body, tags });
  return { id, userId, reactions, title, body, tags };
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: (updatedPost) => {
      saveUpdatedPost(updatedPost);

      queryClient.setQueryData(postKeys.detail(updatedPost.id), updatedPost);

      queryClient.setQueriesData<InfiniteData<{ posts: Post[]; total: number; skip: number; limit: number }>>(
        { queryKey: postKeys.lists() },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)),
            })),
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
};