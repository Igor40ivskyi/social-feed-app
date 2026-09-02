import { commentKeys } from '@/api/keys/commentKeys';
import { CommentsResponse, createCommentApi } from '@/api/services/postsApi';
import { deleteLocalComment, saveLocalComment } from '@/services/storage';
import { LocalComment } from '@/types/comment';
import { isLocalPost } from '@/utils/postId';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

const LOCAL_COMMENT_USER = {
  id: 5,
  username: 'you',
  fullName: 'You',
};

type CreateCommentContext = {
  previousComments: CommentsResponse | undefined;
  optimisticComment: LocalComment;
};

const createComment = async (postId: number, body: string): Promise<void> => {
  if (isLocalPost(postId)) {
    return;
  }

  await createCommentApi(postId, body, LOCAL_COMMENT_USER.id);
};

const addCommentToResponse = (
  response: CommentsResponse | undefined,
  comment: LocalComment
): CommentsResponse => {
  if (!response) {
    return { comments: [comment], total: 1, skip: 0, limit: 1 };
  }

  return {
    ...response,
    comments: [comment, ...response.comments],
    total: response.total + 1,
  };
};

export const useCreateComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string, CreateCommentContext>({
    mutationFn: (body: string) => createComment(postId, body),
    onMutate: async (body: string) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.list(postId) });

      const previousComments = queryClient.getQueryData<CommentsResponse>(commentKeys.list(postId));

      const optimisticComment: LocalComment = {
        id: -Date.now(),
        postId,
        body,
        likes: 0,
        user: LOCAL_COMMENT_USER,
      };

      queryClient.setQueryData<CommentsResponse>(commentKeys.list(postId), (old) =>
        addCommentToResponse(old, optimisticComment)
      );

      saveLocalComment(optimisticComment);

      return { previousComments, optimisticComment };
    },
    onError: (_error, _body, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(commentKeys.list(postId), context.previousComments);
      deleteLocalComment(postId, context.optimisticComment.id);

      Alert.alert('Failed to post comment', 'Please try again.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) });
    },
  });
};
