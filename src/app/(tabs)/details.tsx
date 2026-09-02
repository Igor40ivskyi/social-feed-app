import { CreatePostForm } from '@/components/CreatePostForm';
import { colors } from '@/styles/global';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreatePostScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Post</Text>
      <CreatePostForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
});
