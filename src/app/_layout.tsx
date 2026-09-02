import { colors } from '@/styles/global';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <QueryClientProvider client={queryClient}>
            <BottomSheetModalProvider>
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
            </BottomSheetModalProvider>
          </QueryClientProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}