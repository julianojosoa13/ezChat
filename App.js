import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import LoginScreen from './src/Screens/LoginScreen';

export default function App() {
  return (
    <View className="flex-1 justify-center">
      <LoginScreen />
    </View>
  );
}