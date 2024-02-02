import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import {Entypo} from "@expo/vector-icons"
import { signOut } from '@firebase/auth'
import { auth, chatRef, userRef } from '../../firebase/config'
import { AuthenticatedUserContext } from '../../Context/AuthenticationContext'
import { getDocs, onSnapshot, query, where } from 'firebase/firestore'

const userAvatar = require("../../assets/man.png")

const HomeScreen = ({navigation}) => {
  const {user, userAvatarURL, setUserAvatarURL} = useContext(AuthenticatedUserContext)
  const username = user.email.split('@')[0]

  const [friends, setFriends] = useState([])
  const [friendAvatar, setFriendAvater] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastMessages, setLastMessages] = useState([])

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

  useEffect(() => {
    if(!user) return
    const fetchLoggedUserChats = async() => {
      setIsLoading(true)
      const queryResult = query(chatRef, where("chatters", '>=',`${username}`), where("chatters", "<=", `${username}` + '\uf8ff' ))
      const queryResult2 = query(chatRef, where("chatters", "<=", `xx${username}`))
      
      let friendsArray = []

      const unsubscribe = onSnapshot(queryResult, (querySnapshot)=> {
        setIsLoading(false)
        querySnapshot.forEach((doc)=> {
          if(doc.data().chatters.includes(username)) {
            const chats = doc.data().chatters
            const friends = chats.replace(username, "").replace("xx", "").replace(username, "")
            if(friends !== "") friendsArray.push(friends)
  
            friendsArray = [...new Set(friendsArray)]
            setFriends(friendsArray)
          }
        })
      })

      const unsubscribe2 = onSnapshot(queryResult2, (querySnapshot)=> {
        setIsLoading(false)
        querySnapshot.forEach((doc)=> {
          if(doc.data().chatters.includes(username)) {
            const chats = doc.data().chatters
            const friends = chats.replace(username, "").replace("xx", "").replace(username, "")

            if(friends !== "") friendsArray.push(friends)
  
            friendsArray = [...new Set(friendsArray)]
            setFriends(friendsArray)
          }
        })
      })
      
      return () => {
        unsubscribe()
        unsubscribe2()
      }
    }

    fetchLoggedUserChats()
  }, [])

  
  console.log("Friends :>> ", friends)

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