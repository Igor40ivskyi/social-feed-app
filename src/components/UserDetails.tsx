import { useGetUser } from '@/api/hooks/useGetUser';
import { colors } from '@/styles/global';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

type UserDetailsProps = {
  userId: number;
};

export function UserDetails({ userId }: UserDetailsProps) {
  const { data: user, isLoading, isError } = useGetUser(userId);

  if (isLoading) {
    return (
      <View style={[styles.card, styles.centered]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (isError || !user) {
    return (
      <View style={[styles.card, styles.centered]}>
        <Text style={styles.error}>Failed to load author details</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Author</Text>
      <View style={styles.row}>
        <Image source={{ uri: user.image }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.meta}>@{user.username}</Text>
          <Text style={styles.meta}>{user.email}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    backgroundColor: colors.header,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  error: {
    color: colors.alert,
  },
});
