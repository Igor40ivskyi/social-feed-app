import { apiClient } from '@/api/client';
import { apiEndpoints } from '@/api/endpoints';
import { userKeys } from '@/api/keys/userKeys';
import { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';

export const useGetUser = (userId: number) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: async () => {
      const { data } = await apiClient.get<User>(apiEndpoints.users.detail(userId));
      return data;
    },
  });
};
