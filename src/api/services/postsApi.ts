import { apiClient } from '@/api/client';
import { apiEndpoints } from '@/api/endpoints';
import { Comment } from '@/types/comment';
import { Post } from '@/types/post';

export type PostsResponse = {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
};

export type CommentsResponse = {
  comments: Comment[];
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

export const deletePostApi = async (postId: number): Promise<void> => {
  await apiClient.delete(apiEndpoints.posts.delete(postId));
};

export const fetchPostCommentsFromApi = async (postId: number): Promise<CommentsResponse> => {
  const { data } = await apiClient.get<CommentsResponse>(apiEndpoints.posts.comments(postId));
  return data;
};
