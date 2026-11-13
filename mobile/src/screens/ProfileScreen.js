import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ShopContext } from '../context/ShopContext';
import GALLERY_CONFIG from '../constants/galleryConfig';

export default function ProfileScreen({ navigation }) {
  const {
    user,
    token,
    isGuest,
    isDarkMode,
    toggleTheme,
    theme,
    loginUser,
    sendOtp,
    registerUser,
    forgotPassword,
    resetPassword,
    logoutUser,
    orders,
    wishlist,
  } = useContext(ShopContext);

  // Auth Modes: 'login' | 'register' | 'forgot'
  const [authTab, setAuthTab] = useState('login');
  
  // Registration & Reset Steps
  // For Register: 1 = Email OTP request, 2 = Verify OTP & Set Details
  // For Forgot: 1 = Email Reset code request, 2 = Code + New Password
  const [step, setStep] = useState(1);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  // Reset form inputs
  const resetForm = (tab) => {
    setAuthTab(tab);
    setStep(1);
    setVerifyCode('');
    setPassword('');
    setNewPassword('');
  };

  // --- Auth Handlers ---

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    const res = await loginUser(email.trim().toLowerCase(), password);
    setLoading(false);
    if (res.success) {
      Alert.alert('Welcome Back', `Successfully signed in as ${email}`);
    } else {
      Alert.alert('Authentication Failed', res.message || 'Invalid credentials.');
    }
  };

  const handleSendOtp = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    const res = await sendOtp(email.trim().toLowerCase());
    setLoading(false);
    if (res.success) {
      Alert.alert('Verification Code Sent', res.message || `We sent a 6-digit code to ${email}`);
      setStep(2);
    } else {
      Alert.alert('Error', res.message || 'Failed to send OTP code.');
    }
  };

  const handleRegister = async () => {
    if (!name.trim() || !password || !verifyCode.trim()) {
      Alert.alert('Required Fields', 'Please fill in your name, verification code, and password.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Password Length', 'Password must be at least 8 characters long.');
      return;
    }
    setLoading(true);
    const res = await registerUser(name.trim(), email.trim().toLowerCase(), password, verifyCode.trim());
    setLoading(false);
    if (res.success) {
      Alert.alert('Account Verified! 🎨', 'Your collector account is active and you are now signed in.');
      setStep(1);
    } else {
      Alert.alert('Registration Error', res.message || 'Invalid code or details.');
    }
  };

  const handleSendResetCode = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter your account email.');
      return;
    }
    setLoading(true);
    const res = await forgotPassword(email.trim().toLowerCase());
    setLoading(false);
    if (res.success) {
      Alert.alert('Reset Code Sent', res.message || `Password reset instructions sent to ${email}`);
      setStep(2);
    } else {
      Alert.alert('Error', res.message || 'Failed to send reset code.');
    }
  };

  const handleResetPassword = async () => {
    if (!verifyCode.trim() || !newPassword) {
      Alert.alert('Required Fields', 'Please enter the reset code and your new password.');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Password Length', 'New password must be at least 8 characters long.');
      return;
    }
    setLoading(true);
    const res = await resetPassword(email.trim().toLowerCase(), verifyCode.trim(), newPassword);
    setLoading(false);
    if (res.success) {
      Alert.alert('Password Reset Successful', 'Your password has been updated. Please sign in.', [
        { text: 'Sign In', onPress: () => resetForm('login') },
      ]);
    } else {
      Alert.alert('Reset Failed', res.message || 'Invalid or expired code.');
    }
  };

  const confirmSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out from your Art & Art collector profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: logoutUser,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
          <Text style={[styles.title, { color: theme.primaryText }]}>Collector Profile</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            {user ? 'Curated collection, personal art boards & curator advisory' : 'Curate your personal gallery & discover fine art'}
          </Text>
        </View>

        <View style={styles.content}>
          {/* Theme Switcher Card (Light & Dark Mode) */}
          <TouchableOpacity
            style={[
              styles.themeCard,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              },
            ]}
            activeOpacity={0.85}
            onPress={toggleTheme}
          >
            <View style={styles.themeLeft}>
              <View
                style={[
                  styles.themeIconBox,
                  { backgroundColor: isDarkMode ? 'rgba(214, 214, 199, 0.15)' : 'rgba(45, 49, 48, 0.08)' },
                ]}
              >
                <Ionicons
                  name={isDarkMode ? 'moon' : 'sunny'}
                  size={20}
                  color={isDarkMode ? theme.goldAccent : '#D97706'}
                />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.themeTitle, { color: theme.primaryText }]}>
                  {isDarkMode ? 'Dark Gallery Ambiance' : 'Light Museum Ambiance'}
                </Text>
                <Text style={[styles.themeSubtitle, { color: theme.mutedText }]}>
                  {isDarkMode ? 'Luxury charcoal velvet & muted ivory' : 'Curated warm stone & architectural parchment'}
                </Text>
              </View>
            </View>

            <Switch
              value={!isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#3A4242', true: theme.goldAccent }}
              thumbColor={isDarkMode ? '#D6D6C7' : '#FFFFFF'}
            />
          </TouchableOpacity>

          {/* User Logged In Profile View */}
          {user ? (
            <View>
              {/* Profile Card */}
              <View style={[styles.profileCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <View style={[styles.avatarCircle, { backgroundColor: theme.accentBone }]}>
                  <Text style={[styles.avatarText, { color: isDarkMode ? '#1F2424' : '#FFFFFF' }]}>
                    {user.name?.charAt(0)?.toUpperCase() || 'C'}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={[styles.userName, { color: theme.primaryText }]}>{user.name || 'Art Collector'}</Text>
                  <Text style={[styles.userEmail, { color: theme.secondaryText }]}>{user.email}</Text>
                  <View style={styles.tierBadge}>
                    <Ionicons name="sparkles" size={12} color={theme.goldAccent} style={{ marginRight: 4 }} />
                    <Text style={[styles.tierText, { color: theme.goldAccent }]}>Patron of the Arts</Text>
                  </View>
                </View>
              </View>

              {/* Navigation Shortcuts */}
              <Text style={[styles.sectionHeader, { color: theme.mutedText }]}>My Curation</Text>
              <View style={[styles.menuCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <TouchableOpacity
                  style={[styles.menuItem, { borderBottomColor: theme.cardBorder }]}
                  onPress={() => navigation.navigate('WishlistTab')}
                >
                  <View style={[styles.menuIconBox, { backgroundColor: theme.badgeBg }]}>
                    <Ionicons name="heart-outline" size={18} color={theme.accentBone} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.menuTitle, { color: theme.primaryText }]}>Saved Art Collection</Text>
                    <Text style={[styles.menuSub, { color: theme.mutedText }]}>
                      {wishlist.length} {wishlist.length === 1 ? 'artwork' : 'artworks'} pinned to board
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.mutedText} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.menuItem, { borderBottomColor: theme.cardBorder }]}
                  onPress={() => navigation.navigate('ExploreTab')}
                >
                  <View style={[styles.menuIconBox, { backgroundColor: theme.badgeBg }]}>
                    <Ionicons name="compass-outline" size={18} color={theme.accentBone} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.menuTitle, { color: theme.primaryText }]}>Explore Exhibitions</Text>
                    <Text style={[styles.menuSub, { color: theme.mutedText }]}>Filter by painters, sculptors & designers</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.mutedText} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.menuItem, { borderBottomWidth: 0 }]}
                  onPress={() => navigation.navigate('BlogTab')}
                >
                  <View style={[styles.menuIconBox, { backgroundColor: theme.badgeBg }]}>
                    <Ionicons name="newspaper-outline" size={18} color={theme.accentBone} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.menuTitle, { color: theme.primaryText }]}>Art Gazette & Perspectives</Text>
                    <Text style={[styles.menuSub, { color: theme.mutedText }]}>Stories & curator perspectives</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.mutedText} />
                </TouchableOpacity>
              </View>

              {/* Collector Concierge */}
              <Text style={[styles.sectionHeader, { color: theme.mutedText }]}>Gallery Services</Text>
              <View style={[styles.menuCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <View style={[styles.menuItem, { borderBottomColor: theme.cardBorder }]}>
                  <View style={[styles.menuIconBox, { backgroundColor: theme.badgeBg }]}>
                    <Ionicons name="shield-checkmark-outline" size={18} color={theme.accentBone} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.menuTitle, { color: theme.primaryText }]}>Certificate of Provenance</Text>
                    <Text style={[styles.menuSub, { color: theme.mutedText }]}>Originality guaranteed for all studio works</Text>
                  </View>
                  <Ionicons name="checkmark-circle" size={16} color={theme.greenAccent || '#2A9D8F'} />
                </View>

                <TouchableOpacity
                  style={[styles.menuItem, { borderBottomWidth: 0 }]}
                  onPress={() => {
                    const url = `https://wa.me/${GALLERY_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Art & Art! I would like to request a bespoke curation advisory session.')}`;
                    Linking.openURL(url);
                  }}
                >
                  <View style={[styles.menuIconBox, { backgroundColor: theme.badgeBg }]}>
                    <Ionicons name="chatbubbles-outline" size={18} color={theme.accentBone} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.menuTitle, { color: theme.primaryText }]}>Bespoke Curator Concierge</Text>
                    <Text style={[styles.menuSub, { color: theme.mutedText }]}>Custom dimensions, lighting & framing advice</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.mutedText} />
                </TouchableOpacity>
              </View>

              {/* Sign Out */}
              <TouchableOpacity
                style={[styles.logoutBtn, { borderColor: 'rgba(230, 57, 70, 0.3)' }]}
                onPress={confirmSignOut}
              >
                <Ionicons name="log-out-outline" size={18} color="#E63946" style={{ marginRight: 8 }} />
                <Text style={styles.logoutText}>Sign Out from Collector Account</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Guest / Authentication Mode */
            <View style={styles.authBox}>
              {/* Welcoming Collector Circle Banner */}
              <View style={[styles.guestNotice, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <View style={styles.guestNoticeIcon}>
                  <Ionicons name="sparkles-outline" size={20} color={theme.accentBone} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.guestNoticeTitle, { color: theme.primaryText }]}>Welcome to Art & Art</Text>
                  <Text style={[styles.guestNoticeDesc, { color: theme.secondaryText }]}>
                    Immerse yourself in fine art, preview paintings on your walls, and curate inspiration boards. Join the collector circle to sync your saved pieces across all devices.
                  </Text>
                </View>
              </View>

              {/* Auth Mode Switcher */}
              <View style={[styles.authTabs, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <TouchableOpacity
                  style={[styles.authTab, authTab === 'login' && { backgroundColor: theme.accentBone }]}
                  onPress={() => resetForm('login')}
                >
                  <Text
                    style={[
                      styles.authTabText,
                      { color: authTab === 'login' ? (isDarkMode ? '#1F2424' : '#FFFFFF') : theme.secondaryText },
                    ]}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.authTab, authTab === 'register' && { backgroundColor: theme.accentBone }]}
                  onPress={() => resetForm('register')}
                >
                  <Text
                    style={[
                      styles.authTabText,
                      { color: authTab === 'register' ? (isDarkMode ? '#1F2424' : '#FFFFFF') : theme.secondaryText },
                    ]}
                  >
                    Join Gallery
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.authTab, authTab === 'forgot' && { backgroundColor: theme.accentBone }]}
                  onPress={() => resetForm('forgot')}
                >
                  <Text
                    style={[
                      styles.authTabText,
                      { color: authTab === 'forgot' ? (isDarkMode ? '#1F2424' : '#FFFFFF') : theme.secondaryText },
                    ]}
                  >
                    Reset Key
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Form Container */}
              <View style={[styles.formCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                {authTab === 'login' && (
                  <>
                    <Text style={[styles.formTitle, { color: theme.primaryText }]}>Collector Sign In</Text>
                    <Text style={[styles.formSubtitle, { color: theme.secondaryText }]}>
                      Sign in to view your saved artwork boards, bespoke curations, and private viewings.
                    </Text>

                    <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Email Address</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, color: theme.primaryText }]}
                      placeholder="collector@artnart.com"
                      placeholderTextColor={theme.mutedText}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />

                    <View style={styles.labelRow}>
                      <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Password</Text>
                      <TouchableOpacity onPress={() => resetForm('forgot')}>
                        <Text style={[styles.forgotLink, { color: theme.accentBone }]}>Forgot Password?</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.passwordWrap, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}>
                      <TextInput
                        style={[styles.passwordInput, { color: theme.primaryText }]}
                        placeholder="••••••••"
                        placeholderTextColor={theme.mutedText}
                        secureTextEntry={secureText}
                        value={password}
                        onChangeText={setPassword}
                      />
                      <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                        <Ionicons name={secureText ? 'eye-off-outline' : 'eye-outline'} size={18} color={theme.mutedText} />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={[styles.primaryBtn, { backgroundColor: theme.accentBone }]}
                      onPress={handleLogin}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color={isDarkMode ? '#1F2424' : '#FFFFFF'} />
                      ) : (
                        <Text style={[styles.primaryBtnText, { color: isDarkMode ? '#1F2424' : '#FFFFFF' }]}>
                          Sign In to Collection
                        </Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}

                {authTab === 'register' && step === 1 && (
                  <>
                    <Text style={[styles.formTitle, { color: theme.primaryText }]}>Join the Collector Circle</Text>
                    <Text style={[styles.formSubtitle, { color: theme.secondaryText }]}>
                      Receive access to private atelier releases, save curations, and connect with gallery artists.
                    </Text>

                    <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Email Address</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, color: theme.primaryText }]}
                      placeholder="collector@example.com"
                      placeholderTextColor={theme.mutedText}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />

                    <TouchableOpacity
                      style={[styles.primaryBtn, { backgroundColor: theme.accentBone }]}
                      onPress={handleSendOtp}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color={isDarkMode ? '#1F2424' : '#FFFFFF'} />
                      ) : (
                        <Text style={[styles.primaryBtnText, { color: isDarkMode ? '#1F2424' : '#FFFFFF' }]}>
                          Send Verification Code
                        </Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}

                {authTab === 'register' && step === 2 && (
                  <>
                    <Text style={[styles.formTitle, { color: theme.primaryText }]}>Complete Collector Profile</Text>
                    <Text style={[styles.formSubtitle, { color: theme.secondaryText }]}>
                      Enter the 6-digit verification code sent to {email}
                    </Text>

                    <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>6-Digit Verification Code</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, color: theme.primaryText }]}
                      placeholder="123456"
                      placeholderTextColor={theme.mutedText}
                      keyboardType="numeric"
                      value={verifyCode}
                      onChangeText={setVerifyCode}
                    />

                    <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Your Name</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, color: theme.primaryText }]}
                      placeholder="Jane Vance"
                      placeholderTextColor={theme.mutedText}
                      value={name}
                      onChangeText={setName}
                    />

                    <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Create Password (Min. 8 chars)</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, color: theme.primaryText }]}
                      placeholder="••••••••"
                      placeholderTextColor={theme.mutedText}
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                    />

                    <TouchableOpacity
                      style={[styles.primaryBtn, { backgroundColor: theme.accentBone }]}
                      onPress={handleRegister}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color={isDarkMode ? '#1F2424' : '#FFFFFF'} />
                      ) : (
                        <Text style={[styles.primaryBtnText, { color: isDarkMode ? '#1F2424' : '#FFFFFF' }]}>
                          Activate Collector Account
                        </Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.backLink} onPress={() => setStep(1)}>
                      <Text style={[styles.backLinkText, { color: theme.mutedText }]}>Change email address</Text>
                    </TouchableOpacity>
                  </>
                )}

                {authTab === 'forgot' && step === 1 && (
                  <>
                    <Text style={[styles.formTitle, { color: theme.primaryText }]}>Account Recovery</Text>
                    <Text style={[styles.formSubtitle, { color: theme.secondaryText }]}>
                      Enter your email address to receive an account recovery code.
                    </Text>

                    <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Collector Email</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, color: theme.primaryText }]}
                      placeholder="collector@example.com"
                      placeholderTextColor={theme.mutedText}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />

                    <TouchableOpacity
                      style={[styles.primaryBtn, { backgroundColor: theme.accentBone }]}
                      onPress={handleSendResetCode}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color={isDarkMode ? '#1F2424' : '#FFFFFF'} />
                      ) : (
                        <Text style={[styles.primaryBtnText, { color: isDarkMode ? '#1F2424' : '#FFFFFF' }]}>
                          Send Recovery Code
                        </Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}

                {authTab === 'forgot' && step === 2 && (
                  <>
                    <Text style={[styles.formTitle, { color: theme.primaryText }]}>Set New Password</Text>
                    <Text style={[styles.formSubtitle, { color: theme.secondaryText }]}>
                      Enter the recovery code sent to {email} and choose a new password.
                    </Text>

                    <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Recovery Code</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, color: theme.primaryText }]}
                      placeholder="123456"
                      placeholderTextColor={theme.mutedText}
                      keyboardType="numeric"
                      value={verifyCode}
                      onChangeText={setVerifyCode}
                    />

                    <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>New Password (Min. 8 chars)</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder, color: theme.primaryText }]}
                      placeholder="••••••••"
                      placeholderTextColor={theme.mutedText}
                      secureTextEntry
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />

                    <TouchableOpacity
                      style={[styles.primaryBtn, { backgroundColor: theme.accentBone }]}
                      onPress={handleResetPassword}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color={isDarkMode ? '#1F2424' : '#FFFFFF'} />
                      ) : (
                        <Text style={[styles.primaryBtnText, { color: isDarkMode ? '#1F2424' : '#FFFFFF' }]}>
                          Save & Update Password
                        </Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          )}

          {/* Tasteful Curator Advisory & Private Viewings (Discreet at bottom) */}
          <View style={[styles.hotlineCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, marginTop: 24 }]}>
            <View style={styles.hotlineHeader}>
              <View style={[styles.hotlineIconBox, { backgroundColor: 'rgba(233, 196, 106, 0.15)' }]}>
                <Ionicons name="chatbubbles-outline" size={20} color={theme.goldAccent} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.hotlineTitle, { color: theme.primaryText }]}>Curator Advisory & Private Viewings</Text>
                <Text style={[styles.hotlineHours, { color: theme.mutedText, marginBottom: 0 }]}>
                  {GALLERY_CONFIG.HOURS} • {GALLERY_CONFIG.LOCATION}
                </Text>
              </View>
            </View>

            <Text style={[styles.hotlineDesc, { color: theme.secondaryText }]}>
              Interested in provenance details, custom dimensions, or arranging a private viewing? Our chief curator is available for personal appointments.
            </Text>

            <View style={styles.hotlineButtons}>
              <TouchableOpacity
                style={[styles.hotlineCallBtn, { backgroundColor: isDarkMode ? theme.accentBone : theme.primaryText }]}
                onPress={() => Linking.openURL(`tel:${GALLERY_CONFIG.PHONE_NUMBER_RAW}`)}
              >
                <Ionicons name="call" size={15} color={isDarkMode ? '#1F2424' : '#FFFFFF'} style={{ marginRight: 6 }} />
                <Text style={[styles.hotlineCallBtnText, { color: isDarkMode ? '#1F2424' : '#FFFFFF' }]}>
                  Call Curator
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.hotlineWhatsAppBtn, { borderColor: '#25D366' }]}
                onPress={() => {
                  const url = `https://wa.me/${GALLERY_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Art & Art Gallery! I would like to inquire about artwork acquisitions and commissions.')}`;
                  Linking.openURL(url);
                }}
              >
                <Ionicons name="logo-whatsapp" size={16} color="#25D366" style={{ marginRight: 6 }} />
                <Text style={styles.hotlineWhatsAppBtnText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  content: {
    padding: 16,
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  themeSubtitle: {
    fontSize: 11,
    marginTop: 2,
    maxWidth: 220,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    marginBottom: 24,
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  tierText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 8,
  },
  menuCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  menuSub: {
    fontSize: 11,
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    padding: 15,
    borderWidth: 1,
    marginTop: 10,
  },
  logoutText: {
    color: '#E63946',
    fontWeight: '700',
    fontSize: 14,
  },
  authBox: {
    marginTop: 4,
  },
  guestNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  guestNoticeIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(214, 214, 199, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestNoticeTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  guestNoticeDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  authTabs: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  authTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 9,
  },
  authTabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  formCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  formSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotLink: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 14,
  },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
  },
  primaryBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  backLink: {
    alignItems: 'center',
    marginTop: 14,
  },
  backLinkText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  hotlineCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  hotlineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  hotlineIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotlineTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  hotlinePhone: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  hotlineDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 6,
  },
  hotlineHours: {
    fontSize: 11,
    marginBottom: 14,
  },
  hotlineButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  hotlineCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
  },
  hotlineCallBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  hotlineWhatsAppBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1.5,
  },
  hotlineWhatsAppBtnText: {
    color: '#25D366',
    fontSize: 13,
    fontWeight: '800',
  },
});
