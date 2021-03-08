import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import * as firebase from 'firebase';
import {LinearGradient} from 'expo-linear-gradient';

// This page checks whether the user logging in is a new or previous user to navigate them to the correct page
export default class ExerciseScreen extends React.Component {

    // Holding the current user's email, name and user ID
    state = {
        email: "",
        displayName: "",
        uid: ""
    }

    componentDidMount() {
        const { email, displayName, uid } = firebase.auth().currentUser;
        this.setState({ email, displayName, uid});
    }

    // UI render
    render() {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['rgba(17, 236, 193, 0.8)', 'transparent']} style={styles.background}>
                <Text> Exercise Screen </Text>
                </LinearGradient>
            </View>
        );
    }
}

// Page styling components
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    background: {
        flex: 1,
        justifyContent:'center',
        alignItems: 'center',
        width: '100%'
    },
    button: {
        marginHorizontal:30,
        backgroundColor: '#fff',
        borderRadius:20,
        height: 52,
        width: '80%',
        alignItems:'center',
        justifyContent:'center',
        marginTop:30
    }
});