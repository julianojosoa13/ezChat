import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import LoginScreen from './src/Screens/LoginScreen';

export default function App() {
  return (
    <View>
      <LoginScreen />
    </View>
  );
}