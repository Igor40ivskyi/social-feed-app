import { useGetPost } from '@/api/hooks/useGetPost';
import { useUpdatePost } from '@/api/hooks/useUpdatePost';
import { PostComments } from '@/components/PostComments';
import { PostFormModal } from '@/components/PostFormModal';
import { UserDetails } from '@/components/UserDetails';
import { Tag } from '@/components/ui/Tag';
import { colors } from '@/styles/global';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PostDetailsScreen() {
  const { postId, userId } = useLocalSearchParams<{ postId: string; userId: string }>();
  const { data: post, isLoading, isError } = useGetPost(Number(postId));
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost(Number(postId));

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (isError || !post) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.error}>Failed to load post</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{post.title}</Text>
          <Pressable style={styles.editButton} onPress={() => setEditModalVisible(true)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        </View>
        <Text style={styles.body}>{post.body}</Text>

        <View style={styles.tags}>
          {post.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </View>

        <View style={styles.reactions}>
          <Text style={styles.meta}>Likes: {post.reactions.likes}</Text>
          <Text style={styles.meta}>Dislikes: {post.reactions.dislikes}</Text>
        </View>

        <UserDetails userId={Number(userId)} />

        <PostComments postId={Number(postId)} />
      </ScrollView>

      <PostFormModal
        key={String(isEditModalVisible)}
        visible={isEditModalVisible}
        heading="Edit Post"
        submitLabel="Save"
        isSubmitting={isUpdating}
        initialValues={{ title: post.title, body: post.body }}
        onClose={() => setEditModalVisible(false)}
        onSubmit={(values) => {
          updatePost(values);
          setEditModalVisible(false);
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
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginRight: 12,
  },
  editButton: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  reactions: {
    marginTop: 16,
    marginBottom: 20,
  },
  meta: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  error: {
    color: colors.alert,
  },
});
