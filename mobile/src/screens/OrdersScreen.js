import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ShopContext } from '../context/ShopContext';

const STATUS_STEPS = [
  { key: 'Order Placed', label: 'Order Registered', desc: 'Acquisition registered in gallery registry' },
  { key: 'Curation', label: 'Curator Inspection', desc: 'Artwork inspected & archival certificate issued' },
  { key: 'Framing', label: 'Archival Framing', desc: 'UV-protective museum glass & custom mount' },
  { key: 'Dispatched', label: 'White-Glove Transit', desc: 'Dispatched via insured climate-controlled courier' },
  { key: 'Delivered', label: 'Delivered & Installed', desc: 'Safely arrived at destination gallery/residence' },
];

export default function OrdersScreen({ navigation }) {
  const { orders, currency, theme, isDarkMode, user, isGuest, fetchUserOrders } = useContext(ShopContext);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserOrders();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return theme.greenAccent || '#2A9D8F';
      case 'Dispatched':
      case 'Shipped':
        return theme.goldAccent || '#E9C46A';
      case 'Framing':
      case 'Curation':
        return '#3A86FF';
      case 'Order Placed':
      default:
        return theme.orangeAccent || '#E76F51';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.backgroundSecondary, borderBottomColor: theme.cardBorder }]}>
        <Text style={[styles.title, { color: theme.primaryText }]}>My Acquisitions</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          {user ? `Active orders & tracked shipments for ${user.name || user.email}` : 'Track authentic art shipments and bespoke commissions'}
        </Text>
      </View>

      {/* Guest Notification Banner */}
      {isGuest && (
        <View style={[styles.guestBanner, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <Ionicons name="finger-print-outline" size={20} color={theme.accentBone} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.guestBannerTitle, { color: theme.primaryText }]}>Guest Order Tracking</Text>
            <Text style={[styles.guestBannerDesc, { color: theme.secondaryText }]}>
              Orders placed on this device are saved locally. Sign in to sync across devices.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.signInPill, { backgroundColor: theme.accentBone }]}
            onPress={() => navigation.navigate('ProfileTab')}
          >
            <Text style={[styles.signInPillText, { color: isDarkMode ? '#1F2424' : '#FFFFFF' }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Orders List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id || String(Math.random())}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accentBone} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={54} color={theme.mutedText} />
            <Text style={[styles.emptyTitle, { color: theme.primaryText }]}>No Acquisitions Yet</Text>
            <Text style={[styles.emptyDesc, { color: theme.secondaryText }]}>
              {isGuest
                ? 'Sign in to access your past gallery orders or browse the collection to make your first acquisition.'
                : 'When you acquire original artworks or sculptures, you can track their white-glove delivery right here.'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={[styles.browseBtn, { backgroundColor: theme.accentBone }]}
                onPress={() => navigation.navigate('ExploreTab')}
              >
                <Text style={[styles.browseBtnText, { color: isDarkMode ? '#1F2424' : '#FFFFFF' }]}>
                  Browse Gallery
                </Text>
              </TouchableOpacity>
              {isGuest && (
                <TouchableOpacity
                  style={[styles.browseBtn, { backgroundColor: theme.cardBg, borderWidth: 1, borderColor: theme.cardBorder }]}
                  onPress={() => navigation.navigate('ProfileTab')}
                >
                  <Text style={[styles.browseBtnText, { color: theme.primaryText }]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.orderCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
            activeOpacity={0.88}
            onPress={() => setSelectedOrder(item)}
          >
            <View style={[styles.orderCardHeader, { borderBottomColor: theme.cardBorder }]}>
              <View>
                <Text style={[styles.orderId, { color: theme.primaryText }]}>Acquisition #{item._id}</Text>
                <Text style={[styles.orderDate, { color: theme.mutedText }]}>
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: `${getStatusColor(item.status)}18`,
                    borderColor: getStatusColor(item.status),
                  },
                ]}
              >
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {item.status || 'Order Placed'}
                </Text>
              </View>
            </View>

            {/* Artwork Items */}
            {item.items &&
              item.items.map((prod, idx) => (
                <View key={idx} style={styles.itemRow}>
                  {prod.image ? (
                    <Image source={{ uri: prod.image }} style={styles.itemImage} />
                  ) : (
                    <View style={[styles.itemImage, { backgroundColor: theme.badgeBg }]} />
                  )}
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.itemName, { color: theme.primaryText }]} numberOfLines={1}>
                      {prod.name}
                    </Text>
                    {prod.size && (
                      <Text style={[styles.itemDetail, { color: theme.mutedText }]}>Dimensions: {prod.size}</Text>
                    )}
                    <Text style={[styles.itemDetail, { color: theme.secondaryText }]}>
                      Qty: {prod.quantity || 1} • {currency}{prod.price}
                    </Text>
                  </View>
                </View>
              ))}

            {/* Footer Summary */}
            <View style={[styles.orderCardFooter, { borderTopColor: theme.cardBorder }]}>
              <View>
                <Text style={[styles.footerLabel, { color: theme.mutedText }]}>Payment: {item.paymentMethod || 'COD'}</Text>
                <Text style={[styles.footerAmount, { color: theme.primaryText }]}>
                  Total: {currency}{item.amount}
                </Text>
              </View>

              <View style={styles.viewTimelineBtn}>
                <Text style={[styles.viewTimelineText, { color: theme.accentBone }]}>Track Timeline</Text>
                <Ionicons name="chevron-forward" size={14} color={theme.accentBone} />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Order Tracking Modal */}
      {selectedOrder && (
        <Modal
          animationType="slide"
          visible={!!selectedOrder}
          onRequestClose={() => setSelectedOrder(null)}
        >
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.cardBorder }]}>
              <TouchableOpacity onPress={() => setSelectedOrder(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={theme.primaryText} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.primaryText }]}>Acquisition Provenance</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Order ID Card */}
              <View style={[styles.modalOrderCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <Text style={[styles.modalOrderTitle, { color: theme.primaryText }]}>Order #{selectedOrder._id}</Text>
                <Text style={[styles.modalOrderDate, { color: theme.secondaryText }]}>
                  Placed on {new Date(selectedOrder.date).toLocaleString()}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: `${getStatusColor(selectedOrder.status)}18`,
                      borderColor: getStatusColor(selectedOrder.status),
                      alignSelf: 'flex-start',
                      marginTop: 8,
                    },
                  ]}
                >
                  <Text style={[styles.statusText, { color: getStatusColor(selectedOrder.status) }]}>
                    {selectedOrder.status || 'Order Placed'}
                  </Text>
                </View>
              </View>

              {/* Courier Tracking Steps */}
              <Text style={[styles.timelineHeader, { color: theme.primaryText }]}>Transit & Authenticity Protocol</Text>
              <View style={[styles.timelineCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                {STATUS_STEPS.map((step, idx) => {
                  const isCurrent = (selectedOrder.status || 'Order Placed').toLowerCase().includes(step.key.toLowerCase());
                  return (
                    <View key={step.key} style={styles.timelineItem}>
                      <View style={styles.timelineIconCol}>
                        <View
                          style={[
                            styles.timelineDot,
                            { backgroundColor: idx === 0 || isCurrent ? theme.goldAccent : theme.cardBorder },
                          ]}
                        >
                          <Ionicons
                            name={idx === 0 || isCurrent ? 'checkmark' : 'ellipse'}
                            size={12}
                            color={idx === 0 || isCurrent ? '#000000' : theme.mutedText}
                          />
                        </View>
                        {idx < STATUS_STEPS.length - 1 && (
                          <View style={[styles.timelineLine, { backgroundColor: theme.cardBorder }]} />
                        )}
                      </View>
                      <View style={{ flex: 1, paddingBottom: 18, marginLeft: 10 }}>
                        <Text style={[styles.stepLabel, { color: theme.primaryText }]}>{step.label}</Text>
                        <Text style={[styles.stepDesc, { color: theme.secondaryText }]}>{step.desc}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Delivery Destination */}
              {selectedOrder.address && (
                <>
                  <Text style={[styles.timelineHeader, { color: theme.primaryText }]}>Destination Address</Text>
                  <View style={[styles.addressCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                    <Text style={[styles.addressName, { color: theme.primaryText }]}>
                      {selectedOrder.address.firstName} {selectedOrder.address.lastName}
                    </Text>
                    <Text style={[styles.addressLine, { color: theme.secondaryText }]}>
                      {selectedOrder.address.street}
                    </Text>
                    <Text style={[styles.addressLine, { color: theme.secondaryText }]}>
                      {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.zipcode}
                    </Text>
                    <Text style={[styles.addressLine, { color: theme.mutedText, marginTop: 4 }]}>
                      Contact: {selectedOrder.address.phone}
                    </Text>
                  </View>
                </>
              )}

              {/* Guarantee Box */}
              <View style={[styles.guaranteeBox, { backgroundColor: theme.badgeBg, borderColor: theme.cardBorder }]}>
                <Ionicons name="ribbon-outline" size={24} color={theme.goldAccent} style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.guaranteeTitle, { color: theme.primaryText }]}>Gallery Provenance Included</Text>
                  <Text style={[styles.guaranteeSubtitle, { color: theme.secondaryText }]}>
                    Accompanied by a physical wax-sealed Certificate of Authenticity signed by the artist.
                  </Text>
                </View>
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        </Modal>
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  guestBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  guestBannerDesc: {
    fontSize: 11,
    marginTop: 1,
    lineHeight: 15,
  },
  signInPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    marginLeft: 8,
  },
  signInPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  list: {
    padding: 16,
    paddingBottom: 120,
  },
  orderCard: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '800',
  },
  orderDate: {
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
  },
  itemDetail: {
    fontSize: 11,
    marginTop: 2,
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
  },
  footerLabel: {
    fontSize: 11,
  },
  footerAmount: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 1,
  },
  viewTimelineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewTimelineText: {
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 20,
  },
  browseBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  browseBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalContent: {
    padding: 16,
  },
  modalOrderCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  modalOrderTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalOrderDate: {
    fontSize: 12,
    marginTop: 4,
  },
  timelineHeader: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  timelineCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineIconCol: {
    alignItems: 'center',
    width: 20,
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  stepDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  addressCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  addressName: {
    fontSize: 14,
    fontWeight: '700',
  },
  addressLine: {
    fontSize: 12,
    marginTop: 2,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  guaranteeTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  guaranteeSubtitle: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
});
