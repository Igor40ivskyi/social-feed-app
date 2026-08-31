import {colors} from '@/styles/global';
import {StyleSheet, Text, View} from 'react-native';
import {Tag} from '@/components/ui/Tag';

type PostCardProps = {
  postId: number
  title: string;
  body: string;
  userId: number;
  likes: number;
  dislikes: number;
  tags: string[];
};

export function PostCard({postId,
                           title,
                           body,
                           userId,
                           likes,
                           dislikes,
                           tags,
                         }: PostCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{postId}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      <Text style={styles.meta}>Author: {userId}</Text>
      <Text style={styles.meta}>Likes: {likes}</Text>
      <Text style={styles.meta}>Dislikes: {dislikes}</Text>
      <View style={styles.tags}>
        {tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  meta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
