import { useGetPost } from '@/api/hooks/useGetPost';
import { PostComments } from '@/components/PostComments';
import { UserDetails } from '@/components/UserDetails';
import { Tag } from '@/components/ui/Tag';
import { colors } from '@/styles/global';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PostDetailsScreen() {
  const { postId, userId } = useLocalSearchParams<{ postId: string; userId: string }>();
  const { data: post, isLoading, isError } = useGetPost(Number(postId));

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
        <Text style={styles.title}>{post.title}</Text>
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
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
