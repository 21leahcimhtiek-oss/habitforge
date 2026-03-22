import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({ SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf') });
  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);
  if (!loaded) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A0F1A' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-habit" options={{ presentation: 'modal' }} />
        <Stack.Screen name="add-task" options={{ presentation: 'modal' }} />
        <Stack.Screen name="habit-detail" options={{ presentation: 'modal' }} />
        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
        <Stack.Screen name="subscription" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
