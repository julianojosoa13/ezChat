import { View, Text, Button } from 'react-native'
import React from 'react'
import { signOut } from '@firebase/auth'
import { auth } from '../../firebase/config'

const ProfileScreen = () => {
  return (
    <View>
      <Text>ProfileScreen</Text>
      <Button title='Log Out' onPress={() => signOut(auth) }/>
    </View>
  )
}

export default ProfileScreen