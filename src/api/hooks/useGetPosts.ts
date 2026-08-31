import { apiClient } from '@/api/client';
import { useInfiniteQuery } from '@tanstack/react-query';

export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
  reactions: {
    likes: number;
    dislikes: number;
  };
  tags: string[];
};

type PostsResponse = {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
};

const POSTS_LIMIT = 30;

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam }) => {
      const { data } = await apiClient.get<PostsResponse>('/posts', {
        params: { limit: POSTS_LIMIT, skip: pageParam },
      });
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
  });
};
