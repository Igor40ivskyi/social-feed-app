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

const getPosts = async (search: string, skip: number) => {
  const trimmedSearch = search.trim();

  const { data } = await apiClient.get<PostsResponse>(
    trimmedSearch ? '/posts/search' : '/posts',
    {
      params: trimmedSearch
        ? { q: trimmedSearch, limit: POSTS_LIMIT, skip }
        : { limit: POSTS_LIMIT, skip },
    }
  );

  return data;
};

export const useGetPosts = (searchQuery: string = '') => {
  return useInfiniteQuery({
    queryKey: ['posts', 'infinite', searchQuery],
    queryFn: ({ pageParam }) => getPosts(searchQuery, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
  });
};
