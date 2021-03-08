import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Alert } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import * as firebase from 'firebase';

export default class RegisterScreen extends React.Component {
    state = {
        name: "",
        email: "",
        password: ""
    };

    // Register function
    // Register the User with their email and password using the built-in firebase function
    registerUser = () => {
        firebase
        .auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(userCredentials => {
            return userCredentials.user.updateProfile({
                displayName: this.state.name
            });
        })
        //.then(this.props.navigation.navigate('Login'))
        .catch(error => {Alert.alert(error.message)})
    };
    
    render() {
        return (
            <KeyboardAvoidingView style={styles.container}>
                <LinearGradient colors={['rgba(17, 236, 193, 0.8)', 'transparent']} style={styles.background}>
                <View style={{marginHorizontal: 32}}>

                    <Text style={styles.header}> Full Name </Text>
                    <TextInput style={styles.input} placeholder="Name" onChangeText={name => this.setState({name})} value={this.state.name}></TextInput>

                    <Text style={styles.header}> Email Address </Text>
                    <TextInput style={styles.input} placeholder="Email" onChangeText={email => this.setState({email})} value={this.state.email}></TextInput>

                    <Text style={styles.header}> Password </Text>
                    <TextInput style={styles.input} secureTextEntry={true} placeholder="Password" onChangeText={password => this.setState({password})} value={this.state.password}></TextInput>

                    <View style={{alignItems:'center'}}>
                        <TouchableOpacity onPress={this.registerUser} style={styles.button}>
                            <Text style={{color:'black', textAlign:'center', fontWeight:'bold', fontSize:20}}> Sign Up </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                            <Text style={{marginTop: 10, color:'white',fontSize: 13, textAlign:'center'}}>Already have an account? <Text style={{color:'#1232ff'}}>Log In</Text></Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </LinearGradient>

                
                
                

            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor:'#B23AFC'
    },
    header: {
        fontWeight: "800",
        fontSize: 25,
        color: "#514E5A",
        marginTop: 5,
        color:'white',
        
    },
    input: {
        marginTop: 3,
        height: 50,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#BAB7C3',
        borderRadius:30,
        paddingHorizontal: 16,
        color: '#fff'
    },
    circle: {
        width: 500,
        height: 500,
        borderRadius: 500 / 2,
        //backgroundColor:'#c97afa',
        position:'absolute',
        left: -100,
        top: -20

        //#B23AFC
    },
    background: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
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