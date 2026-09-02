import { Ionicons } from '@expo/vector-icons';
import { useDebounce } from '@/hooks/useDebounce';
import { colors } from '@/styles/global';
import { memo, useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

const SEARCH_DEBOUNCE_MS = 450;

type SearchInputProps = {
  onSearchChange: (query: string) => void;
};

export const SearchInput = memo(({ onSearchChange }: SearchInputProps) => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    onSearchChange(debouncedValue);
  }, [debouncedValue, onSearchChange]);

  const handleClear = () => {
    setValue('');
    onSearchChange('');
  };

  return (
    <View style={styles.searchContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.searchInput}
          value={value}
          onChangeText={setValue}
          placeholder="Search posts..."
          placeholderTextColor={colors.textSecondary}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {value.length > 0 && (
          <Pressable style={styles.clearButton} onPress={handleClear} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>
    </View>
  );
});

SearchInput.displayName = 'SearchInput';

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.header,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  searchInput: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingRight: 32,
    paddingVertical: 8,
    fontSize: 16,
  },
  clearButton: {
    position: 'absolute',
    right: 8,
  },
});
