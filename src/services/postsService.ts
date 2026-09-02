import { deletePostApi, fetchPostsFromApi, PostsResponse } from '@/api/services/postsApi';
import {
  addDeletedPostId,
  deleteLocalPost,
  getCreatedPosts,
  getDeletedPostIds,
  getUpdatedPostsMap,
} from '@/services/storage';
import { isLocalPost } from '@/utils/postId';
import { mergePostsWithLocalData } from '@/utils/postMerger';

export const getPostsWithLocalSync = async (search: string, skip: number): Promise<PostsResponse> => {
  const data = await fetchPostsFromApi(search, skip);

  const posts = mergePostsWithLocalData({
    serverPosts: data.posts,
    createdPosts: getCreatedPosts(),
    updatedPostsMap: getUpdatedPostsMap(),
    deletedPostIds: getDeletedPostIds(),
    skip,
    searchQuery: search,
  });

  return {
    ...data,
    posts,
  };
};

export const deletePost = async (postId: number): Promise<void> => {
  if (isLocalPost(postId)) {
    deleteLocalPost(postId);
    return;
  }

  await deletePostApi(postId);
  addDeletedPostId(postId);
};