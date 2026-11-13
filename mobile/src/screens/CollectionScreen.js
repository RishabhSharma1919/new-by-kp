import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 44) / 2;

const FILTERS = [
  { id: 'all', label: 'All Works' },
  { id: 'art1', label: 'Painters' },
  { id: 'art2', label: 'Sculptors' },
  { id: 'art3', label: 'Photographers' },
  { id: 'art4', label: 'Designers' },
  { id: 'art5', label: 'Illustrators' },
];

export default function CollectionScreen({ route, navigation }) {
  const { products, theme, isDarkMode } = useContext(ShopContext);
  const initialFilter = route.params?.categoryFilter || 'all';

  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('featured'); // 'featured', 'lowToHigh', 'highToLow'

  // Filter & Search Logic
  const filteredProducts = products.filter((item) => {
    let matchesCategory = true;
    if (activeFilter !== 'all') {
      matchesCategory = !!item[activeFilter];
    }

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'lowToHigh') return a.price - b.price;
    if (sortOrder === 'highToLow') return b.price - a.price;
    return 0;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      {/* Header & Search */}
      <View style={[styles.header, { backgroundColor: theme.backgroundSecondary, borderBottomColor: theme.cardBorder }]}>
        <Text style={[styles.title, { color: theme.primaryText }]}>Artwork Gallery</Text>
        <View style={[styles.searchBar, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <Ionicons name="search-outline" size={18} color={theme.mutedText} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search by title, artist, or style..."
            placeholderTextColor={theme.mutedText}
            style={[styles.searchInput, { color: theme.primaryText }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.mutedText} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTERS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isActive = activeFilter === item.id;
            return (
              <TouchableOpacity
                style={[
                  styles.filterPill,
                  { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
                  isActive && { backgroundColor: theme.accentBone, borderColor: theme.accentBone },
                ]}
                onPress={() => setActiveFilter(item.id)}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: theme.secondaryText },
                    isActive && { color: isDarkMode ? '#1F2424' : '#FFFFFF', fontWeight: '800' },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* Results Counter & Sort Toggle */}
        <View style={styles.metaRow}>
          <Text style={[styles.counterText, { color: theme.mutedText }]}>
            Showing <Text style={{ color: theme.primaryText, fontWeight: '700' }}>{sortedProducts.length}</Text> artworks
          </Text>
          <TouchableOpacity
            style={[styles.sortBtn, { backgroundColor: theme.badgeBg }]}
            onPress={() => {
              if (sortOrder === 'featured') setSortOrder('lowToHigh');
              else if (sortOrder === 'lowToHigh') setSortOrder('highToLow');
              else setSortOrder('featured');
            }}
          >
            <Ionicons name="swap-vertical" size={14} color={isDarkMode ? theme.accentBone : theme.primaryText} style={{ marginRight: 4 }} />
            <Text style={[styles.sortBtnText, { color: isDarkMode ? theme.accentBone : theme.primaryText }]}>
              {sortOrder === 'lowToHigh' ? 'Price: Low' : sortOrder === 'highToLow' ? 'Price: High' : 'Featured'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid List */}
      <FlatList
        data={sortedProducts}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="color-palette-outline" size={48} color={theme.mutedText} />
            <Text style={[styles.emptyTitle, { color: theme.primaryText }]}>No Artworks Found</Text>
            <Text style={[styles.emptyDesc, { color: theme.mutedText }]}>Try adjusting your search terms or filter.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ width: COLUMN_WIDTH }}>
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterList: {
    paddingBottom: 12,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  counterText: {
    fontSize: 12,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 13,
  },
});
