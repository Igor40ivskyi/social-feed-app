import { postKeys } from '@/api/keys/postKeys';
import { userKeys } from '@/api/keys/userKeys';
import { fetchPostCommentsFromApi } from '@/api/services/postsApi';
import { fetchUserFromApi } from '@/api/services/usersApi';
import { useQueryClient } from '@tanstack/react-query';

export const usePrefetchPostDetails = () => {
  const queryClient = useQueryClient();

  return (postId: number, userId: number) => {
    queryClient.prefetchQuery({
      queryKey: userKeys.detail(userId),
      queryFn: () => fetchUserFromApi(userId),
    });

    queryClient.prefetchQuery({
      queryKey: postKeys.comments(postId),
      queryFn: () => fetchPostCommentsFromApi(postId),
    });
  };
};
