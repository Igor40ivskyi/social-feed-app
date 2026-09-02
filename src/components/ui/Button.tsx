import { colors } from '@/styles/global';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

type ButtonProps = {
  label: string;
  onPress: () => void;
  onPressIn?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, onPressIn, disabled, style }: ButtonProps) {
  return (
    <Pressable
      style={[styles.button, style, disabled && styles.buttonDisabled]}
      onPress={onPress}
      onPressIn={onPressIn}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F0F0F0',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: '600',
  },
});
