import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const userAvatar = require("../../assets/man.png")

const ChatItem = ({navigation, friend}) => {
  return (
    <TouchableOpacity className="mx-4" onPress={() => navigation.navigate("Chat", {friendName: friend.name, friendAvatar: friend.avatar, friendEmail: friend.email})}>
      <View className="flex-row items-center space-x-4 bg-white my-2 py-2 rounded-lg">
        {friend.avatar !== undefined? (
            <Image source={{uri: friend.avatar}} className={"h-12 w-12 rounded-full ml-3 mt-1"}/>
        ): (
            <Image source={userAvatar} className="h-12 w-12 rounded-full ml-3 mt-1" />
        )}
        <View>
            <Text className="font-bold tracking-widest text-lg">{friend.name}</Text>
            <Text className="text-gray-500 tracking-tight text-sm max-h-16 max-w-[90%]">{friend.lastMessage.message}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ChatItem