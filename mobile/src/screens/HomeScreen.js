import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ShopContext } from '../context/ShopContext';
import GALLERY_CONFIG from '../constants/galleryConfig';

const { width } = Dimensions.get('window');

function ArtworkCard({ item, navigation, theme, isDarkMode, wishlist, toggleWishlist, currency }) {
  const images = Array.isArray(item.images) && item.images.length > 0
    ? item.images.filter(Boolean)
    : [item.image || 'https://via.placeholder.com/600'];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const isWished = wishlist.includes(item._id);
  const currentImage = images[activeImageIndex] || images[0];

  const handleWhatsAppInquire = () => {
    const text = `Hello Art & Art Gallery! I would like to inquire about the artwork "${item.name}" (${currency}${item.price}). Please share details on acquisition and home installation.`;
    const url = `https://wa.me/${GALLERY_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Contact Gallery', `WhatsApp us at ${GALLERY_CONFIG.PHONE_NUMBER}`);
    });
  };

  return (
    <View style={[styles.artworkCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
      {/* Top Header: Category & Title + Save Bookmark */}
      <View style={styles.cardTopHeader}>
        <View style={styles.cardTitleBlock}>
          <View style={styles.categoryBadgeRow}>
            <Text style={[styles.categoryPill, { color: theme.goldAccent || '#C5A059', backgroundColor: isDarkMode ? '#1E2323' : '#F5F5ED' }]}>
              {item.category || 'Fine Art'}
            </Text>
            {item.subCategory ? (
              <Text style={[styles.subCategoryText, { color: theme.mutedText }]}>
                • {item.subCategory}
              </Text>
            ) : null}
            {item.bestSeller && (
              <Text style={[styles.featuredPill, { color: '#E5A93C', backgroundColor: 'rgba(229, 169, 60, 0.15)' }]}>
                SPOTLIGHT
              </Text>
            )}
          </View>
          <Text style={[styles.cardArtworkTitle, { color: theme.primaryText }]} numberOfLines={1}>
            {item.name}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.bookmarkBtn, isWished && styles.bookmarkBtnActive]}
          onPress={() => toggleWishlist(item._id)}
        >
          <Ionicons
            name={isWished ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={isWished ? theme.goldAccent || '#C5A059' : theme.primaryText}
          />
        </TouchableOpacity>
      </View>

      {/* Main Image Viewport with Multi-Image Carousel Support */}
      <View style={styles.imageViewport}>
        {images.length > 1 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveImageIndex(idx);
            }}
          >
            {images.map((imgUri, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.95}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
                style={{ width: width, height: width * 1.05 }}
              >
                <Image
                  source={{ uri: imgUri }}
                  style={styles.artworkImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
            style={{ width: width, height: width * 1.05 }}
          >
            <Image
              source={{ uri: currentImage }}
              style={styles.artworkImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

        {/* Multi-Image Pagination Pill */}
        {images.length > 1 && (
          <View style={styles.pageCountPill}>
            <Text style={styles.pageCountText}>
              {activeImageIndex + 1} / {images.length}
            </Text>
          </View>
        )}

        {/* Room Preview floating pill */}
        <TouchableOpacity
          style={styles.floatingPreviewBtn}
          onPress={() => navigation.navigate('WallPreview', { product: item, artworkImage: currentImage })}
        >
          <Ionicons name="camera-outline" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.floatingPreviewText}>View on Wall (AR)</Text>
        </TouchableOpacity>

        {/* Size Badge */}
        {item.size ? (
          <View style={styles.sizeOverlayBadge}>
            <Text style={styles.sizeOverlayText}>{item.size}</Text>
          </View>
        ) : null}
      </View>

      {/* Story & Inquire Bar */}
      <View style={styles.cardFooter}>
        {item.description ? (
          <Text style={[styles.cardDescription, { color: theme.secondaryText }]} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        <View style={styles.footerActionRow}>
          <View>
            <Text style={[styles.priceLabel, { color: theme.mutedText }]}>Gallery Collection</Text>
            <Text style={[styles.cardPrice, { color: isDarkMode ? theme.accentBone : theme.primaryText }]}>
              {currency}{item.price}
            </Text>
          </View>

          <View style={styles.footerButtons}>
            <TouchableOpacity
              style={[styles.inquireBtn, { backgroundColor: theme.goldAccent || '#C5A059' }]}
              onPress={handleWhatsAppInquire}
            >
              <Ionicons name="logo-whatsapp" size={15} color="#151818" style={{ marginRight: 6 }} />
              <Text style={styles.inquireBtnText}>Inquire</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.inspectBtn, { borderColor: theme.cardBorder, backgroundColor: theme.backgroundSecondary }]}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
            >
              <Text style={[styles.inspectBtnText, { color: theme.primaryText }]}>Explore →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { products, wishlist, toggleWishlist, theme, isDarkMode, fetchProducts, currency } = useContext(ShopContext);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (fetchProducts) await fetchProducts();
    } finally {
      setRefreshing(false);
    }
  };

  const spotlightPaintings = products.filter((p) => p.bestSeller || p.art1 || p.category === 'Paintings');
  const displayPaintings = spotlightPaintings.length > 0 ? spotlightPaintings : products;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      {/* Top Editorial Header */}
      <View style={[styles.topHeader, { borderBottomColor: theme.cardBorder, backgroundColor: theme.background }]}>
        <View style={styles.brandContainer}>
          <Text style={[styles.logoText, { color: theme.primaryText }]}>Art & Art</Text>
          <View style={[styles.verifiedDot, { backgroundColor: theme.goldAccent || '#C5A059' }]} />
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('ExploreTab')}
        >
          <Ionicons name="search-outline" size={22} color={theme.primaryText} />
        </TouchableOpacity>
      </View>

      {/* Main Pinterest-Style Feed */}
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.goldAccent || theme.primaryText}
          />
        }
        ListHeaderComponent={
          <View style={styles.topSectionWrapper}>
            {/* Gallery Spotlight Carousel */}
            <View style={[styles.spotlightSection, { borderBottomColor: theme.cardBorder }]}>
              <View style={styles.sectionHeaderRow}>
                <View>
                  <Text style={[styles.sectionMainTitle, { color: theme.primaryText }]}>Gallery Spotlight</Text>
                  <Text style={[styles.sectionSubtitle, { color: theme.secondaryText }]}>
                    Original paintings & archival canvases
                  </Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('ExploreTab')}>
                  <Text style={[styles.viewAllText, { color: isDarkMode ? theme.accentBone : theme.orangeAccent }]}>
                    Explore All →
                  </Text>
                </TouchableOpacity>
              </View>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={displayPaintings}
                keyExtractor={(item) => `spotlight-${item._id}`}
                contentContainerStyle={styles.spotlightSlider}
                renderItem={({ item }) => {
                  const imageUri = item.images?.[0] || item.image || 'https://via.placeholder.com/600';
                  const isWished = wishlist.includes(item._id);

                  return (
                    <TouchableOpacity
                      style={[
                        styles.spotlightCard,
                        {
                          backgroundColor: theme.cardBg,
                          borderColor: theme.cardBorder,
                        },
                      ]}
                      activeOpacity={0.92}
                      onPress={() => navigation.navigate('ProductDetail', { product: item })}
                    >
                      <View style={styles.spotlightImageWrap}>
                        <Image source={{ uri: imageUri }} style={styles.spotlightImage} resizeMode="cover" />
                        
                        <TouchableOpacity
                          style={[styles.pinHeartBtn, isWished && styles.pinHeartBtnActive]}
                          onPress={() => toggleWishlist(item._id)}
                        >
                          <Ionicons
                            name={isWished ? 'bookmark' : 'bookmark-outline'}
                            size={16}
                            color={isWished ? theme.goldAccent || '#C5A059' : '#FFFFFF'}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.roomPill}
                          onPress={() => navigation.navigate('WallPreview', { product: item, artworkImage: imageUri })}
                        >
                          <Ionicons name="camera-outline" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                          <Text style={styles.roomPillText}>Preview on Wall</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.spotlightCardInfo}>
                        <Text style={[styles.spotlightTitle, { color: theme.primaryText }]} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={[styles.spotlightMeta, { color: theme.mutedText }]}>
                          {item.subCategory || item.category || 'Original Art'} • {item.size || 'Archival Canvas'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            {/* Atelier Visual Showcase Header */}
            <View style={styles.feedHeaderRow}>
              <Text style={[styles.feedSectionTitle, { color: theme.primaryText }]}>Curated Art & Living Spaces</Text>
              <Text style={[styles.feedSectionSubtitle, { color: theme.mutedText }]}>
                Explore original art collections and preview pieces live on your wall
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <ArtworkCard
            item={item}
            navigation={navigation}
            theme={theme}
            isDarkMode={isDarkMode}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            currency={currency}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.2,
    fontFamily: 'serif',
  },
  verifiedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 6,
    marginTop: 2,
  },
  iconButton: {
    padding: 6,
  },
  feedContent: {
    paddingBottom: 40,
  },
  topSectionWrapper: {
    marginBottom: 10,
  },
  spotlightSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  sectionMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'serif',
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  spotlightSlider: {
    paddingHorizontal: 18,
    gap: 14,
  },
  spotlightCard: {
    width: width * 0.72,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  spotlightImageWrap: {
    width: '100%',
    height: 190,
    position: 'relative',
  },
  spotlightImage: {
    width: '100%',
    height: '100%',
  },
  pinHeartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinHeartBtnActive: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  roomPill: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 21, 21, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  roomPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  spotlightCardInfo: {
    padding: 12,
  },
  spotlightTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  spotlightMeta: {
    fontSize: 11,
    marginTop: 3,
  },
  feedHeaderRow: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 8,
  },
  feedSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    fontFamily: 'serif',
    letterSpacing: 0.4,
  },
  feedSectionSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  // --- Artwork Card (Pinterest / Art Exhibition Style) ---
  artworkCard: {
    marginBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  cardTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardTitleBlock: {
    flex: 1,
    marginRight: 10,
  },
  categoryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  categoryPill: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  subCategoryText: {
    fontSize: 11,
  },
  featuredPill: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  cardArtworkTitle: {
    fontSize: 17,
    fontWeight: '800',
    fontFamily: 'serif',
    letterSpacing: 0.3,
  },
  bookmarkBtn: {
    padding: 6,
  },
  bookmarkBtnActive: {
    opacity: 0.9,
  },

  imageViewport: {
    width: width,
    height: width * 1.05,
    backgroundColor: '#121515',
    position: 'relative',
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  pageCountPill: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pageCountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  floatingPreviewBtn: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(21, 24, 24, 0.88)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  floatingPreviewText: {
    color: '#D6D6C7',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sizeOverlayBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sizeOverlayText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },

  cardFooter: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  footerActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 1,
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inquireBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
  },
  inquireBtnText: {
    color: '#151818',
    fontSize: 12,
    fontWeight: '800',
  },
  inspectBtn: {
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
  },
  inspectBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
