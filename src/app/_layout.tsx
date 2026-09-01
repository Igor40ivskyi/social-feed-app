import { colors } from '@/styles/global';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 24,
      refetchOnWindowFocus: true,
      retry: 1,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(tabs)' />
        <Stack.Screen
          name='post-details'
          options={{
            headerShown: true,
            title: 'Post Details',
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: colors.header },
            headerTintColor: colors.text,
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}