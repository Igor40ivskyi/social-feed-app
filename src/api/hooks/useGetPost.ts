import { apiClient } from '@/api/client';
import { apiEndpoints } from '@/api/endpoints';
import { postKeys } from '@/api/keys/postKeys';
import { findLocalPostById, getUpdatedPostsMap } from '@/services/storage';
import { Post } from '@/types/post';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGetPost = (postId: number) => {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: async () => {
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
  });
};
