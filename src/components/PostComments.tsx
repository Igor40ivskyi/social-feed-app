import { useCreateComment } from '@/api/hooks/useCreateComment';
import { useGetComments } from '@/api/hooks/useGetComments';
import { Comment } from '@/components/Comment';
import { CommentFormModal } from '@/components/CommentFormModal';
import { colors } from '@/styles/global';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

type PostCommentsProps = {
  postId: number;
};

export function PostComments({ postId }: PostCommentsProps) {
  const { data, isLoading, isError } = useGetComments(postId);
  const { mutate: createComment, isPending: isCreatingComment } = useCreateComment(postId);
  const [isFormVisible, setFormVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Comments</Text>
        <Pressable style={styles.addButton} onPress={() => setFormVisible(true)}>
          <Text style={styles.addButtonText}>Add Comment</Text>
        </Pressable>
      </View>

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

      <CommentFormModal
        visible={isFormVisible}
        isSubmitting={isCreatingComment}
        onClose={() => setFormVisible(false)}
        onSubmit={(body) => {
          createComment(body);
          setFormVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
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
