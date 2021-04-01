import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Alert, StatusBar, Dimensions, Platform } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import * as firebase from 'firebase';

const trueWidth = Dimensions.get('window').width;
const inputWidth = Dimensions.get('window').width * .7;

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
            <KeyboardAvoidingView style={styles.container} behavior={Platform.select({android: undefined, ios: 'padding'})}>
                <ScrollView>
            <View style={{flex:.5, paddingTop:StatusBar.currentHeight, backgroundColor:'#007AAF', width: trueWidth, borderBottomLeftRadius:30, borderBottomRightRadius:30, justifyContent:'center'}}>
                <Text style={{fontSize:50, color:'white', textAlign:'center', paddingBottom:20, alignSelf:'center'}}>Smart Coach</Text>
            </View>
            <View>
                <Text style={styles.header}> Create an account  </Text>
            </View>
                <View style={{marginHorizontal: 32, flex:1}}>

                    <Text style={styles.subheader}> Full Name </Text>
                    <TextInput style={styles.input} placeholder="Name" onChangeText={name => this.setState({name})} value={this.state.name}></TextInput>

                    <Text style={styles.subheader}> Email Address </Text>
                    <TextInput style={styles.input} placeholder="Email" onChangeText={email => this.setState({email})} value={this.state.email}></TextInput>

                    <Text style={styles.subheader}> Password </Text>
                    <TextInput style={styles.input} secureTextEntry={true} placeholder="Password" onChangeText={password => this.setState({password})} value={this.state.password}></TextInput>

                    <View style={{alignItems:'center'}}>
                        <TouchableOpacity onPress={this.registerUser} style={styles.button}>
                            <Text style={{color:'white', textAlign:'center', fontWeight:'bold', fontSize:20}}> Sign Up </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                            <Text style={{marginTop: 20, color:'black',fontSize: 13, textAlign:'center'}}>Already have an account? <Text style={{color:'#1232ff'}}>Log In</Text></Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </ScrollView>
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
        fontSize: 35,
        color: "#007AAF",
        marginBottom: 40,
        textAlign:'center'
    },
    input: {
        marginTop: 3,
        height: 50,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#BAB7C3',
        borderRadius:30,
        paddingHorizontal: 16,
        color: 'black',
        width:inputWidth,
        textAlign:'center',
        alignSelf:'center'
    },
    subheader: {
        fontSize: 25,
        marginTop: 5,
        color:'black',
        alignSelf:'center'
    },
    button: {
        marginHorizontal:30,
        backgroundColor: '#007AFF',
        borderRadius:20,
        height: 52,
        width: '80%',
        alignItems:'center',
        justifyContent:'center',
        marginTop:30
    }

});