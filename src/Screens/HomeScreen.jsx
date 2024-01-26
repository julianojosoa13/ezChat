import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect } from 'react'
import {Entypo} from "@expo/vector-icons"
import { signOut } from '@firebase/auth'
import { auth, userRef } from '../../firebase/config'
import { AuthenticatedUserContext } from '../../Context/AuthenticationContext'
import { getDocs, query, where } from 'firebase/firestore'

const userAvatar = require("../../assets/man.png")

const HomeScreen = ({navigation}) => {
  const {user, userAvatarURL, setUserAvatarURL} = useContext(AuthenticatedUserContext)
  console.log(userAvatarURL)

  useLayoutEffect(() => {
    navigation.setOptions({
        headerRight: () => {
            return (
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    {!userAvatarURL? (
                      <Image source={userAvatar} className="h-10 w-10"/>
                    ) : (
                      <Image source={{uri: userAvatarURL}} className="h-10 w-10 rounded-full" />
                    )
                    }
                </TouchableOpacity>
            )
        }
    })
  }, [userAvatarURL])

  useEffect(() => {
    const DocFinder = async (queryResult) => {
      const querySnapshot = await getDocs(queryResult)
      querySnapshot.forEach((doc) => {
        const {profilePic} = doc.data()
        setUserAvatarURL(profilePic)
      })
    }

    if(!user) {
      return
    }
    const queryResult = query(userRef, where("email", "==", user.email))
    DocFinder(queryResult)
  }, [])

  return (
    <View className='flex-1'>
      <View className='flex-row-reverse absolute bottom-14 right-5'>
        <TouchableOpacity 
          className='bg-orange-500 h-16 w-16 rounded-full text-center items-center justify-center'
          onPress={() => navigation.navigate("Search")}
        >
          <Entypo name="chat" size={30} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default HomeScreen