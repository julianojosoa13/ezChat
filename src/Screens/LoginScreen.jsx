//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const backImage = require("../../assets/background_signin.jpg")

// create a component
const LoginScreen = () => {
    const [values, setValues] = useState()
    return (
        <View style={styles.container}>
            <Text>LoginScreen</Text>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default LoginScreen;
