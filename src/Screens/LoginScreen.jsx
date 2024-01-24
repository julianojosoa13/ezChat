//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const backImage = require("../../assets/background_signin.jpg")

// create a component
const LoginScreen = () => {
    const [values, setValues] = useState()
    const handleChange = (key, value) => {
        setValues({...values, [key]: value})
    }

    console.log(values)
    return (
        <KeyboardAwareScrollView>
            <View>
                <Image source={backImage} className={`object-cover h-80 w-full`}/>
            </View>
            <View className="bg-white h-screen rounded-t-3xl mt-4">
                <Text className="text-[#d60e45] text-3xl font-semibold text-center py-3 mt-3">
                    Sign in{" "}
                </Text>
                <View className='items-center w-full justify-center'>
                    <TextInput 
                        className='tracking-widest bg-gray-100 rounded-lg w-80 text-base py-2 px-4 mx-3 mb-5'
                        placeholder='Enter Email'
                        keyboard='email-address'
                        textContentType='emailAddress'
                        value={values?.email}
                        onChangeText={(text) => handleChange('email', text)}
                    />
                    <TextInput 
                        className='tracking-widest bg-gray-100 rounded-lg w-80 text-base py-2 px-4 mx-3 mb-5'
                        placeholder='Enter your password'
                        value={values?.password}
                        secureTextEntry={true}
                        onChangeText={(text) => handleChange('password', text)}
                        autoCorrect={false}
                        autoCapitalize='none'
                    />
                </View>
                <TouchableOpacity className='bg-[#fac25a] py-2 rounded-md mx-10 mb-16 mt-3'>
                    <Text className='text-center text-white'>
                        Log in
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
};

//make this component available to the app
export default LoginScreen;
