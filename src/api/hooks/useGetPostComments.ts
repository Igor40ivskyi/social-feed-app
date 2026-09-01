import { apiClient } from '@/api/client';
import { apiEndpoints } from '@/api/endpoints';
import { postKeys } from '@/api/keys/postKeys';
import { Comment } from '@/types/comment';
import { useQuery } from '@tanstack/react-query';

type CommentsResponse = {
  comments: Comment[];
  total: number;
  skip: number;
  limit: number;
};

export const useGetPostComments = (postId: number) => {
  return useQuery({
    queryKey: postKeys.comments(postId),
    queryFn: async () => {
      const { data } = await apiClient.get<CommentsResponse>(apiEndpoints.posts.comments(postId));
      return data;
    },
  });
};
