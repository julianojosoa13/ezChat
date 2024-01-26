import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { signOut } from '@firebase/auth'
import { auth, db, userRef } from '../../firebase/config'
import { AuthenticatedUserContext } from '../../Context/AuthenticationContext'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import {Ionicons} from "@expo/vector-icons"
import * as ImagePicker from 'expo-image-picker';
import {ref, getStorage, uploadBytes, getDownloadURL} from "firebase/storage"

const ProfileScreen = ({navigation}) => {
  const {user,setUser, setUserAvatarURL, userAvatarURL} = useContext(AuthenticatedUserContext)
  const storage = getStorage()

  const [userData, setUserData] = useState({username: "", userEmail: ""})
  const [userImageURL, setUserImageURL] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const {username, userEmail} = userData

  const queryResult = query(userRef,where("email", "==", user.email)) 

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
        const {username, email, profilePic} = doc.data()
        setValue("username", username)
        setValue("userEmail", email)
        setUserImageURL(profilePic)
      }
    })
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (image) => {
    try {
      setIsLoading(true)
      const response = await fetch(image)
      const blob = await response.blob()
      const filename = image.substring(image.lastIndexOf("/"))
      const imageRef = ref(storage, `ProfilePictures/${filename}`)
      uploadBytes(imageRef, blob).then( async () => {
        const downloadURL = await getDownloadURL(imageRef)
        const querySnapshot = await getDocs(queryResult)
        querySnapshot.forEach(async (document) => {
          await updateDoc(doc(db, "Users", document.id), {
            profilePic: downloadURL
          }).then(()=>{
            setUserImageURL(downloadURL)
            setUserAvatarURL(downloadURL)
            setIsLoading(false)
          })
        })
      }) 
    }catch(e) {
      Alert.alert(e)
      console.log(e)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if(!user) {
      return
    }
    DocFinder(queryResult)
  },[userAvatarURL])

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
      <TouchableOpacity className="rounded-md bg-gray-400 items-center justify-center mx-10 mb-10" onPress={pickImage}>
        {userImageURL === undefined ?(
          <Ionicons name="camera" size={50} color="white" />
        ) : isLoading? (
          <ActivityIndicator size={"large"} color="white"/>
        ) : (
          <Image source={{uri: userImageURL}} className="h-40 w-full rounded-md" resizeMode='cover'/>
        )

        }
        
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