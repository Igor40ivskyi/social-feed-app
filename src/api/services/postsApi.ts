import { apiClient } from '@/api/client';
import { apiEndpoints } from '@/api/endpoints';
import { Post } from '@/types/post';

export type PostsResponse = {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
};

const POSTS_LIMIT = 30;

export const fetchPostsFromApi = async (search: string, skip: number): Promise<PostsResponse> => {
  const trimmedSearch = search.trim();

  const { data } = await apiClient.get<PostsResponse>(
    trimmedSearch ? apiEndpoints.posts.search : apiEndpoints.posts.base,
    {
      params: trimmedSearch
        ? { q: trimmedSearch, limit: POSTS_LIMIT, skip }
        : { limit: POSTS_LIMIT, skip },
    }
  );

  return data;
};
