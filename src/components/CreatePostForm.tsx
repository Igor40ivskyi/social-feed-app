import { useCreatePost } from '@/api/hooks/useCreatePost';
import { colors } from '@/styles/global';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export function CreatePostForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { mutate: createPost, isPending: isSubmitting } = useCreatePost();
  const router = useRouter();

  const isValid = title.trim().length > 0 && body.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid || isSubmitting) {
      return;
    }

    createPost({ title: title.trim(), body: body.trim() });
    setTitle('');
    setBody('');
    router.navigate('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        placeholderTextColor={colors.textSecondary}
        editable={!isSubmitting}
      />

      <Text style={styles.label}>Body</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={body}
        onChangeText={setBody}
        placeholder="Body"
        placeholderTextColor={colors.textSecondary}
        multiline
        textAlignVertical="top"
        editable={!isSubmitting}
      />

      <Pressable
        style={[styles.submitButton, (!isValid || isSubmitting) && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={styles.submitButtonText}>Publish Post</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 16,
  },
  multilineInput: {
    height: 160,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '700',
  },
});
