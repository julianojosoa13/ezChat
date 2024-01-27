import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import {MaterialCommunityIcons,MaterialIcons} from "@expo/vector-icons";
import { AuthenticatedUserContext } from '../../Context/AuthenticationContext';
import { Timestamp, addDoc, collection, getDocs, query, updateDoc, where, doc } from 'firebase/firestore';
import { chatRef, db } from '../../firebase/config';

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

    setMessage("")
  }

  useLayoutEffect(()=> {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back-ios" size={30} color="black" />
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

  return (
    <View>
      <View className="h-[90%]"></View>
      <View className="h-[10%] flex-row items-center mx-3 space-x-3">
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
  )
}

export default ChatScreen