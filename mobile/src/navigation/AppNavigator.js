import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ShopContext } from '../context/ShopContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CollectionScreen from '../screens/CollectionScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import WallPreviewScreen from '../screens/WallPreviewScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import WishlistScreen from '../screens/WishlistScreen';
import OrdersScreen from '../screens/OrdersScreen';
import BlogScreen from '../screens/BlogScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabNavigator() {
  const { getCartCount, wishlist, theme, isDarkMode } = useContext(ShopContext);
  const cartCount = getCartCount();
  const wishCount = wishlist.length;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBarBg,
          borderTopColor: theme.cardBorder,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDarkMode ? 0.2 : 0.05,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarActiveTintColor: isDarkMode ? theme.accentBone : theme.primaryText,
        tabBarInactiveTintColor: theme.mutedText,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ExploreTab') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'WishlistTab') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'BlogTab') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="ExploreTab"
        component={CollectionScreen}
        options={{ tabBarLabel: 'Explore' }}
      />
      <Tab.Screen
        name="WishlistTab"
        component={WishlistScreen}
        options={{
          tabBarLabel: 'Saved',
          tabBarBadge: wishCount > 0 ? wishCount : undefined,
          tabBarBadgeStyle: { backgroundColor: theme.orangeAccent, fontSize: 10 },
        }}
      />
      <Tab.Screen
        name="BlogTab"
        component={BlogScreen}
        options={{ tabBarLabel: 'Gazette' }}
      />
      {/* Buying / In-app cart & checkout commented out for now as requested:
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: { backgroundColor: theme.goldAccent, color: '#000', fontSize: 10, fontWeight: '800' },
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{ tabBarLabel: 'Orders' }}
      />
      */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { theme, isDarkMode } = useContext(ShopContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.backgroundSecondary,
          },
          headerTintColor: theme.primaryText,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 16,
          },
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ title: 'Artwork Details' }}
        />
        <Stack.Screen
          name="WallPreview"
          component={WallPreviewScreen}
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ title: 'Secure Checkout' }}
        />
        <Stack.Screen
          name="Blog"
          component={BlogScreen}
          options={{ title: 'Art Gazette' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
