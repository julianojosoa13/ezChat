import { Image, Text, View } from 'react-native';
import LoginScreen from './src/Screens/LoginScreen';
import RegisterScreen from './src/Screens/RegisterScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthenticatedUserProvider, { AuthenticatedUserContext } from './Context/AuthenticationContext';
import { useContext, useEffect, useState } from 'react';
import HomeScreen from './src/Screens/HomeScreen';
import { onAuthStateChanged } from '@firebase/auth';
import { auth } from './firebase/config';
import ProfileScreen from './src/Screens/ProfileScreen';

const loadingGIF = require("./assets/loading.gif")

const Stack = createNativeStackNavigator()

const RootNavigator = () => {
  const {user,setUser} = useContext(AuthenticatedUserContext)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    onAuthStateChanged(auth, (user) => {
      if(user){
        setUser(user)
        setIsLoading(false)
      } else {
        setIsLoading(false) 
      }
    })
  }, [])

  console.log("User :>> ", user)
  console.log("Loading :>> ", isLoading)
  
  return (
    <NavigationContainer>
      {!user && isLoading === true ? (
          <Image source={loadingGIF} className="h-full w-full"/>
        )  : !user && isLoading === false ? (
        <AuthStack />
        ) : (
        <MainStack />
        )
      }
    </NavigationContainer>
  )
}

const AuthStack = () => {
  return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
        initialRouteName='Login'
      >
        <Stack.Screen name="Register" component={RegisterScreen}/>
        <Stack.Screen name="Login" component={LoginScreen}/>
      </Stack.Navigator>
  )
}

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}