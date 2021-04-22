import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';

/*
This is the home screen of the app and the lowest screen in the navigator
Checks whether the user is logged in and navigates them to the correct navigation stack
if they are logged in, they will be directed to the main application tabs
When app is loading, activity indicator will display */
export default class HomeScreen extends React.Component {
    
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? "Auth" : "App")
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="black" />
            </View>
        )
    }
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems: 'center'
    }
})