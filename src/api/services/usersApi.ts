import { apiClient } from '@/api/client';
import { apiEndpoints } from '@/api/endpoints';
import { User } from '@/types/user';

export const fetchUserFromApi = async (userId: number): Promise<User> => {
  const { data } = await apiClient.get<User>(apiEndpoints.users.detail(userId));
  return data;
};
