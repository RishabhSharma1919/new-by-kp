import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import GALLERY_CONFIG from '../constants/galleryConfig';

const { width, height } = Dimensions.get('window');

const PRESET_WALLS = [
  { id: 'living', label: 'Living Room', source: require('../../assets/rooms/room1.png') },
  { id: 'gallery', label: 'Art Gallery', source: require('../../assets/rooms/room2.png') },
  { id: 'studio', label: 'Atelier Studio', source: require('../../assets/rooms/room3.png') },
  { id: 'salon', label: 'Grand Salon', source: require('../../assets/rooms/room4.png') },
];

export default function WallPreviewScreen({ route, navigation }) {
  const { product, artworkImage } = route.params;

  // Background modes: 'preset' (default) | 'camera' (live AR stream) | 'custom' (captured/uploaded wall)
  const [backgroundMode, setBackgroundMode] = useState('preset');
  const [customWallUri, setCustomWallUri] = useState(null);
  const [activePreset, setActivePreset] = useState(PRESET_WALLS[0]);

  // Camera permissions & live stream state
  const [permission, requestPermission] = useCameraPermissions();
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef(null);

  // Artwork Position & Sizing
  const [pan, setPan] = useState({ x: width / 2 - 110, y: height / 2 - 200 });
  const [scaleMultiplier, setScaleMultiplier] = useState(1.0);
  const [frameStyle, setFrameStyle] = useState('gold'); // 'gold' | 'black' | 'wood' | 'none'

  // Gesture Tracker for Natural Dragging
  const panRef = useRef({ x: width / 2 - 110, y: height / 2 - 200 });
  const startPanRef = useRef({ x: width / 2 - 110, y: height / 2 - 200 });

  // Check camera permission on mount
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.getCameraPermissionsAsync();
        if (status === 'granted') {
          setHasCameraPermission(true);
        }
      } catch (e) {}
    })();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startPanRef.current = { ...panRef.current };
      },
      onPanResponderMove: (evt, gestureState) => {
        const newX = Math.max(10, Math.min(width - 160, startPanRef.current.x + gestureState.dx));
        const newY = Math.max(80, Math.min(height - 240, startPanRef.current.y + gestureState.dy));
        panRef.current = { x: newX, y: newY };
        setPan({ x: newX, y: newY });
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  // 1. Activate Live AR Video Stream
  const handleEnableCamera = async () => {
    try {
      let isGranted = hasCameraPermission;
      if (!isGranted) {
        const res = await Camera.requestCameraPermissionsAsync();
        if (res && res.granted) {
          isGranted = true;
          setHasCameraPermission(true);
        } else if (requestPermission) {
          const res2 = await requestPermission();
          if (res2 && res2.granted) {
            isGranted = true;
            setHasCameraPermission(true);
          }
        }
      }

      if (isGranted) {
        setHasCameraPermission(true);
        setBackgroundMode('camera');
      } else {
        Alert.alert(
          'Camera Access Required',
          'Camera permission is required to preview artworks on your wall in real time. Would you like to snap a wall photo with the device camera instead?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Snap Wall Photo', onPress: handleSnapWallPhoto },
          ]
        );
      }
    } catch (err) {
      console.warn('Live camera request error:', err);
      // Fallback directly to snap photo
      handleSnapWallPhoto();
    }
  };

  // 2. Take a photo of wall using device camera app (works on phones & emulators)
  const handleSnapWallPhoto = async () => {
    // If live camera is actively streaming, release hardware lock first
    if (backgroundMode === 'camera') {
      setBackgroundMode('preset');
      await new Promise((r) => setTimeout(r, 200));
    }

    try {
      try {
        await ImagePicker.requestCameraPermissionsAsync();
      } catch (e) {}

      const res = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.9,
      });

      if (!res.canceled && res.assets && res.assets[0]?.uri) {
        setCustomWallUri(res.assets[0].uri);
        setBackgroundMode('custom');
      }
    } catch (err) {
      console.warn('Launch camera failed:', err);
      Alert.alert(
        'Camera Notice',
        'Could not open device camera app. You can pick an existing photo from your gallery or choose preset rooms.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Choose from Gallery', onPress: handlePickCustomPhoto },
        ]
      );
    }
  };

  // 3. Pick Custom Wall Photo from phone gallery
  const handlePickCustomPhoto = async () => {
    // If live camera is actively streaming, release camera first
    if (backgroundMode === 'camera') {
      setBackgroundMode('preset');
      await new Promise((r) => setTimeout(r, 150));
    }

    try {
      try {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      } catch (e) {}

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.9,
      });

      if (!res.canceled && res.assets && res.assets[0]?.uri) {
        setCustomWallUri(res.assets[0].uri);
        setBackgroundMode('custom');
      }
    } catch (e) {
      console.warn('Pick photo failed:', e);
      Alert.alert('Gallery Notice', 'Could not open photo gallery.');
    }
  };

  // 4. Capture current Live Camera frame as frozen wall
  const handleCaptureLiveFrame = async () => {
    if (!cameraRef.current || isCapturing) return;
    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        skipProcessing: true,
      });
      if (photo?.uri) {
        setCustomWallUri(photo.uri);
        setBackgroundMode('custom');
      }
    } catch (e) {
      console.warn('Live capture failed:', e);
    } finally {
      setIsCapturing(false);
    }
  };

  // Discreet Inquire Option if collector wants to acquire
  const handleInquire = () => {
    Alert.alert(
      `Acquire "${product.name}"`,
      `Would you like to connect with our curator regarding this original artwork?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Curator',
          onPress: () => Linking.openURL(`tel:${GALLERY_CONFIG.PHONE_NUMBER_RAW}`),
        },
        {
          text: 'WhatsApp Message',
          onPress: () => {
            const text = `Hello! I previewed "${product.name}" in the room visualizer and would like more details.`;
            Linking.openURL(`https://wa.me/${GALLERY_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`);
          },
        },
      ]
    );
  };

  // Artwork dimensions calculation
  const ratio = product.length && product.breadth ? product.breadth / product.length : 1;
  const baseWidth = 220 * scaleMultiplier;
  const baseHeight = Math.max(160, Math.min(300, baseWidth * ratio));

  return (
    <View style={styles.container}>
      {/* --- BACKGROUND WALL LAYER --- */}
      {backgroundMode === 'camera' && (hasCameraPermission || permission?.granted) ? (
        <CameraView
          ref={cameraRef}
          style={[StyleSheet.absoluteFillObject, { width, height }]}
          facing={cameraFacing}
          onMountError={(err) => {
            console.warn('CameraView onMountError:', err);
            Alert.alert(
              'Live Camera Notice',
              'Could not start live video stream on this device. Would you like to snap a wall photo with the camera instead?',
              [
                { text: 'Snap Wall Photo', onPress: handleSnapWallPhoto },
                { text: 'Use Preset Room', onPress: () => setBackgroundMode('preset') },
              ]
            );
            setBackgroundMode('preset');
          }}
        />
      ) : backgroundMode === 'custom' && customWallUri ? (
        <Image
          source={{ uri: customWallUri }}
          style={[StyleSheet.absoluteFillObject, { width, height }]}
          resizeMode="cover"
        />
      ) : (
        <Image
          source={activePreset.source || { uri: activePreset.uri }}
          style={[StyleSheet.absoluteFillObject, { width, height }]}
          resizeMode="cover"
        />
      )}

      {/* --- TOP BAR CONTROLS --- */}
      <SafeAreaView style={styles.topSafeArea} edges={['top']}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconCircle}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Room & Wall Visualizer</Text>
            <Text style={styles.headerSubtitle}>Drag artwork to preview placement</Text>
          </View>

          <TouchableOpacity
            style={styles.iconCircle}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => {
              panRef.current = { x: width / 2 - 110, y: height / 2 - 200 };
              setPan({ x: width / 2 - 110, y: height / 2 - 200 });
            }}
          >
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Visualizer Mode Switcher (4 Options) */}
        <View style={styles.sourceTabs}>
          <TouchableOpacity
            style={[styles.sourceTab, backgroundMode === 'preset' && styles.sourceTabActive]}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
            onPress={() => setBackgroundMode('preset')}
          >
            <Ionicons
              name="home-outline"
              size={13}
              color={backgroundMode === 'preset' ? '#1F2424' : '#FFFFFF'}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.sourceTabText, backgroundMode === 'preset' && styles.sourceTabTextActive]}>
              Rooms
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sourceTab, backgroundMode === 'camera' && styles.sourceTabActive]}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
            onPress={handleEnableCamera}
          >
            <Ionicons
              name="videocam-outline"
              size={13}
              color={backgroundMode === 'camera' ? '#1F2424' : '#FFFFFF'}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.sourceTabText, backgroundMode === 'camera' && styles.sourceTabTextActive]}>
              Live AR
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sourceTab}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
            onPress={handleSnapWallPhoto}
          >
            <Ionicons
              name="camera-outline"
              size={13}
              color="#FFFFFF"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.sourceTabText}>
              Snap Wall
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sourceTab, backgroundMode === 'custom' && styles.sourceTabActive]}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
            onPress={handlePickCustomPhoto}
          >
            <Ionicons
              name="image-outline"
              size={13}
              color={backgroundMode === 'custom' ? '#1F2424' : '#FFFFFF'}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.sourceTabText, backgroundMode === 'custom' && styles.sourceTabTextActive]}>
              Gallery
            </Text>
          </TouchableOpacity>
        </View>

        {/* Live Camera Stream Action Controls (Flip camera & Freeze wall) */}
        {backgroundMode === 'camera' && (
          <View style={styles.liveCameraBar}>
            <TouchableOpacity
              style={styles.liveCameraBtn}
              activeOpacity={0.7}
              onPress={() => setCameraFacing((prev) => (prev === 'back' ? 'front' : 'back'))}
            >
              <Ionicons name="camera-reverse-outline" size={15} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.liveCameraBtnText}>Flip ({cameraFacing})</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.liveCameraBtn, { backgroundColor: '#D6D6C7' }]}
              activeOpacity={0.7}
              onPress={handleCaptureLiveFrame}
              disabled={isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator size="small" color="#1F2424" />
              ) : (
                <>
                  <Ionicons name="camera" size={15} color="#1F2424" style={{ marginRight: 4 }} />
                  <Text style={[styles.liveCameraBtnText, { color: '#1F2424' }]}>Freeze Wall</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>

      {/* --- DRAGGABLE FRAMED ARTWORK --- */}
      <View
        {...panResponder.panHandlers}
        style={[
          styles.artworkWrapper,
          {
            left: pan.x,
            top: pan.y,
            width: baseWidth,
            height: baseHeight,
          },
          frameStyle === 'gold' && styles.goldFrame,
          frameStyle === 'black' && styles.blackFrame,
          frameStyle === 'wood' && styles.woodFrame,
          frameStyle === 'none' && styles.frameless,
        ]}
      >
        <Image source={{ uri: artworkImage }} style={styles.artwork} resizeMode="cover" />
      </View>

      {/* --- BOTTOM FLOATING CONTROLS PANEL --- */}
      <View style={styles.bottomSheet}>
        {/* Room Preset Pills (if in preset mode) */}
        {backgroundMode === 'preset' && (
          <View style={styles.presetRow}>
            {PRESET_WALLS.map((wall) => (
              <TouchableOpacity
                key={wall.id}
                style={[styles.presetPill, activePreset.id === wall.id && styles.presetPillActive]}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                onPress={() => setActivePreset(wall)}
              >
                <Text style={[styles.presetPillText, activePreset.id === wall.id && styles.presetPillTextActive]}>
                  {wall.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Custom Wall Status Banner (if in custom wall mode) */}
        {backgroundMode === 'custom' && (
          <View style={styles.customWallBanner}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="image" size={14} color="#D6D6C7" style={{ marginRight: 6 }} />
              <Text style={styles.customWallBannerText}>Custom Wall Background</Text>
            </View>
            <TouchableOpacity
              style={styles.changeWallBtn}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={handlePickCustomPhoto}
            >
              <Text style={styles.changeWallBtnText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        )}
        )}

        {/* Scale & Framing Controls */}
        <View style={styles.controlsRow}>
          {/* Scale */}
          <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>Scale Size</Text>
            <View style={styles.btnPillGroup}>
              <TouchableOpacity
                style={[styles.smallPill, scaleMultiplier === 0.75 && styles.pillActive]}
                onPress={() => setScaleMultiplier(0.75)}
              >
                <Text style={[styles.pillText, scaleMultiplier === 0.75 && styles.pillTextActive]}>0.75×</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallPill, scaleMultiplier === 1.0 && styles.pillActive]}
                onPress={() => setScaleMultiplier(1.0)}
              >
                <Text style={[styles.pillText, scaleMultiplier === 1.0 && styles.pillTextActive]}>1:1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallPill, scaleMultiplier === 1.35 && styles.pillActive]}
                onPress={() => setScaleMultiplier(1.35)}
              >
                <Text style={[styles.pillText, scaleMultiplier === 1.35 && styles.pillTextActive]}>1.35×</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Framing */}
          <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>Frame Style</Text>
            <View style={styles.btnPillGroup}>
              <TouchableOpacity
                style={[styles.smallPill, frameStyle === 'gold' && styles.pillActive]}
                onPress={() => setFrameStyle('gold')}
              >
                <Text style={[styles.pillText, frameStyle === 'gold' && styles.pillTextActive]}>Gold</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallPill, frameStyle === 'black' && styles.pillActive]}
                onPress={() => setFrameStyle('black')}
              >
                <Text style={[styles.pillText, frameStyle === 'black' && styles.pillTextActive]}>Black</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallPill, frameStyle === 'wood' && styles.pillActive]}
                onPress={() => setFrameStyle('wood')}
              >
                <Text style={[styles.pillText, frameStyle === 'wood' && styles.pillTextActive]}>Oak</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallPill, frameStyle === 'none' && styles.pillActive]}
                onPress={() => setFrameStyle('none')}
              >
                <Text style={[styles.pillText, frameStyle === 'none' && styles.pillTextActive]}>Raw</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Discreet Artwork Info & Inquire Link */}
        <View style={styles.artworkInfoRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.artworkNameText} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={styles.artworkSpecText}>
              {product.size || 'Curated Scale'} • {product.category || 'Painting'}
            </Text>
          </View>

          <TouchableOpacity style={styles.inquirePill} onPress={handleInquire}>
            <Ionicons name="chatbubble-ellipses-outline" size={14} color="#1F2424" style={{ marginRight: 5 }} />
            <Text style={styles.inquirePillText}>Inquire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 100,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerTitleBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#D6D6C7',
    fontSize: 10,
    marginTop: 1,
  },
  sourceTabs: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginTop: 6,
  },
  sourceTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 16,
  },
  sourceTabActive: {
    backgroundColor: '#D6D6C7',
  },
  sourceTabText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  sourceTabTextActive: {
    color: '#1F2424',
  },
  liveCameraBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  liveCameraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  liveCameraBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  artworkWrapper: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.65,
    shadowRadius: 20,
    elevation: 20,
  },
  artwork: {
    width: '100%',
    height: '100%',
  },
  goldFrame: {
    borderWidth: 8,
    borderColor: '#C5A059',
    borderRadius: 2,
  },
  blackFrame: {
    borderWidth: 8,
    borderColor: '#111111',
    borderRadius: 2,
  },
  woodFrame: {
    borderWidth: 8,
    borderColor: '#8B5A2B',
    borderRadius: 2,
  },
  frameless: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(18, 21, 21, 0.94)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    zIndex: 100,
    elevation: 100,
  },
  customWallBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  customWallBannerText: {
    color: '#D6D6C7',
    fontSize: 11,
    fontWeight: '700',
  },
  changeWallBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#D6D6C7',
    borderRadius: 8,
  },
  changeWallBtnText: {
    color: '#1F2424',
    fontSize: 10,
    fontWeight: '800',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  presetPill: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  presetPillActive: {
    borderColor: '#D6D6C7',
    backgroundColor: 'rgba(214, 214, 199, 0.2)',
  },
  presetPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  presetPillTextActive: {
    color: '#D6D6C7',
    fontWeight: '800',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  controlGroup: {
    flex: 1,
    marginRight: 6,
  },
  controlLabel: {
    color: '#A0A8A8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  btnPillGroup: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 8,
    padding: 2,
  },
  smallPill: {
    flex: 1,
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: 6,
  },
  pillActive: {
    backgroundColor: '#D6D6C7',
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  pillTextActive: {
    color: '#1F2424',
  },
  artworkInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  artworkNameText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  artworkSpecText: {
    color: '#A0A8A8',
    fontSize: 11,
    marginTop: 1,
  },
  inquirePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D6D6C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  inquirePillText: {
    color: '#1F2424',
    fontSize: 11,
    fontWeight: '800',
  },
});
