import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import { loadAppAssets } from '@/lib/assetManager';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadAppAssets();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="visualizer/[id]"
            options={{
                headerShown: true,
                title: 'Visualizer',
                headerBackTitle: 'Back'
            }}
          />
          <Stack.Screen
            name="path/[id]"
            options={{
                headerShown: true,
                title: 'Learning Path',
                headerBackTitle: 'Back'
            }}
          />
        </Stack>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
