import { commentKeys } from '@/api/keys/commentKeys';
import { queryTimes } from '@/api/queryTimes';
import { getCommentsWithLocalSync } from '@/services/commentsService';
import { useQuery } from '@tanstack/react-query';

export const useGetComments = (postId: number) => {
  return useQuery({
    queryKey: commentKeys.list(postId),
    queryFn: () => getCommentsWithLocalSync(postId),
    staleTime: queryTimes.comments.staleTime,
    gcTime: queryTimes.comments.gcTime,
  });
};
