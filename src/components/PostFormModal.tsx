import { colors } from '@/styles/global';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type PostFormValues = {
  title: string;
  body: string;
  tags: string[];
};

type PostFormModalProps = {
  visible: boolean;
  heading: string;
  submitLabel: string;
  isSubmitting: boolean;
  initialValues: PostFormValues;
  onClose: () => void;
  onSubmit: (values: PostFormValues) => void;
};

const SNAP_POINTS = ['90%'];

const parseTags = (input: string): string[] =>
  input
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

export function PostFormModal({
  visible,
  heading,
  submitLabel,
  isSubmitting,
  initialValues,
  onClose,
  onSubmit,
}: PostFormModalProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => SNAP_POINTS, []);

  const [title, setTitle] = useState(initialValues.title);
  const [body, setBody] = useState(initialValues.body);
  const [tagsInput, setTagsInput] = useState(initialValues.tags.join(', '));

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  const isValid = title.trim().length > 0 && body.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid || isSubmitting) {
      return;
    }

    onSubmit({ title: title.trim(), body: body.trim(), tags: parseTags(tagsInput) });
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      onDismiss={onClose}
    >
      <BottomSheetScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>{heading}</Text>

        <Text style={styles.label}>Title</Text>
        <BottomSheetTextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>Body</Text>
        <BottomSheetTextInput
          style={[styles.input, styles.multilineInput]}
          value={body}
          onChangeText={setBody}
          placeholder="Body"
          placeholderTextColor={colors.textSecondary}
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.label}>Tags (comma separated)</Text>
        <BottomSheetTextInput
          style={styles.input}
          value={tagsInput}
          onChangeText={setTagsInput}
          placeholder="tech, news, life"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={[styles.actions, { paddingBottom: insets.bottom }]}>
          <Pressable style={styles.cancelButton} onPress={onClose} disabled={isSubmitting}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.submitButton, (!isValid || isSubmitting) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.submitButtonText}>{submitLabel}</Text>
            )}
          </Pressable>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.surface,
  },
  handleIndicator: {
    backgroundColor: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.header,
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
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
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '700',
  },
});
