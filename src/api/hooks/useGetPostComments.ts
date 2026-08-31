import { apiClient } from '@/api/client';
import { useQuery } from '@tanstack/react-query';

export type Comment = {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
};

type CommentsResponse = {
  comments: Comment[];
  total: number;
  skip: number;
  limit: number;
};

export const useGetPostComments = (postId: number) => {
  return useQuery({
    queryKey: ['posts', postId, 'comments'],
    queryFn: async () => {
      const { data } = await apiClient.get<CommentsResponse>(`/posts/${postId}/comments`);
      return data;
    },
  });
};
