import { useCreatePost } from '@/api/hooks/useCreatePost';
import { useGetPosts } from '@/api/hooks/useGetPosts';
import { PostCard } from '@/components/PostCard';
import { PostFormModal } from '@/components/PostFormModal';
import { useDebounce } from '@/hooks/useDebounce';
import { colors } from '@/styles/global';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SEARCH_DEBOUNCE_MS = 450;

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const createPost = useCreatePost();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching
  } = useGetPosts(debouncedSearchQuery);

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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search posts..."
          placeholderTextColor={colors.textSecondary}
          clearButtonMode="while-editing"
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <Pressable
          style={styles.addButton}
          onPress={() => setCreateModalVisible(true)}
          accessibilityLabel="Create post"
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>
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
          <Text style={styles.empty}>
            {debouncedSearchQuery
              ? `No posts found for '${debouncedSearchQuery}'`
              : 'No posts available'}
          </Text>
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
      <PostFormModal
        visible={isCreateModalVisible}
        heading="Create Post"
        submitLabel="Publish"
        isSubmitting={createPost.isPending}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={(values) => {
          createPost.mutate(values, {
            onSuccess: () => setCreateModalVisible(false),
          });
        }}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.header,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  addButton: {
    marginLeft: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.background,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
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
