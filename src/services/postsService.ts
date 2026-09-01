import { fetchPostsFromApi, PostsResponse } from '@/api/services/postsApi';
import { getCreatedPosts, getUpdatedPostsMap } from '@/services/storage';
import { mergePostsWithLocalData } from '@/utils/postMerger';

export const getPostsWithLocalSync = async (search: string, skip: number): Promise<PostsResponse> => {
  const data = await fetchPostsFromApi(search, skip);

  const posts = mergePostsWithLocalData({
    serverPosts: data.posts,
    createdPosts: getCreatedPosts(),
    updatedPostsMap: getUpdatedPostsMap(),
    skip,
    searchQuery: search,
  });

  return {
    ...data,
    posts,
  };
};
