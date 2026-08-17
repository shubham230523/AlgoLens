import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import * as Icons from '@expo/vector-icons';

/**
 * Pre-loads all critical assets for offline use.
 */
export async function loadAppAssets() {
  const fontAssets = cacheFonts([
    Icons.Ionicons.font,
    Icons.MaterialIcons.font,
    Icons.FontAwesome.font,
  ]);

  const imageAssets = cacheImages([
    require('../../assets/images/react-logo.png'),
    require('../../assets/images/logo-glow.png'),
    // Add other essential images here
  ]);

  await Promise.all([...fontAssets, ...imageAssets]);
}

function cacheFonts(fonts: any[]) {
  return fonts.map(font => Font.loadAsync(font));
}

function cacheImages(images: any[]) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}
