import { CommentsResponse, fetchPostCommentsFromApi } from '@/api/services/postsApi';
import { getLocalCommentsByPostId } from '@/services/storage';
import { isLocalPost } from '@/utils/postId';

export const getCommentsWithLocalSync = async (postId: number): Promise<CommentsResponse> => {
  const localComments = getLocalCommentsByPostId(postId);

  if (isLocalPost(postId)) {
    return {
      comments: localComments,
      total: localComments.length,
      skip: 0,
      limit: localComments.length,
    };
  }

  try {
    const data = await fetchPostCommentsFromApi(postId);

    return {
      ...data,
      comments: [...localComments, ...data.comments],
      total: data.total + localComments.length,
    };
  } catch {
    return {
      comments: localComments,
      total: localComments.length,
      skip: 0,
      limit: localComments.length,
    };
  }
};
