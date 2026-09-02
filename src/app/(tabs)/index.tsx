import { useGetPosts } from '@/api/hooks/useGetPosts';
import { PostCard } from '@/components/PostCard';
import { SearchInput } from '@/components/SearchInput';
import { colors } from '@/styles/global';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useGetPosts(searchQuery);

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <SearchInput onSearchChange={handleSearchChange} />
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.error}>Failed to load posts</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
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
          ListEmptyComponent={
            !isFetching ? (
              <Text style={styles.empty}>
                {searchQuery ? `No posts found for '${searchQuery}'` : 'No posts available'}
              </Text>
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
      )}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 16,
    flexGrow: 1,
  },
  footer: {
    marginVertical: 16,
  },
  error: {
    color: colors.alert,
  },
  empty: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 24,
  },
});
