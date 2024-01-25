import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { signOut } from '@firebase/auth'
import { auth } from '../../firebase/config'

const HomeScreen = () => {
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