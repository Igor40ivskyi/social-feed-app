import { Comment as CommentType } from '@/api/hooks/useGetPostComments';
import { colors } from '@/styles/global';
import { StyleSheet, Text, View } from 'react-native';

type CommentProps = {
  comment: CommentType;
};

export function Comment({ comment }: CommentProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.author}>{comment.user.fullName}</Text>
        <Text style={styles.username}>@{comment.user.username}</Text>
      </View>
      <Text style={styles.body}>{comment.body}</Text>
      <Text style={styles.likes}>Likes: {comment.likes}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: 6,
  },
  username: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  likes: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
  },
});
