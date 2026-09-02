import { apiClient } from '@/api/client';
import { apiEndpoints } from '@/api/endpoints';
import { postKeys } from '@/api/keys/postKeys';
import { queryTimes } from '@/api/queryTimes';
import { PostsResponse } from '@/api/services/postsApi';
import { findLocalPostById, getUpdatedPostsMap } from '@/services/storage';
import { Post } from '@/types/post';
import { InfiniteData, QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const findPlaceholderPost = (queryClient: QueryClient, postId: number): Post | undefined => {
  if (postId < 0) {
    return findLocalPostById(postId);
  }

  const cachedLists = queryClient.getQueriesData<InfiniteData<PostsResponse>>({
    queryKey: postKeys.lists(),
  });

  for (const [, data] of cachedLists) {
    const post = data?.pages.flatMap((page) => page.posts).find((p) => p.id === postId);
    if (post) {
      return post;
    }
  }

  return undefined;
};

export const useGetPost = (postId: number) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: async () => {
      await delay(3000);

      try {
        const { data } = await apiClient.get<Post>(apiEndpoints.posts.detail(postId));
        return getUpdatedPostsMap()[postId] ?? data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          const localPost = findLocalPostById(postId);
          if (localPost) {
            return localPost;
          }
        }

        throw error;
      }
    },
    placeholderData: () => findPlaceholderPost(queryClient, postId),
    staleTime: queryTimes.postDetail.staleTime,
    gcTime: queryTimes.postDetail.gcTime,
  });
};
