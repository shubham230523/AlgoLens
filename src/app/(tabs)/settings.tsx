import { View, Text } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: Colors[colorScheme].text }}>Settings Screen</Text>
    </View>
  );
}
