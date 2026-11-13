import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShopContext } from '../context/ShopContext';
import storage from '../utils/storage';

export default function CheckoutScreen({ navigation }) {
  const { cartItems, getCartTotal, delivery_fee, currency, placeOrder, theme, isDarkMode, user, isGuest } =
    useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD', 'Card', 'UPI'
  const [submitting, setSubmitting] = useState(false);

  // Auto-populate saved user and shipping details
  useEffect(() => {
    const prefill = async () => {
      const saved = await storage.getShippingAddress();
      if (saved) {
        setFormData((prev) => ({ ...prev, ...saved }));
      }
      if (user) {
        const parts = (user.name || '').split(' ');
        setFormData((prev) => ({
          ...prev,
          firstName: prev.firstName || parts[0] || '',
          lastName: prev.lastName || parts.slice(1).join(' ') || '',
          email: prev.email || user.email || '',
        }));
      }
    };
    prefill();
  }, [user]);

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePlaceOrder = async () => {
    // Validation
    if (!formData.firstName.trim() || !formData.street.trim() || !formData.city.trim() || !formData.zipcode.trim() || !formData.phone.trim()) {
      Alert.alert('Incomplete Address', 'Please complete all required fields (Name, Phone, Street, City, and PIN code).');
      return;
    }

    if (formData.phone.trim().length < 8) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number for courier delivery coordination.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Invalid Email', 'Please provide a valid email to receive your invoice and certificate.');
      return;
    }

    setSubmitting(true);
    const result = await placeOrder(formData, paymentMethod);
    setSubmitting(false);

    if (result.success) {
      Alert.alert(
        'Order Confirmed! 🎨',
        `Your acquisition #${result.order._id} has been registered.\n\nWhite-glove courier dispatch instructions will be sent to ${formData.email}.`,
        [
          {
            text: 'Track Order',
            onPress: () => {
              navigation.navigate('MainTabs', { screen: 'OrdersTab' });
            },
          },
        ]
      );
    } else {
      Alert.alert('Order Failed', result.message || 'Unable to place order at this time. Please retry.');
    }
  };

  const subtotal = getCartTotal();
  const total = subtotal + delivery_fee;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Guest Banner if guest */}
        {isGuest && (
          <View style={[styles.guestWarning, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <Ionicons name="information-circle-outline" size={20} color={theme.accentBone} style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.guestWarningTitle, { color: theme.primaryText }]}>Guest Acquisition</Text>
              <Text style={[styles.guestWarningText, { color: theme.secondaryText }]}>
                You are checking out as a guest. You can sign in anytime from Profile to link past orders.
              </Text>
            </View>
          </View>
        )}

        {/* Order Summary Pill */}
        <View style={[styles.orderSummaryCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <Text style={[styles.summaryTitle, { color: theme.primaryText }]}>Artwork Acquisition Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.secondaryText }]}>Artworks Selected:</Text>
            <Text style={[styles.summaryValue, { color: theme.primaryText }]}>{cartItems.length} original pieces</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.secondaryText }]}>Curator Insured Shipping:</Text>
            <Text style={[styles.summaryValue, { color: theme.primaryText }]}>{currency}{delivery_fee}</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: theme.cardBorder }]}>
            <Text style={[styles.summaryLabel, { color: theme.primaryText, fontWeight: '700' }]}>Total Payable:</Text>
            <Text style={[styles.summaryValue, { color: isDarkMode ? theme.accentBone : theme.primaryText, fontWeight: '800', fontSize: 16 }]}>
              {currency}{total}
            </Text>
          </View>
        </View>

        {/* Shipping Form */}
        <Text style={[styles.sectionTitle, { color: theme.primaryText }]}>1. Courier Delivery Address</Text>
        <View style={[styles.formCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>First Name *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, borderColor: theme.cardBorder, color: theme.primaryText }]}
                placeholder="Rishabh"
                placeholderTextColor={theme.mutedText}
                value={formData.firstName}
                onChangeText={(t) => updateField('firstName', t)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Last Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, borderColor: theme.cardBorder, color: theme.primaryText }]}
                placeholder="Sharma"
                placeholderTextColor={theme.mutedText}
                value={formData.lastName}
                onChangeText={(t) => updateField('lastName', t)}
              />
            </View>
          </View>

          <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Email Address (for Certificate & Receipt) *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.cardBorder, color: theme.primaryText }]}
            placeholder="collector@artnart.com"
            placeholderTextColor={theme.mutedText}
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(t) => updateField('email', t)}
          />

          <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Mobile Number *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.cardBorder, color: theme.primaryText }]}
            placeholder="+91 98765 43210"
            placeholderTextColor={theme.mutedText}
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(t) => updateField('phone', t)}
          />

          <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Street Address & Suite/Apt *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.cardBorder, color: theme.primaryText }]}
            placeholder="42 Gallery Avenue, Apt 4B"
            placeholderTextColor={theme.mutedText}
            value={formData.street}
            onChangeText={(t) => updateField('street', t)}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>City *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, borderColor: theme.cardBorder, color: theme.primaryText }]}
                placeholder="Mumbai"
                placeholderTextColor={theme.mutedText}
                value={formData.city}
                onChangeText={(t) => updateField('city', t)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>State / Region</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, borderColor: theme.cardBorder, color: theme.primaryText }]}
                placeholder="Maharashtra"
                placeholderTextColor={theme.mutedText}
                value={formData.state}
                onChangeText={(t) => updateField('state', t)}
              />
            </View>
          </View>

          <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>PIN / Postal Code *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.cardBorder, color: theme.primaryText }]}
            placeholder="400001"
            placeholderTextColor={theme.mutedText}
            keyboardType="numeric"
            value={formData.zipcode}
            onChangeText={(t) => updateField('zipcode', t)}
          />
        </View>

        {/* Payment Method Selector */}
        <Text style={[styles.sectionTitle, { color: theme.primaryText }]}>2. Payment Method</Text>
        <View style={styles.paymentMethods}>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
              paymentMethod === 'COD' && { borderColor: theme.accentBone, backgroundColor: theme.badgeBg },
            ]}
            onPress={() => setPaymentMethod('COD')}
          >
            <Ionicons
              name={paymentMethod === 'COD' ? 'radio-button-on' : 'radio-button-off'}
              size={18}
              color={paymentMethod === 'COD' ? theme.accentBone : theme.mutedText}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.paymentTitle, { color: theme.primaryText }]}>Cash / Card on Delivery (COD)</Text>
              <Text style={[styles.paymentSub, { color: theme.mutedText }]}>Inspect artwork prior to settlement</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
              paymentMethod === 'Card' && { borderColor: theme.accentBone, backgroundColor: theme.badgeBg },
            ]}
            onPress={() => setPaymentMethod('Card')}
          >
            <Ionicons
              name={paymentMethod === 'Card' ? 'radio-button-on' : 'radio-button-off'}
              size={18}
              color={paymentMethod === 'Card' ? theme.accentBone : theme.mutedText}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.paymentTitle, { color: theme.primaryText }]}>Credit / Debit Card (Stripe)</Text>
              <Text style={[styles.paymentSub, { color: theme.mutedText }]}>Visa, MasterCard, Amex, Apple Pay</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
              paymentMethod === 'UPI' && { borderColor: theme.accentBone, backgroundColor: theme.badgeBg },
            ]}
            onPress={() => setPaymentMethod('UPI')}
          >
            <Ionicons
              name={paymentMethod === 'UPI' ? 'radio-button-on' : 'radio-button-off'}
              size={18}
              color={paymentMethod === 'UPI' ? theme.accentBone : theme.mutedText}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.paymentTitle, { color: theme.primaryText }]}>UPI / Net Banking / Razorpay</Text>
              <Text style={[styles.paymentSub, { color: theme.mutedText }]}>Instant UPI QR, Google Pay & PhonePe</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Security & Guarantee Note */}
        <View style={styles.guaranteeRow}>
          <Ionicons name="shield-checkmark" size={16} color={theme.goldAccent} style={{ marginRight: 6 }} />
          <Text style={[styles.guaranteeText, { color: theme.mutedText }]}>
            Includes 100% Insured Transit & Certificate of Authenticity
          </Text>
        </View>

        {/* Final Place Order Button */}
        <TouchableOpacity
          style={[styles.placeOrderBtn, { backgroundColor: theme.accentBone }]}
          onPress={handlePlaceOrder}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={isDarkMode ? '#1F2424' : '#FFFFFF'} />
          ) : (
            <>
              <Text style={[styles.placeOrderBtnText, { color: isDarkMode ? '#1F2424' : '#FFFFFF' }]}>
                Complete Order • {currency}{total}
              </Text>
              <Ionicons name="lock-closed" size={16} color={isDarkMode ? '#1F2424' : '#FFFFFF'} style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  guestWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  guestWarningTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  guestWarningText: {
    fontSize: 11,
    marginTop: 1,
    lineHeight: 15,
  },
  orderSummaryCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  summaryLabel: {
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  formCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderRadius: 9,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 12,
  },
  paymentMethods: {
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  paymentTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  paymentSub: {
    fontSize: 11,
    marginTop: 2,
  },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  guaranteeText: {
    fontSize: 11,
  },
  placeOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 16,
  },
  placeOrderBtnText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
