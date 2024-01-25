import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { signOut } from '@firebase/auth'
import { auth } from '../../firebase/config'

const userAvatar = require("../../assets/man.png")

const HomeScreen = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
        headerRight: () => {
            return (
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <Image source={userAvatar} className="h-10 w-10"/>
                </TouchableOpacity>
            )
        }
    })
  }, [])
  return (
    <View>
      <Text>HomeScreen</Text>
      <TouchableOpacity onPress={() => signOut(auth)}>
        <Text>Log Out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen