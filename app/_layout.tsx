import { Slot } from 'expo-router';
import { LogBox } from 'react-native';

// إخفاء تحذيرات Expo المزعجة من الشاشات
LogBox.ignoreLogs([
  '[expo-av]',
  '[expo-image-picker]',
  'ImagePicker.MediaTypeOptions',
]);

export default function RootLayout() {
  return <Slot />;
}
