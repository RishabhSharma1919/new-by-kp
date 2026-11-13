import React, { useContext, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ShopContext } from '../context/ShopContext';

const { width } = Dimensions.get('window');
const SPOTLIGHT_CARD_WIDTH = width * 0.72;

export default function HomeScreen({ navigation }) {
  const { products, wishlist, toggleWishlist, theme, isDarkMode, fetchProducts } = useContext(ShopContext);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (fetchProducts) await fetchProducts();
    } finally {
      setRefreshing(false);
    }
  };

  const [likes, setLikes] = useState({
    demo1: 148,
    demo2: 212,
    demo3: 89,
    demo4: 176,
    demo5: 124,
  });

  const [likedPosts, setLikedPosts] = useState({});
  const lastTapRef = useRef({});

  // Filter curated paintings for spotlight carousel
  const spotlightPaintings = products.filter((p) => p.category === 'Paintings' || p.bestSeller || p.art1);
  const displayPaintings = spotlightPaintings.length > 0 ? spotlightPaintings : products;

  // Share artwork
  const handleShare = async (product) => {
    try {
      await Share.share({
        message: `Discover "${product.name}" by contemporary artists on Art & Art: Curated Fine Art & Living Spaces.`,
      });
    } catch (e) {}
  };

  const handleLike = (id) => {
    const isLiked = !!likedPosts[id];
    setLikedPosts((prev) => ({ ...prev, [id]: !isLiked }));
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 50) + (isLiked ? -1 : 1),
    }));
  };

  // Double tap artwork to like
  const handleDoubleTap = (id) => {
    const now = Date.now();
    const last = lastTapRef.current[id] || 0;
    if (now - last < 300) {
      if (!likedPosts[id]) {
        handleLike(id);
      }
    }
    lastTapRef.current[id] = now;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      {/* Top Editorial Header */}
      <View style={[styles.topHeader, { borderBottomColor: theme.cardBorder, backgroundColor: theme.background }]}>
        <View style={styles.brandContainer}>
          <Text style={[styles.logoText, { color: theme.primaryText }]}>Art & Art</Text>
          <View style={[styles.verifiedDot, { backgroundColor: theme.goldAccent }]} />
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('ExploreTab')}
        >
          <Ionicons name="search-outline" size={22} color={theme.primaryText} />
        </TouchableOpacity>
      </View>

      {/* Main Feed */}
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
            {/* --- SECTION 1: CURATED GALLERY SHOWCASE (PINTEREST / EXHIBITION STYLE) --- */}
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
                  const imageUri = item.images?.[0] || 'https://via.placeholder.com/600';
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
                            color={isWished ? theme.goldAccent : '#FFFFFF'}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.roomPill}
                          onPress={() => navigation.navigate('WallPreview', { product: item, artworkImage: imageUri })}
                        >
                          <Ionicons name="camera-outline" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                          <Text style={styles.roomPillText}>Preview in Room</Text>
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

            {/* --- SECTION 2 HEADER: ATELIER FEED --- */}
            <View style={styles.feedHeaderRow}>
              <Text style={[styles.feedSectionTitle, { color: theme.primaryText }]}>Atelier Collection Feed</Text>
              <Text style={[styles.feedSectionSubtitle, { color: theme.mutedText }]}>
                Browse visual stories & preview how each work enriches living spaces
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const isLiked = !!likedPosts[item._id];
          const isWished = wishlist.includes(item._id);
          const likeCount = likes[item._id] || 42;
          const imageUri = item.images?.[0] || 'https://via.placeholder.com/600';

          return (
            <View style={[styles.postCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              {/* Post Header: Artist Bio */}
              <View style={styles.postHeader}>
                <View style={styles.postAuthorInfo}>
                  <Image
                    source={{
                      uri: item.images?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
                    }}
                    style={styles.postAuthorAvatar}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <View style={styles.authorNameRow}>
                      <Text style={[styles.postAuthorName, { color: theme.primaryText }]}>
                        {item.category === 'Sculpture' ? 'Marcus Thorne' : item.category === 'Photography' ? 'Sophia Chen' : 'Elena Vance'}
                      </Text>
                      <Ionicons name="checkmark-circle" size={13} color="#3897F0" style={{ marginLeft: 4 }} />
                    </View>
                    <Text style={[styles.postLocation, { color: theme.mutedText }]}>
                      {item.subCategory || item.category || 'Painting'} • Contemporary Atelier
                    </Text>
                  </View>
                </View>

                <TouchableOpacity onPress={() => handleShare(item)} style={styles.postShareBtn}>
                  <Ionicons name="share-outline" size={19} color={theme.mutedText} />
                </TouchableOpacity>
              </View>

              {/* Artwork Media (Tap to inspect details, double-tap to like) */}
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => handleDoubleTap(item._id)}
                style={styles.imageWrapper}
              >
                <Image source={{ uri: imageUri }} style={styles.artworkImage} resizeMode="cover" />
                
                {/* Dimensions badge overlay */}
                {item.size && (
                  <View style={[styles.sizeBadge, { backgroundColor: 'rgba(0,0,0,0.65)' }]}>
                    <Text style={styles.sizeBadgeText}>{item.size}</Text>
                  </View>
                )}

                {/* Aesthetic "Preview in Room" button */}
                <TouchableOpacity
                  style={[styles.floatingRoomBtn, { backgroundColor: 'rgba(21, 24, 24, 0.85)' }]}
                  onPress={() => navigation.navigate('WallPreview', { product: item, artworkImage: imageUri })}
                >
                  <Ionicons name="cube-outline" size={14} color="#D6D6C7" style={{ marginRight: 6 }} />
                  <Text style={styles.floatingRoomBtnText}>Preview in Room</Text>
                </TouchableOpacity>
              </TouchableOpacity>

              {/* Action Bar (Like, Save/Pin, Wall Preview, Share) */}
              <View style={styles.actionRow}>
                <View style={styles.actionLeft}>
                  {/* Like Button */}
                  <TouchableOpacity onPress={() => handleLike(item._id)} style={styles.actionIconBtn}>
                    <Ionicons
                      name={isLiked ? 'heart' : 'heart-outline'}
                      size={24}
                      color={isLiked ? '#ED4956' : theme.primaryText}
                    />
                  </TouchableOpacity>

                  {/* Room Visualizer */}
                  <TouchableOpacity
                    style={styles.actionIconBtn}
                    onPress={() => navigation.navigate('WallPreview', { product: item, artworkImage: imageUri })}
                  >
                    <Ionicons name="camera-outline" size={23} color={theme.primaryText} />
                  </TouchableOpacity>

                  {/* Share */}
                  <TouchableOpacity
                    style={styles.actionIconBtn}
                    onPress={() => handleShare(item)}
                  >
                    <Ionicons name="paper-plane-outline" size={22} color={theme.primaryText} />
                  </TouchableOpacity>
                </View>

                {/* Bookmark / Save to Collection */}
                <TouchableOpacity onPress={() => toggleWishlist(item._id)}>
                  <Ionicons
                    name={isWished ? 'bookmark' : 'bookmark-outline'}
                    size={23}
                    color={isWished ? theme.goldAccent : theme.primaryText}
                  />
                </TouchableOpacity>
              </View>

              {/* Likes count */}
              <View style={styles.likesRow}>
                <Text style={[styles.likesText, { color: theme.primaryText }]}>
                  {likeCount} saves & appreciations
                </Text>
              </View>

              {/* Caption & Curator Description */}
              <View style={styles.captionBlock}>
                <Text style={[styles.captionText, { color: theme.primaryText }]}>
                  <Text style={styles.boldTitle}>{item.name}</Text>
                  {' — '}
                  {item.description}
                </Text>
                <Text style={[styles.tagsText, { color: theme.secondaryText }]}>
                  #{item.category?.toLowerCase() || 'art'} #fineart #originalcanvas #interiors
                </Text>
              </View>

              {/* Discreet Link to Inspect Details & Acquisition */}
              <TouchableOpacity
                style={styles.inspectLink}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
              >
                <Text style={[styles.inspectLinkText, { color: isDarkMode ? theme.accentBone : theme.orangeAccent }]}>
                  Inspect details, dimensions & inquiry →
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
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
  },
  iconButton: {
    padding: 4,
  },
  feedContent: {
    paddingBottom: 80,
  },
  topSectionWrapper: {
    marginBottom: 4,
  },
  spotlightSection: {
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionMainTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  spotlightSlider: {
    paddingHorizontal: 16,
    gap: 14,
  },
  spotlightCard: {
    width: SPOTLIGHT_CARD_WIDTH,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  spotlightImageWrap: {
    width: '100%',
    height: 200,
    backgroundColor: '#151818',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinHeartBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  roomPill: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  roomPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  spotlightCardInfo: {
    padding: 12,
  },
  spotlightTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  spotlightMeta: {
    fontSize: 11,
    marginTop: 3,
  },
  feedHeaderRow: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
  },
  feedSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  feedSectionSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  postCard: {
    borderBottomWidth: 1,
    marginBottom: 16,
    paddingBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  postAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAuthorAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2A2E2E',
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAuthorName: {
    fontSize: 13,
    fontWeight: '800',
  },
  postLocation: {
    fontSize: 11,
    marginTop: 1,
  },
  postShareBtn: {
    padding: 4,
  },
  imageWrapper: {
    width: width,
    height: width, // 1:1 Pinterest/Instagram visual square
    position: 'relative',
    backgroundColor: '#121515',
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  sizeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sizeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  floatingRoomBtn: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  floatingRoomBtnText: {
    color: '#D6D6C7',
    fontSize: 11,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  actionIconBtn: {
    padding: 2,
  },
  likesRow: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  likesText: {
    fontSize: 12,
    fontWeight: '700',
  },
  captionBlock: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  captionText: {
    fontSize: 13,
    lineHeight: 18,
  },
  boldTitle: {
    fontWeight: '800',
  },
  tagsText: {
    fontSize: 11,
    marginTop: 4,
  },
  inspectLink: {
    paddingHorizontal: 16,
    paddingTop: 2,
  },
  inspectLinkText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
