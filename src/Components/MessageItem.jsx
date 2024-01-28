import { View, Text } from 'react-native'
import React from 'react'

const MessageItem = ({item, sender}) => {
  return (
    <View 
        style={{
            flexDirection: "row",
            justifyContent: item.sender === sender? "flex-end": "flex-start",
            padding: 10
        }}
    >
        <View 
            style={{
                backgroundColor: item.sender === sender? "#dcf8c6" : "#ffffff",
                padding: 10,
                borderRadius: 10,
                maxWidth: "80%",
                marginHorizontal: 10
            }}
        >
            <Text
                className='text-gray-500 text-sm mb-2'
                style={{textAlign: item.sender === sender? "right":"left"}}
            >{(item.sender === sender)? "me": item.sender}</Text>
            <Text className="text-gray-700 text-base">{item.message}</Text>
        </View>
    </View>
  )
}

export default MessageItem