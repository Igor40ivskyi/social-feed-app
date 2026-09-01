import { postKeys } from '@/api/keys/postKeys';
import { getPostsWithLocalSync } from '@/services/postsService';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useGetPosts = (searchQuery: string = '') => {
  return useInfiniteQuery({
    queryKey: postKeys.list({ search: searchQuery }),
    queryFn: ({ pageParam }) => getPostsWithLocalSync(searchQuery, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
  });
};
