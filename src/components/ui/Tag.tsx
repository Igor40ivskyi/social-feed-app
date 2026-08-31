import { colors } from '@/styles/global';
import { StyleSheet, Text, View } from 'react-native';

type TagProps = {
  label: string;
};

export function Tag({ label }: TagProps) {
  return (
    <View style={styles.tag}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: colors.header,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginTop: 6,
  },
  label: {
    fontSize: 12,
    color: colors.primary,
  },
});
