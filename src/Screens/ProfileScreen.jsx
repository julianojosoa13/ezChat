import { View, Text, Button, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { signOut } from '@firebase/auth'
import { auth, db } from '../../firebase/config'
import { AuthenticatedUserContext } from '../../Context/AuthenticationContext'
import { collection, getDocs, query, where } from 'firebase/firestore'
import {Ionicons} from "@expo/vector-icons"

const ProfileScreen = ({navigation}) => {
  const {user,setUser} = useContext(AuthenticatedUserContext)

  const [userData, setUserData] = useState({username: "", userEmail: ""})
  const {username, userEmail} = userData

  const setValue = (key, value) => {
    setUserData((oldData) => ({
      ...oldData,
      [key]: value
    }))
  }

  const DocFinder = async (queryResult) => {
    const querySnapshot = await getDocs(queryResult)
    querySnapshot.forEach((doc) => {
      if(username === "") {
        const {username, email} = doc.data()
        setValue("username", username)
        setValue("userEmail", email)
      }
    })
  }

  useEffect(() => {
    if(!user) {
      return
    }
    const userRef = collection(db, "Users")
    const queryResult = query(userRef,where("email", "==", user.email)) 
    DocFinder(queryResult)
  },[])

  const handleSignOut = () => {
    signOut(auth).then(()=>{
      setUser(null)
      navigation.navigate("Login")
    }).catch((error)=>{
      Alert.alter("error", error.message)
    })
  }

  return (
    <View>
      <View className="justify-center items-center my-5">
        <Text className="text-2xl tracking-wider font-medium">
          Welcome,{" "} 
          <Text className="text-[#d60e45]">{username}</Text>
        </Text>
      </View>
      <TouchableOpacity className="rounded-md bg-gray-400 items-center justify-center mx-10 mb-10">
        <Ionicons name="camera" size={50} color="white" />
      </TouchableOpacity>
      <View className="items-center">
        <Text className="tracking-widest bg-gray-200 rounded-lg w-80 text-base py-2 px-2 mx-3 mb-5 font-light text-blue-500">{username}</Text>
        <Text className="tracking-widest bg-gray-200 rounded-lg w-80 text-base py-2 px-2 mx-3 mb-5 font-light text-blue-500">{userEmail}</Text>
      </View>
      <View>
        <TouchableOpacity className='bg-[#fac25a] py-2 rounded-md mx-20 mt-10 mb-3' onPress={handleSignOut}>
          <Text className="text-center text-white font-semibold text-lg">Sign Out{" "}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ProfileScreen