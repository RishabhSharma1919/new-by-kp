import React, { useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShopContext } from '../context/ShopContext';

export default function ProductCard({ product, onPress }) {
  const { wishlist, toggleWishlist, currency, theme, isDarkMode } = useContext(ShopContext);
  const isWished = wishlist.includes(product._id);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
        },
      ]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images?.[0] || 'https://via.placeholder.com/300' }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={[styles.heartBtn, isWished && styles.heartBtnActive]}
          onPress={() => toggleWishlist(product._id)}
        >
          <Ionicons
            name={isWished ? 'heart' : 'heart-outline'}
            size={18}
            color={isWished ? '#E63946' : '#FFFFFF'}
          />
        </TouchableOpacity>

        {product.bestSeller ? (
          <View style={[styles.badge, { backgroundColor: theme.goldAccent }]}>
            <Text style={styles.badgeText}>FEATURED</Text>
          </View>
        ) : (
          <View style={[styles.badge, { backgroundColor: 'rgba(0,0,0,0.65)' }]}>
            <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>AR WALL</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.category, { color: theme.mutedText }]}>
          {product.category || 'Artwork'}
        </Text>
        <Text style={[styles.name, { color: theme.primaryText }]} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={[styles.price, { color: isDarkMode ? theme.accentBone : theme.primaryText }]}>
          {currency}{product.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#151818',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  info: {
    padding: 12,
  },
  category: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
  },
});
