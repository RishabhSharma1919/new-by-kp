import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ShopContext } from '../context/ShopContext';

export default function CartScreen({ navigation }) {
  const { cartItems, updateCartQuantity, getCartTotal, currency, delivery_fee, theme, isDarkMode } =
    useContext(ShopContext);

  const subtotal = getCartTotal();
  const total = subtotal > 0 ? subtotal + delivery_fee : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
        <Text style={[styles.headerTitle, { color: theme.primaryText }]}>Shopping Cart</Text>
        <Text style={[styles.headerSubtitle, { color: theme.secondaryText }]}>
          {cartItems.length} {cartItems.length === 1 ? 'artwork' : 'artworks'} in your cart
        </Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={54} color={theme.mutedText} />
            <Text style={[styles.emptyTitle, { color: theme.primaryText }]}>Your Cart is Empty</Text>
            <Text style={[styles.emptyDesc, { color: theme.mutedText }]}>
              Explore our gallery and add original paintings and collectibles.
            </Text>
            <TouchableOpacity
              style={[styles.browseBtn, { backgroundColor: theme.accentBone }]}
              onPress={() => navigation.navigate('ExploreTab')}
            >
              <Text style={[styles.browseBtnText, { color: isDarkMode ? '#1F2424' : '#FFFFFF' }]}>
                Explore Artworks
              </Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.cartCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <Image
              source={{ uri: item.product?.images?.[0] || 'https://via.placeholder.com/150' }}
              style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
              <Text style={[styles.itemName, { color: theme.primaryText }]} numberOfLines={1}>
                {item.product?.name || 'Curated Artwork'}
              </Text>
              <Text style={[styles.itemCategory, { color: theme.mutedText }]}>
                {item.product?.category || 'Artwork'}
              </Text>
              {item.size && item.size !== 'Default' && (
                <Text style={[styles.itemSpec, { color: isDarkMode ? theme.accentBone : theme.orangeAccent }]}>
                  Size: {item.size}
                </Text>
              )}
              {item.customDescription ? (
                <Text style={[styles.customTag, { color: theme.orangeAccent }]} numberOfLines={1}>
                  Custom: {item.customDescription}
                </Text>
              ) : null}
              <Text style={[styles.itemPrice, { color: isDarkMode ? theme.accentBone : theme.primaryText }]}>
                {currency}{item.product?.price || 0}
              </Text>

              {/* Quantity Controls */}
              <View style={styles.qtyRow}>
                <View style={[styles.qtyControls, { backgroundColor: theme.background, borderColor: theme.cardBorder }]}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateCartQuantity(item.id, item.quantity - 1)}
                  >
                    <Ionicons name="remove" size={14} color={theme.primaryText} />
                  </TouchableOpacity>
                  <Text style={[styles.qtyNumber, { color: theme.primaryText }]}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateCartQuantity(item.id, item.quantity + 1)}
                  >
                    <Ionicons name="add" size={14} color={theme.primaryText} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => updateCartQuantity(item.id, 0)}
                >
                  <Ionicons name="trash-outline" size={16} color="#E63946" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {cartItems.length > 0 && (
        <View style={[styles.summaryCard, { backgroundColor: theme.backgroundSecondary, borderTopColor: theme.cardBorder }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.secondaryText }]}>Subtotal</Text>
            <Text style={[styles.summaryValue, { color: theme.primaryText }]}>{currency}{subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.secondaryText }]}>Insured White-Glove Shipping</Text>
            <Text style={[styles.summaryValue, { color: theme.primaryText }]}>{currency}{delivery_fee}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: theme.cardBorder }]}>
            <Text style={[styles.totalLabel, { color: theme.primaryText }]}>Total</Text>
            <Text style={[styles.totalValue, { color: isDarkMode ? theme.accentBone : theme.primaryText }]}>
              {currency}{total}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.checkoutBtn, { backgroundColor: theme.accentBone }]}
            onPress={() => navigation.navigate('Checkout')}
          >
            <Text style={[styles.checkoutBtnText, { color: isDarkMode ? '#1F2424' : '#FFFFFF' }]}>
              Proceed to Checkout
            </Text>
            <Ionicons name="arrow-forward" size={18} color={isDarkMode ? '#1F2424' : '#FFFFFF'} />
          </TouchableOpacity>
        </View>
      )}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  list: {
    padding: 16,
    paddingBottom: 160,
  },
  cartCard: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  itemImage: {
    width: 85,
    height: 95,
    borderRadius: 10,
    backgroundColor: '#121515',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
  },
  itemCategory: {
    fontSize: 11,
    marginTop: 1,
  },
  itemSpec: {
    fontSize: 11,
    marginTop: 2,
  },
  customTag: {
    fontSize: 10,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  qtyNumber: {
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 6,
  },
  deleteBtn: {
    padding: 6,
  },
  summaryCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    paddingTop: 8,
    marginTop: 4,
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  checkoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  checkoutBtnText: {
    fontSize: 15,
    fontWeight: '800',
    marginRight: 8,
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
