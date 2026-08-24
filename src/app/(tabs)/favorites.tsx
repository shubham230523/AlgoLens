import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { ALL_ALGORITHMS } from '@/algorithms';
import { ThemedText } from '@/components/ui/ThemedText';
import { AlgorithmCard } from '@/components/ui/AlgorithmCard';
import { useProgressStore } from '@/store/progressStore';
import { useAdaptiveLayout } from '@/hooks/useAdaptiveLayout';

export default function FavoritesScreen() {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const router = useRouter();
  const { favorites } = useProgressStore();
  const { getColumns, contentPadding } = useAdaptiveLayout();

  const numColumns = getColumns(1, 2, 3);
  const favoriteAlgorithms = ALL_ALGORITHMS.filter(algo => favorites.includes(algo.id));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        key={numColumns}
        data={favoriteAlgorithms}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingHorizontal: contentPadding, gap: Spacing.two }]}
        columnWrapperStyle={numColumns > 1 ? { gap: Spacing.two } : undefined}
        ListHeaderComponent={
          <ThemedText variant="h1" style={styles.header}>Your Favorites</ThemedText>
        }
        renderItem={({ item }) => (
          <View style={[
            { flex: 1 },
            numColumns > 1 && { maxWidth: `${100 / numColumns}%` }
          ]}>
            <AlgorithmCard
                algorithm={item}
                onPress={() => router.push(`/visualizer/${item.id}`)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText variant="body">You haven't favorited any algorithms yet.</ThemedText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginVertical: Spacing.four,
  },
  listContent: {
    paddingVertical: Spacing.four,
  },
  empty: {
    alignItems: 'center',
    marginTop: Spacing.six,
  },
});
