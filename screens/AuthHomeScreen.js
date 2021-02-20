import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import * as firebase from 'firebase';
import {LinearGradient} from 'expo-linear-gradient';

export default class AuthHomeScreen extends React.Component {
    state = {
        email: "",
        displayName: "",
        uid: ""
    }

    componentDidMount() {
        const { email, displayName, uid } = firebase.auth().currentUser;
        this.setState({ email, displayName, uid});
    }

    render() {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['rgba(139, 59, 252, 1)', 'rgba(226,108,234,1)']} style={styles.background}>
                <Text> New User </Text>
                <Text>{this.state.email}</Text>
                <Text>{this.state.displayName}</Text>
                <Text>{this.state.uid}</Text>

                <TouchableOpacity style={styles.button} onPress={this.signOut}><Text style={{color:'black', fontSize: 20}}>Sign Out</Text></TouchableOpacity>
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
    }
});
