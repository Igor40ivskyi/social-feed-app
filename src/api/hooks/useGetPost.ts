import { apiClient } from '@/api/client';
import { Post } from '@/api/hooks/useGetPosts';
import { useQuery } from '@tanstack/react-query';

export const useGetPost = (postId: number) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const { data } = await apiClient.get<Post>(`/posts/${postId}`);
      return data;
    },
  });
};
