import { View, Text, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import {Entypo} from "@expo/vector-icons"
import { signOut } from '@firebase/auth'
import { auth, chatRef, userRef } from '../../firebase/config'
import { AuthenticatedUserContext } from '../../Context/AuthenticationContext'
import { getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { combineData, sortLastMessage } from '../Utils'
import ChatItem from '../Components/ChatItem'

const userAvatar = require("../../assets/man.png")

const HomeScreen = ({navigation}) => {
  const {user, userAvatarURL, setUserAvatarURL} = useContext(AuthenticatedUserContext)
  const username = user.email.split('@')[0]

  const [friends, setFriends] = useState([])
  const [friendAvatar, setFriendAvatar] = useState([])
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
            const friend = chats.replace(username, "").replace("xx", "").replace(username, "")
            if(friend !== "") friendsArray.push(friend)
  
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
            const friend = chats.replace(username, "").replace("xx", "").replace(username, "")

            if(friend !== "") friendsArray.push(friend)
  
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

  useEffect(()=> {
    if(!user) return
    let avatarsArray = []
    let latestMessage = []

    const unsubscribe = friends.map((friend) => {
      setIsLoading(true)
      const queryResult = query(userRef, where("username", "==", friend))
      const unsubfriend = onSnapshot(queryResult, (querySnapshot) => {
        querySnapshot.forEach(doc => {
          const {profilePic, email} = doc.data()
          avatarsArray.push({name:friend, avatar: profilePic, email})
          setFriendAvatar([...avatarsArray])
        })
      })
      const queryResult2 = query(chatRef, where("chatters", "==", `${username}xx${friend}`))
      const queryResult3 = query(chatRef, where("chatters", "==", `${friend}xx${username}`))
      const unsubChat = onSnapshot(queryResult2, (querySnapshot) => {
        querySnapshot.forEach(doc => {
          const conversation = doc.data().conversation
          let lastMessage = {}
          if(conversation && conversation.length > 0) {
            lastMessage = conversation[conversation.length - 1]
          }
          
          latestMessage.push({
            chatters: doc.data().chatters,
            message: lastMessage
          })
          setLastMessages([...latestMessage])
          })
      })
      const unsubChat2 = onSnapshot(queryResult3, (querySnapshot) => {
        querySnapshot.forEach(doc => {
          const conversation = doc.data().conversation
          let lastMessage = {}
          if(conversation && conversation.length > 0) {
            lastMessage = conversation[conversation.length - 1]
          }
          
          latestMessage.push({
            chatters: doc.data().chatters,
            message: lastMessage
          })
          setLastMessages([...latestMessage])
          })
      })
      setIsLoading(false)
      return () => {
        unsubfriend()
        unsubChat()
        unsubChat2()
      }
    })

    return () => unsubscribe.forEach(unsub => unsub())
  }, [friends])

  const sortedLastMessage = lastMessages.sort()
  const combinedData = combineData(friendAvatar, sortedLastMessage)

  console.log("CombinedData :>> ", combinedData)

  return (
    <>
      {isLoading? (
        <View className="items-center justify-center h-full">
          <ActivityIndicator size={"large"} color="#D44A00"/>
        </View>
      ): (
        <FlatList 
          data={combinedData}
          renderItem={({item}) => {
            return (
              <ChatItem navigation={navigation} friend={item}/>
            )
          }}
        />
      )}
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
    </>
  )
}

export default HomeScreen