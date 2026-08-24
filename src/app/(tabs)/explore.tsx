import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { ALL_ALGORITHMS, CATEGORIES } from '@/algorithms';
import { ThemedText } from '@/components/ui/ThemedText';
import { AlgorithmCard } from '@/components/ui/AlgorithmCard';
import { Input } from '@/components/ui/Input';
import { Search } from 'lucide-react-native';
import { useAdaptiveLayout } from '@/hooks/useAdaptiveLayout';

export default function ExploreScreen() {
  const { category: initialCategory } = useLocalSearchParams<{ category?: string }>();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const router = useRouter();
  const { getColumns, contentPadding } = useAdaptiveLayout();

  const numColumns = getColumns(1, 2, 3);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlgorithms = useMemo(() => {
    return ALL_ALGORITHMS.filter(algo => {
      const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            algo.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = initialCategory ? algo.category === initialCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, initialCategory]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchHeader}>
        <Input
          placeholder="Search algorithms..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          clearButtonMode="while-editing"
          autoFocus={false}
        />
      </View>

      <FlatList
        key={numColumns}
        data={filteredAlgorithms}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingHorizontal: contentPadding, gap: Spacing.two }]}
        columnWrapperStyle={numColumns > 1 ? { gap: Spacing.two } : undefined}
        ListHeaderComponent={
          initialCategory ? (
            <ThemedText variant="h2" style={styles.listHeader}>
              Category: {initialCategory}
            </ThemedText>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <AlgorithmCard
                algorithm={item}
                onPress={() => router.push(`/visualizer/${item.id}`)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText variant="body">No algorithms found matching your search.</ThemedText>
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
  searchHeader: {
    padding: Spacing.four,
  },
  searchInput: {
    height: 50,
  },
  listContent: {
    padding: Spacing.four,
    paddingTop: 0,
  },
  listHeader: {
    marginBottom: Spacing.three,
  },
  empty: {
    alignItems: 'center',
    marginTop: Spacing.six,
  },
});
