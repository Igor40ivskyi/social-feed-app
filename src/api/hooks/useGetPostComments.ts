import { postKeys } from '@/api/keys/postKeys';
import { fetchPostCommentsFromApi } from '@/api/services/postsApi';
import { useQuery } from '@tanstack/react-query';

export const useGetPostComments = (postId: number) => {
  return useQuery({
    queryKey: postKeys.comments(postId),
    queryFn: () => fetchPostCommentsFromApi(postId),
  });
};
