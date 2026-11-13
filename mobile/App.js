import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ShopContext, ShopContextProvider } from './src/context/ShopContext';
import AppNavigator from './src/navigation/AppNavigator';

function MainApp() {
  const { isDarkMode } = useContext(ShopContext);

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ShopContextProvider>
        <MainApp />
      </ShopContextProvider>
    </SafeAreaProvider>
  );
}
