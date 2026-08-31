import { apiClient } from '@/api/client';
import { useQuery } from '@tanstack/react-query';

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  image: string;
};

export const useGetUser = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await apiClient.get<User>(`/users/${userId}`);
      return data;
    },
  });
};
