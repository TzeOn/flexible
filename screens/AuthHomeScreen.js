import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import * as firebase from 'firebase';
import {LinearGradient} from 'expo-linear-gradient';

export default class AuthHomeScreen extends React.Component {
    state = {
        email: "",
        displayName: "",
        uid: "",
        weight:"",
        height:"",
        age:"",
        gender:"",
        activityLevel:"",
    }

    componentDidMount() {
        const { email, displayName, uid } = firebase.auth().currentUser;
        this.setState({ email, displayName, uid});

        // Listens to the database and retrieves required values, then appends these values to the corresponding state
        // Data is returned as a snapshot, all child nodes of 'Users/uid' are returned
        // child nodes are filtered using if statements where the states are set using the value of each child snapshot
        var ref = firebase.database().ref('Users/' + uid);
        ref.once('value', (snapshot) => {
        const data = snapshot.val();
        snapshot.forEach((childSnapshot) => {
            if(childSnapshot.key == 'weight'){
                this.setState({weight: childSnapshot.val()})
            }
            if(childSnapshot.key == 'height'){
                this.setState({height: childSnapshot.val()})
            }
            if(childSnapshot.key == 'age'){
                this.setState({age: childSnapshot.val()})
            }
            if(childSnapshot.key == 'gender'){
                this.setState({gender: childSnapshot.val()})
            }
            if(childSnapshot.key == 'activity'){
                this.setState({activityLevel: childSnapshot.val()})
            }
        })
        console.log(data)
        });
    }

    signOut = () => {
        firebase.auth().signOut();
    };

    render() {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['rgba(17, 236, 193, 0.8)', 'transparent']} style={styles.background}>
                <Text> Home Screen </Text>
                <Text>Welcome back {this.state.displayName}</Text>
                
                </LinearGradient>
            </View>
        );
    }
}

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
    },
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#BAB7C3',
        color: '#fff',
        textAlign:'center'
    },
});
