import { colors } from '@/styles/global';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

const queryClient = new QueryClient();

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