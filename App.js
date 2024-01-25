import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import LoginScreen from './src/Screens/LoginScreen';
import SingupScreen from './src/Screens/SingupScreen';

export default function App() {
  return (
    <View>
      {/* <LoginScreen /> */}
      <SingupScreen />
    </View>
  );
}