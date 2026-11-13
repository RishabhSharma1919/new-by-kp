import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ShopContext } from '../context/ShopContext';
import GALLERY_CONFIG from '../constants/galleryConfig';

export default function WishlistScreen({ navigation }) {
  const { wishlist, products, toggleWishlist, addToCart, currency, theme, isDarkMode } =
    useContext(ShopContext);

  const wishedProducts = products.filter((p) => wishlist.includes(p._id));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { backgroundColor: theme.backgroundSecondary, borderBottomColor: theme.cardBorder }]}>
        <Text style={[styles.title, { color: theme.primaryText }]}>Saved Collection</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          {wishedProducts.length} {wishedProducts.length === 1 ? 'artwork' : 'artworks'} curated in your wishlist
        </Text>
      </View>

      <FlatList
        data={wishedProducts}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={54} color={theme.mutedText} />
            <Text style={[styles.emptyTitle, { color: theme.primaryText }]}>Your Wishlist is Empty</Text>
            <Text style={[styles.emptyDesc, { color: theme.secondaryText }]}>
              Tap the heart icon on any artwork in the gallery to save it to your personal collection.
            </Text>
            <TouchableOpacity
              style={[styles.browseBtn, { backgroundColor: isDarkMode ? theme.accentBone : theme.primaryText }]}
              onPress={() => navigation.navigate('ExploreTab')}
            >
              <Text style={[styles.browseBtnText, { color: isDarkMode ? '#1F2424' : '#FFFFFF' }]}>
                Explore Gallery
              </Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              },
            ]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          >
            <Image
              source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }}
              style={styles.image}
            />
            <View style={styles.info}>
              <View>
                <Text style={[styles.category, { color: isDarkMode ? theme.accentBone : theme.orangeAccent }]}>
                  {item.category || 'Artwork'}
                </Text>
                <Text style={[styles.name, { color: theme.primaryText }]} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>

              <Text style={[styles.price, { color: isDarkMode ? theme.accentBone : theme.primaryText }]}>
                {currency}{item.price}
              </Text>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[
                    styles.cartBtn,
                    { backgroundColor: isDarkMode ? theme.accentBone : theme.primaryText },
                  ]}
                  onPress={() =>
                    navigation.navigate('WallPreview', {
                      product: item,
                      artworkImage: item.images?.[0],
                    })
                  }
                >
                  <Ionicons
                    name="camera-outline"
                    size={14}
                    color={isDarkMode ? '#1F2424' : '#FFFFFF'}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[styles.cartBtnText, { color: isDarkMode ? '#1F2424' : '#FFFFFF' }]}>
                    Room Preview
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.removeBtn, { backgroundColor: theme.badgeBg }]}
                  onPress={() => toggleWishlist(item._id)}
                >
                  <Ionicons name="trash-outline" size={15} color="#E63946" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  image: {
    width: 90,
    height: 100,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    marginVertical: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  cartBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  callBtn: {
    padding: 7,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtn: {
    padding: 7,
    borderRadius: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  browseBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  browseBtnText: {
    fontWeight: '700',
    fontSize: 13,
  },
});
