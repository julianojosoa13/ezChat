import { Alert } from "react-native"

const sortLastMessage = (a,b) => {
    const aTimestamp = a.message?.timestamp || 0
    const bTimestamp = b.message?.timestamp || 0

    return bTimestamp - aTimestamp
}

const combineData = (friendAvatar, sortedLastMessage) => {
    return friendAvatar.map((friend) => {
        const lastMessageData = sortedLastMessage.find((chat) => chat.chatters.includes(friend.name))
        return {
            ...friend,
            lastMessage: lastMessageData? lastMessageData.message : ""
        }
    })
}

const processAuthError = (authError) => {
    if(authError.message.includes('user-not-found')){
        Alert.alert('User not found','You probably have to sign up first!')
    } else if (authError.message.includes('wrong-password')) {
        Alert.alert('Wrong Password', 'Try again')
    } else if (authError.message.includes('email-already-in-use')) {
        Alert.alert('Please use another email','This email ID already exists, use a different one!')
    } else if (authError.message.includes("network-request-failed")) {
        Alert.alert("Network error", "Try again later or check your Internet connexion")
    } else if (authError.message.includes("invalid-credential")) {
        Alert.alert("Invalid credentials", "Check your username or password!")
    }
}

export {sortLastMessage, combineData, processAuthError}