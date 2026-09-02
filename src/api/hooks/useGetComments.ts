import { commentKeys } from '@/api/keys/commentKeys';
import { getCommentsWithLocalSync } from '@/services/commentsService';
import { useQuery } from '@tanstack/react-query';

export const useGetComments = (postId: number) => {
  return useQuery({
    queryKey: commentKeys.list(postId),
    queryFn: () => getCommentsWithLocalSync(postId),
  });
};
