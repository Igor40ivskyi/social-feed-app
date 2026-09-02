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

type CommentFormModalProps = {
  visible: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (body: string) => void;
};

const SNAP_POINTS = ['75%'];

export function CommentFormModal({ visible, isSubmitting, onClose, onSubmit }: CommentFormModalProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => SNAP_POINTS, []);
  const [body, setBody] = useState('');

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  const isValid = body.trim().length > 0;

  const handleClose = () => {
    setBody('');
    onClose();
  };

  const handleSubmit = () => {
    if (!isValid || isSubmitting) {
      return;
    }

    onSubmit(body.trim());
    setBody('');
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
      onDismiss={handleClose}
    >
      <BottomSheetScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Add Comment</Text>

        <BottomSheetTextInput
          style={[styles.input, styles.multilineInput]}
          value={body}
          onChangeText={setBody}
          placeholder="Write a comment..."
          placeholderTextColor={colors.textSecondary}
          multiline
          textAlignVertical="top"
          autoFocus
        />

        <View style={[styles.actions, { paddingBottom: insets.bottom }]}>
          <Pressable style={styles.cancelButton} onPress={handleClose} disabled={isSubmitting}>
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
              <Text style={styles.submitButtonText}>Submit</Text>
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
  input: {
    backgroundColor: colors.header,
    color: colors.text,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
  },
  multilineInput: {
    height: 140,
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
