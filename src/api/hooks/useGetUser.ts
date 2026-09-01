import { userKeys } from '@/api/keys/userKeys';
import { fetchUserFromApi } from '@/api/services/usersApi';
import { useQuery } from '@tanstack/react-query';

export const useGetUser = (userId: number) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => fetchUserFromApi(userId),
  });
};
