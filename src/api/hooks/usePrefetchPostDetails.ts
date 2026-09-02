import { commentKeys } from '@/api/keys/commentKeys';
import { userKeys } from '@/api/keys/userKeys';
import { fetchUserFromApi } from '@/api/services/usersApi';
import { getCommentsWithLocalSync } from '@/services/commentsService';
import { useQueryClient } from '@tanstack/react-query';

export const usePrefetchPostDetails = () => {
  const queryClient = useQueryClient();

  return (postId: number, userId: number) => {
    queryClient.prefetchQuery({
      queryKey: userKeys.detail(userId),
      queryFn: () => fetchUserFromApi(userId),
    });

    queryClient.prefetchQuery({
      queryKey: commentKeys.list(postId),
      queryFn: () => getCommentsWithLocalSync(postId),
    });
  };
};
