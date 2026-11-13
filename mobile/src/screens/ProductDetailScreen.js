import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShopContext } from '../context/ShopContext';
import GALLERY_CONFIG from '../constants/galleryConfig';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { currency, addToCart, wishlist, toggleWishlist, theme, isDarkMode } = useContext(ShopContext);

  const [selectedImage, setSelectedImage] = useState(
    (Array.isArray(product?.images) && product.images[0]) || product?.image || 'https://via.placeholder.com/600'
  );

  React.useEffect(() => {
    const defaultImg =
      (Array.isArray(product?.images) && product.images[0]) ||
      product?.image ||
      'https://via.placeholder.com/600';
    setSelectedImage(defaultImg);
  }, [product]);
  const [selectedSize, setSelectedSize] = useState(product.size || 'Standard');
  const [customNotes, setCustomNotes] = useState('');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null); // { valid: bool, message: string }
  const [checkingPincode, setCheckingPincode] = useState(false);

  const isWished = wishlist.includes(product._id);
  const isCustomArt = product.art1 || product.art2 || product.art3 || product.art4 || product.art5;

  // Real Indian Pincode validator
  const checkPincode = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeStatus({ valid: false, message: 'Please enter a valid 6-digit Indian PIN code.' });
      return;
    }
    setCheckingPincode(true);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, { signal: controller.signal });
      clearTimeout(timer);
      const data = await res.json();
      if (data[0]?.Status === 'Success') {
        const district = data[0].PostOffice?.[0]?.District || 'your area';
        setPincodeStatus({
          valid: true,
          message: `✔ Delivery available to ${district}. White-glove installation available.`,
        });
      } else {
        setPincodeStatus({ valid: false, message: '❌ Delivery not available for this pincode.' });
      }
    } catch (e) {
      setPincodeStatus({ valid: true, message: '✔ Standard courier delivery available.' });
    } finally {
      setCheckingPincode(false);
    }
  };

  // Direct Phone Call
  const handleCallOrder = () => {
    Linking.openURL(`tel:${GALLERY_CONFIG.PHONE_NUMBER_RAW}`).catch(() => {
      Alert.alert('Gallery Phone', `Call us at ${GALLERY_CONFIG.PHONE_NUMBER}`);
    });
  };

  // Direct WhatsApp Inquiry
  const handleWhatsAppOrder = () => {
    const text = `Hello Art & Art Gallery! I would like to inquire about and order the artwork "${product.name}" (${currency}${product.price}). Please share acquisition details.`;
    const url = `https://wa.me/${GALLERY_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Contact Gallery', `WhatsApp us at ${GALLERY_CONFIG.PHONE_NUMBER}`);
    });
  };

  /* Buying part commented out for now as requested:
  const handleAddToCart = () => {
    addToCart(product, selectedSize, customNotes);
    Alert.alert('Added to Cart', `"${product.name}" has been added to your shopping cart.`, [
      { text: 'Continue Shopping' },
      { text: 'View Cart', onPress: () => navigation.navigate('CartTab') },
    ]);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, customNotes);
    navigation.navigate('Checkout');
  };
  */

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Artwork Preview */}
        <View style={[styles.imageBox, { backgroundColor: isDarkMode ? '#121515' : '#EAEAE2' }]}>
          <Image source={{ uri: selectedImage }} style={styles.mainImage} resizeMode="contain" />
          <TouchableOpacity
            style={[styles.floatingHeart, isWished && styles.floatingHeartActive]}
            onPress={() => toggleWishlist(product._id)}
          >
            <Ionicons name={isWished ? 'heart' : 'heart-outline'} size={22} color={isWished ? '#E63946' : '#FFFFFF'} />
          </TouchableOpacity>
        </View>

        {/* Thumbnail Carousel if multiple images */}
        {(() => {
          const productImages = Array.isArray(product?.images) && product.images.length > 0
            ? product.images.filter(Boolean)
            : [];
          if (productImages.length <= 1) return null;

          return (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[styles.thumbnailRow, { backgroundColor: theme.backgroundSecondary }]}
            >
              {productImages.map((img, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedImage(img)}
                  style={[
                    styles.thumbnailWrap,
                    selectedImage === img && { borderColor: theme.goldAccent || theme.accentBone, borderWidth: 2 },
                  ]}
                >
                  <Image source={{ uri: img }} style={styles.thumbnail} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          );
        })()}

        {/* Artwork Header Info */}
        <View style={styles.infoSection}>
          <View style={styles.badgeRow}>
            <View style={[styles.categoryBadge, { backgroundColor: theme.badgeBg }]}>
              <Text style={[styles.categoryBadgeText, { color: isDarkMode ? theme.accentBone : theme.primaryText }]}>
                {product.category || 'Fine Art'}
              </Text>
            </View>
            {product.bestSeller && (
              <View style={[styles.bestSellerBadge, { backgroundColor: theme.goldAccent }]}>
                <Text style={styles.bestSellerBadgeText}>FEATURED</Text>
              </View>
            )}
          </View>

          <Text style={[styles.title, { color: theme.primaryText }]}>{product.name}</Text>
          <Text style={[styles.price, { color: isDarkMode ? theme.accentBone : theme.primaryText }]}>
            {currency}{product.price}
          </Text>

          {/* AR / Wall Preview Action Card */}
          <TouchableOpacity
            style={[
              styles.wallPreviewCard,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              },
            ]}
            onPress={() => navigation.navigate('WallPreview', { product, artworkImage: selectedImage })}
            activeOpacity={0.85}
          >
            <View style={[styles.wallPreviewIconBox, { backgroundColor: theme.badgeBg }]}>
              <Ionicons
                name="camera-reverse-outline"
                size={24}
                color={isDarkMode ? theme.accentBone : theme.primaryText}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.wallPreviewTitle, { color: theme.primaryText }]}>Preview on Your Wall (AR)</Text>
              <Text style={[styles.wallPreviewSubtitle, { color: theme.secondaryText }]}>
                See how this painting scales against your room wall with camera preview.
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDarkMode ? theme.accentBone : theme.primaryText}
            />
          </TouchableOpacity>

          {/* Dimensions Specs */}
          <View style={[styles.dimensionsBox, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <Text style={[styles.sectionHeaderTitle, { color: theme.primaryText }]}>Artwork Specifications</Text>
            <View style={[styles.specRow, { borderBottomColor: theme.cardBorder }]}>
              <Text style={[styles.specLabel, { color: theme.mutedText }]}>Dimensions:</Text>
              <Text style={[styles.specValue, { color: theme.primaryText }]}>
                {product.length || 24} × {product.breadth || 18} inches
              </Text>
            </View>
            <View style={[styles.specRow, { borderBottomColor: theme.cardBorder }]}>
              <Text style={[styles.specLabel, { color: theme.mutedText }]}>Medium:</Text>
              <Text style={[styles.specValue, { color: theme.primaryText }]}>
                {product.subCategory || 'Original Medium on Canvas'}
              </Text>
            </View>
            <View style={[styles.specRow, { borderBottomColor: 'transparent' }]}>
              <Text style={[styles.specLabel, { color: theme.mutedText }]}>Authenticity:</Text>
              <Text style={[styles.specValue, { color: theme.primaryText }]}>Signed by Artist with Gallery Certificate</Text>
            </View>
          </View>

          {/* Description */}
          <View style={[styles.descBox, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <Text style={[styles.sectionHeaderTitle, { color: theme.primaryText }]}>Curator's Notes</Text>
            <Text style={[styles.descText, { color: theme.secondaryText }]}>{product.description}</Text>
          </View>

          {/* Custom Commission Section */}
          {isCustomArt && (
            <View
              style={[
                styles.customBox,
                {
                  backgroundColor: isDarkMode ? 'rgba(224, 122, 95, 0.08)' : 'rgba(231, 111, 81, 0.08)',
                  borderColor: isDarkMode ? 'rgba(224, 122, 95, 0.3)' : 'rgba(231, 111, 81, 0.25)',
                },
              ]}
            >
              <View style={styles.customBoxHeader}>
                <Ionicons name="brush-outline" size={18} color={theme.orangeAccent} style={{ marginRight: 6 }} />
                <Text style={[styles.customBoxTitle, { color: theme.orangeAccent }]}>Bespoke Artist Customization</Text>
              </View>
              <Text style={[styles.customBoxDesc, { color: theme.secondaryText }]}>
                Personalize this artwork with specific color palettes, dedication plaques, or framing styles:
              </Text>
              <TextInput
                style={[
                  styles.customInput,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.cardBorder,
                    color: theme.primaryText,
                  },
                ]}
                placeholder="E.g., Please incorporate a warmer amber tint or bespoke framing..."
                placeholderTextColor={theme.mutedText}
                multiline
                numberOfLines={3}
                value={customNotes}
                onChangeText={setCustomNotes}
              />
            </View>
          )}

          {/* Pincode Serviceability */}
          <View style={[styles.pincodeBox, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <Text style={[styles.sectionHeaderTitle, { color: theme.primaryText }]}>Delivery Availability Check</Text>
            <View style={styles.pincodeInputRow}>
              <TextInput
                style={[
                  styles.pincodeInput,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.cardBorder,
                    color: theme.primaryText,
                  },
                ]}
                placeholder="Enter 6-digit Pincode"
                placeholderTextColor={theme.mutedText}
                keyboardType="numeric"
                maxLength={6}
                value={pincode}
                onChangeText={setPincode}
              />
              <TouchableOpacity
                style={[
                  styles.pincodeBtn,
                  { backgroundColor: isDarkMode ? theme.accentBone : theme.primaryText },
                ]}
                onPress={checkPincode}
                disabled={checkingPincode}
              >
                <Text style={[styles.pincodeBtnText, { color: isDarkMode ? '#1F2424' : '#FFFFFF' }]}>
                  {checkingPincode ? 'Checking...' : 'Check'}
                </Text>
              </TouchableOpacity>
            </View>
            {pincodeStatus && (
              <Text
                style={[
                  styles.pincodeStatusText,
                  { color: pincodeStatus.valid ? (theme.greenAccent || '#81B29A') : '#E63946' },
                ]}
              >
                {pincodeStatus.message}
              </Text>
            )}
          </View>

          {/* Collector Provenance & Acquisition Card */}
          <View style={[styles.inquiryCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.inquiryHeader}>
              <Ionicons name="sparkles" size={16} color={theme.goldAccent} style={{ marginRight: 8 }} />
              <Text style={[styles.inquiryTitle, { color: theme.primaryText }]}>Acquisition & Provenance</Text>
            </View>
            <Text style={[styles.inquiryDesc, { color: theme.secondaryText }]}>
              Interested in acquiring this piece? Handcrafted and verified with an artist-signed Certificate of Authenticity. For private viewing or courier dispatch, reach out directly to our gallery curator.
            </Text>
            <View style={styles.inquiryActions}>
              <TouchableOpacity
                style={[styles.inquiryCallBtn, { backgroundColor: theme.accentBone }]}
                onPress={handleCallOrder}
              >
                <Ionicons name="call" size={13} color={isDarkMode ? '#1F2424' : '#FFFFFF'} style={{ marginRight: 6 }} />
                <Text style={[styles.inquiryCallBtnText, { color: isDarkMode ? '#1F2424' : '#FFFFFF' }]}>
                  Call Curator
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.inquiryWhatsAppBtn, { borderColor: '#25D366' }]}
                onPress={handleWhatsAppOrder}
              >
                <Ionicons name="logo-whatsapp" size={15} color="#25D366" style={{ marginRight: 6 }} />
                <Text style={styles.inquiryWhatsAppBtnText}>WhatsApp Inquiry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Discreet Sticky Bottom Inquiry Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.backgroundSecondary,
            borderTopColor: theme.cardBorder,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.callOrderBtn, { backgroundColor: theme.accentBone }]}
          onPress={handleCallOrder}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={17}
            color={isDarkMode ? '#1F2424' : '#FFFFFF'}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.callOrderText, { color: isDarkMode ? '#1F2424' : '#FFFFFF' }]}>
            Inquire About Artwork
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.whatsAppOrderBtn, { borderColor: '#25D366' }]}
          onPress={handleWhatsAppOrder}
        >
          <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBox: {
    width: width,
    height: 380,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mainImage: {
    width: '92%',
    height: '92%',
  },
  floatingHeart: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingHeartActive: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  thumbnailRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  thumbnailWrap: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 10,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    padding: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bestSellerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bestSellerBadgeText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 18,
  },
  wallPreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  wallPreviewIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  wallPreviewTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  wallPreviewSubtitle: {
    fontSize: 11,
    lineHeight: 15,
  },
  dimensionsBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
  },
  specLabel: {
    fontSize: 13,
  },
  specValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  descBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  descText: {
    fontSize: 14,
    lineHeight: 22,
  },
  customBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  customBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  customBoxTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  customBoxDesc: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 16,
  },
  customInput: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    textAlignVertical: 'top',
    fontSize: 13,
  },
  pincodeBox: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  pincodeInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pincodeInput: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 42,
  },
  pincodeBtn: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  pincodeBtnText: {
    fontWeight: '700',
    fontSize: 13,
  },
  pincodeStatusText: {
    fontSize: 12,
    marginTop: 8,
    lineHeight: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    gap: 10,
    alignItems: 'center',
  },
  callOrderBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 12,
  },
  callOrderText: {
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  whatsAppOrderBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 211, 102, 0.08)',
  },
  inquiryCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginTop: 18,
  },
  inquiryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inquiryTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  inquiryDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  inquiryActions: {
    flexDirection: 'row',
    gap: 10,
  },
  inquiryCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  inquiryCallBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  inquiryWhatsAppBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  inquiryWhatsAppBtnText: {
    color: '#25D366',
    fontSize: 12,
    fontWeight: '800',
  },
});
