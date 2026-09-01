import { postKeys } from '@/api/keys/postKeys';
import { deletePost } from '@/services/postsService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
};
