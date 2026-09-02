import { useDeletePost } from '@/api/hooks/useDeletePost';
import { usePrefetchPostDetails } from '@/api/hooks/usePrefetchPostDetails';
import { useUpdatePost } from '@/api/hooks/useUpdatePost';
import { PostFormModal } from '@/components/PostFormModal';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type PostCardProps = {
  postId: number;
  title: string;
  body: string;
  userId: number;
  likes: number;
  dislikes: number;
  tags: string[];
};

export function PostCard({ postId, title, body, userId, likes, dislikes, tags }: PostCardProps) {
  const router = useRouter();
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isEditVisible, setEditVisible] = useState(false);
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost(postId);
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost(postId);
  const prefetchPostDetails = usePrefetchPostDetails();

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        <Pressable
          style={styles.moreButton}
          onPress={() => setEditVisible(true)}
          accessibilityLabel="Edit post"
        >
          <Ionicons name="ellipsis-horizontal" size={18} color={colors.textSecondary} />
        </Pressable>
      </View>
      <Text style={styles.body}>{body}</Text>
      <Text style={styles.meta}>Author: {userId}</Text>
      <Text style={styles.meta}>Likes: {likes}</Text>
      <Text style={styles.meta}>Dislikes: {dislikes}</Text>
      <View style={styles.tags}>
        {tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </View>
      <Button
        label="Details"
        style={styles.detailsButton}
        onPressIn={() => prefetchPostDetails(postId, userId)}
        onPress={() =>
          router.push({
            pathname: '/post-details',
            params: { postId: String(postId), userId: String(userId) },
          })
        }
      />

      <Pressable
        style={styles.deleteButton}
        onPress={() => setDeleteModalVisible(true)}
        disabled={isDeleting}
        accessibilityLabel="Delete post"
      >
        {isDeleting ? (
          <ActivityIndicator size="small" color={colors.alert} />
        ) : (
          <Ionicons name="trash-outline" size={18} color={colors.alert} />
        )}
      </Pressable>

      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.confirmBackdrop}>
          <View style={styles.confirmSheet}>
            <Text style={styles.confirmText}>Are you sure you want to delete this post?</Text>
            <View style={styles.confirmActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setDeleteModalVisible(false)}
                disabled={isDeleting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.confirmDeleteButton}
                disabled={isDeleting}
                onPress={() => {
                  setDeleteModalVisible(false);
                  deletePost();
                }}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color={colors.background} />
                ) : (
                  <Text style={styles.confirmDeleteButtonText}>Delete</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <PostFormModal
        key={String(isEditVisible)}
        visible={isEditVisible}
        heading="Edit Post"
        submitLabel="Save"
        isSubmitting={isUpdating}
        initialValues={{ title, body, tags }}
        onClose={() => setEditVisible(false)}
        onSubmit={(values) => {
          updatePost(values);
          setEditVisible(false);
        }}
      />
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    marginRight: 8,
  },
  moreButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
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
  detailsButton: {
    marginTop: 12,
    alignSelf: 'center',
  },
  deleteButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.header,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  confirmSheet: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
  },
  confirmText: {
    color: colors.text,
    fontSize: 15,
    marginBottom: 20,
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  confirmDeleteButton: {
    backgroundColor: colors.alert,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  confirmDeleteButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '700',
  },
});
