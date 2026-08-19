import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { ALL_ALGORITHMS } from '@/algorithms';
import { ThemedText } from '@/components/ui/ThemedText';
import { AlgorithmCard } from '@/components/ui/AlgorithmCard';
import { useProgressStore } from '@/store/progressStore';

export default function FavoritesScreen() {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const router = useRouter();
  const { favorites } = useProgressStore();

  const favoriteAlgorithms = ALL_ALGORITHMS.filter(algo => favorites.includes(algo.id));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={favoriteAlgorithms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <ThemedText variant="h1" style={styles.header}>Your Favorites</ThemedText>
        }
        renderItem={({ item }) => (
          <AlgorithmCard
            algorithm={item}
            onPress={() => router.push(`/visualizer/${item.id}`)}
          />
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
    padding: Spacing.four,
  },
  empty: {
    alignItems: 'center',
    marginTop: Spacing.six,
  },
});
