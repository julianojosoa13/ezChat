import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {MaterialCommunityIcons,MaterialIcons} from "@expo/vector-icons";
import { AuthenticatedUserContext } from '../../Context/AuthenticationContext';
import { Timestamp, addDoc, collection, getDocs, query, updateDoc, where, doc, onSnapshot } from 'firebase/firestore';


import {
  NATIVE_NOTIFY_APP_ID,
  NATIVE_NOTIFY_TOKEN
} from '@env'

import axios from 'axios';

import { chatRef, db } from '../../firebase/config';
import MessageItem from '../Components/MessageItem';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

const defaultAvatar = require("../../assets/man.png")

const ChatScreen = ({navigation, route}) => {
  const {friendName, friendAvatar, friendEmail} = route.params
  const [message, setMessage] = useState('')
  const {user} = useContext(AuthenticatedUserContext)
  const sender = user.email.split("@")[0]
  const [messages, setMessages] = useState([])
  const flatListRef = useRef(null)
  const [isListReady, setIsListReady] = useState(false)

  const queryResult = query(chatRef, where("chatters", "==", `${sender}xx${friendName}`) )
  const queryResult2 = query(chatRef, where("chatters", "==", `${friendName}xx${sender}`) )

  const handleSubmit = async () => {
    const querySnapshot = await getDocs(queryResult)
    const querySnapshot2 = await getDocs(queryResult2)

    if(!querySnapshot?.empty || !querySnapshot2?.empty) {
      querySnapshot?.forEach(document => {
        updateDoc(doc(db, "Chats", document.id), {
          conversation: [
            ...document.data().conversation,
            {
              message: message,
              timestamp: Timestamp.now(),
              sender: sender
            }
          ]
        }).catch((err) => {
          console.log(err)
        })
      });

      querySnapshot2?.forEach(document => {
        updateDoc(doc(db, "Chats", document.id), {
          conversation: [
            ...document.data().conversation,
            {
              message: message,
              timestamp: Timestamp.now(),
              sender: sender
            }
          ]
        }).catch((err) => {
          console.log(err)
        })
      });
    } else {
      await addDoc(collection(db, "Chats"), {
        chatters: `${sender}xx${friendName}`,
        conversation: [
          {
            message: message,
            timestamp: Timestamp.now(),
            sender: sender
          }
        ]
      })
    } 
    const retryRequest = async (maxRetries = 3) => {
      let retries = 0
      while(retries < maxRetries) {
        try {
          const response = await axios.post(
            `https://app.nativenotify.com/api/indie/notification`, 
            {      
              subID: `${friendEmail}`,      
              appId: NATIVE_NOTIFY_APP_ID,      
              appToken: NATIVE_NOTIFY_TOKEN,      
              title: `${sender} on ezChat`,      
              message: `${message}`
            }
          );
          console.log("notification success")
          return response
        } catch(error) {
          console.log("Request failed retrying...")
          retries++
        }
      }
    }

    retryRequest()
    setMessage("")
  }

  useLayoutEffect(()=> {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back-ios" size={30} color="orange" />
            </TouchableOpacity>
            {friendAvatar !== undefined ? (
              <Image source={{uri: friendAvatar}} className="h-12 w-12 rounded-full mr-2"/>  
            ) : (
              <Image source={defaultAvatar} className="h-12 w-12 rounded-full mr-2"/>
            )
            }
            <Text className="text-black font-bold tracking-widest text-lg">{friendName}</Text>
          </View>
        )
      }
    })
  }, [])

  useEffect(()=> {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(queryResult)
      const querySnapshot2 = await getDocs(queryResult2)

      if(!querySnapshot.empty  || !querySnapshot2.empty) {
        let allMessages = querySnapshot.docs.map((doc) => doc.data().conversation)
        allMessages = allMessages.concat(
          querySnapshot2.docs.map((doc) => doc.data().conversation)
        )
        allMessages = allMessages.sort((a,b) => a.timestamp?.seconds - b.timestamp?.seconds)
        setMessages(allMessages)
      }
    }
    const unsub = onSnapshot(queryResult, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => doc.data().conversation)
      setMessages(allMessages)
    })
    const unsub2 = onSnapshot(queryResult2, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => doc.data().conversation)
      setMessages(allMessages)
    } )
    fetchMessages()
    return () => {
      unsub()
      unsub2()
    }
  }, [])

  useEffect(()=> {
    setIsListReady(true)
  }, [messages])

  console.log("Messages :>> ", messages[0])

  return (
      <View className="flex-1">
        {messages[0] !== undefined && (
          <View className="flex-1">
            <KeyboardAwareFlatList
              initialNumToRender={10}
              ref={flatListRef}
              onContentSizeChange={() => {
                if(isListReady) {
                  flatListRef.current.scrollToEnd({
                    animated: true
                  })
                }
              }}
              data={messages[0]}
              keyExtractor={(item) => item.timestamp}
              renderItem={({item}) => {
                return (
                  <MessageItem item={item} sender={sender} />
                )
              }}
            />
            <View className="h-14 flex-row items-center mx-3 space-x-3 mb-2">
            <TextInput
              className="bg-white rounded-xl p-2 flex-1 text-gray-700 h-12" 
              placeholder='Type your message here...' 
              multiline={true}
              value={message}
              onChangeText={(text) => setMessage(text)}
            />
            <TouchableOpacity onPress={handleSubmit}>
              <MaterialCommunityIcons 
                name="send-circle" 
                size={40} 
                color="orange" 
                className="ml-4"
              />
            </TouchableOpacity>
          </View>
        </View>
        )}
      </View>
  )
}

export default ChatScreen