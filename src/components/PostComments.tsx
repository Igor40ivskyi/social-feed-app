import { useGetPostComments } from '@/api/hooks/useGetPostComments';
import { Comment } from '@/components/Comment';
import { colors } from '@/styles/global';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type PostCommentsProps = {
  postId: number;
};

export function PostComments({ postId }: PostCommentsProps) {
  const { data, isLoading, isError } = useGetPostComments(postId);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Comments</Text>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )}

      {!isLoading && isError && (
        <View style={styles.centered}>
          <Text style={styles.error}>Failed to load comments</Text>
        </View>
      )}

      {!isLoading && !isError && data?.comments.length === 0 && (
        <View style={styles.centered}>
          <Text style={styles.empty}>No comments yet</Text>
        </View>
      )}

      {!isLoading &&
        !isError &&
        data?.comments.map((comment) => <Comment key={comment.id} comment={comment} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  empty: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  error: {
    color: colors.alert,
    fontSize: 14,
  },
});
