import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import * as firebase from 'firebase';
import {LinearGradient} from 'expo-linear-gradient';

// This page checks whether the user logging in is a new or previous user to navigate them to the correct page
export default class DashboardScreen extends React.Component {

    // Holding the current user's email, name and user ID
    state = {
        email: "",
        displayName: "",
        uid: ""
    }

    // Loads the currently logged in user's details into the state
    // Calls the function checkUser, passing the user's uid as parameter
    // Checks if the user has logged in before
    componentDidMount() {
        const { email, displayName, uid } = firebase.auth().currentUser;
        this.setState({ email, displayName, uid});
        this.checkUser(uid);
        console.log();
    }

    // Searches the database for the current user's ID to check if they are new users
    // New users will be taken to the screen to enter their diet information
    // Existing users will be taken to the App dashboard
    checkUser = (uid) => {
        // database reference is 'Users/uid'
        let userRef = firebase.database().ref('Users/' + uid);

        // Check once if the value at above reference is null/exists
        userRef.once('value', (snapshot) => {
            const data = snapshot.val()
            if(data == null){
                this.props.navigation.navigate('NewUser');
                console.log('new user');
                // Null value, i.e. does not exist, thus == new user
            } else {
                this.props.navigation.navigate('AuthHome');
                console.log('existing user');
                // Exists, navigate to logged in homepage
            }
        })
        
    };

    // Function to log the user out of the app. Function is a built-in function of the firebase API
    signOut = () => {
        firebase.auth().signOut();
    };


    // UI render
    render() {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['rgba(17, 236, 193, 0.8)', 'transparent']} style={styles.background}>
                <Text> Home </Text>
                <Text>{this.state.email}</Text>
                <Text>{this.state.displayName}</Text>
                <Text>{this.state.uid}</Text>

                <TouchableOpacity style={styles.button} onPress={this.signOut}><Text style={{color:'black', fontSize: 20}}>Sign Out</Text></TouchableOpacity>
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