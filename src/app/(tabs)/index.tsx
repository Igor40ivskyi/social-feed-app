import { useGetPosts } from '@/api/hooks/useGetPosts';
import { PostCard } from '@/components/PostCard';
import { colors } from '@/styles/global';
import { ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching
  } = useGetPosts();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.error}>Failed to load posts</Text>
      </SafeAreaView>
    );
  }

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator color={colors.primary} style={styles.footer} />
          ) : null
        }
        renderItem={({ item }) => (
          <PostCard
            postId={item.id}
            title={item.title}
            body={item.body}
            userId={item.userId}
            likes={item.reactions.likes}
            dislikes={item.reactions.dislikes}
            tags={item.tags}
          />
        )}
        refreshing={isRefetching}
        onRefresh={refetch}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 16,
  },
  footer: {
    marginVertical: 16,
  },
  error: {
    color: colors.alert,
  },
});
