import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StatusBar, Dimensions } from 'react-native';
import * as firebase from 'firebase';

const trueWidth = Dimensions.get('window').width;
const inputWidth = Dimensions.get('window').width * .7;

export default class LoginScreen extends React.Component {
    state = {
        email: "",
        password:"",
        errorMessage: null
    }

    // Log the user in with email and password
    doLogin = () => {       
        const { email, password } = this.state;
        firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(error => this.setState({ errorMessage: error.message }));
    }

    // Navigate user to reset password screen
    resetPassword = () => {
        this.props.navigation.navigate('Reset')
    }
    
    // Navigate user to register screen
    register = () => {
        this.props.navigation.navigate("Register")
    }
    
    render() {
        return (
            // This is the overall screen view
            <KeyboardAvoidingView style={styles.container} behavior={Platform.select({android: undefined, ios: 'padding'})}>
                <ScrollView contentContainerStyle={{flex:1}}>
                <View style={{flex:.3, paddingTop:StatusBar.currentHeight, backgroundColor:'#007AAF', width: trueWidth, borderBottomLeftRadius:30, borderBottomRightRadius:30, justifyContent:'center'}}>
                    <Text style={{fontSize:50, color:'white', textAlign:'center', paddingBottom:20, alignSelf:'center'}}>Smart Coach</Text>
                </View>
                <View>
                    {this.state.errorMessage && <Text style={{color:'red', fontSize:16}}>{this.state.errorMessage}</Text>}
                </View>

            <View>
                <Text style={styles.header}> Log in to your account </Text>
            </View>
                <View style={{marginHorizontal: 32, flex:1, alignContent:'center'}}>
                    <Text style={styles.subheader}> Email Address </Text>
                    <TextInput style={styles.input} placeholder="Email" onChangeText={email => this.setState({email})} value={this.state.email}></TextInput>

                    <Text style={styles.subheader}> Password </Text>
                    <TextInput style={styles.input} secureTextEntry placeholder="Password" onChangeText={password => this.setState({password})} value={this.state.password}></TextInput>

                    <View style={{alignItems:'center'}}>
                        <TouchableOpacity onPress={this.doLogin} style={styles.button}>
                            <Text style={{color:'white', textAlign:'center', fontWeight:'bold', fontSize:20}}> Login </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.register}>
                            <Text style={{marginTop: 10, marginBottom: 10, color:'black',fontSize: 13, textAlign:'center'}}>Don't have an account? <Text style={{color:'#1232ff'}}>Sign Up</Text></Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.resetPassword}>
                            <Text style={{marginTop: 10, color:'black',fontSize: 13, textAlign:'center'}}>Forgotten your password? <Text style={{color:'#1232ff'}}>Reset Here</Text></Text>
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
        // fontWeight: "bold",
        fontSize: 35,
        color: "#007AAF",
        marginBottom:50,  
        textAlign:'center'     
    },

    subheader: {
        fontSize: 25,
        marginTop: 5,
        color:'black',
        alignSelf:'center'
    },

    input: {
        marginTop: 3,
        height: 50,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#BAB7C3',
        borderRadius:30,
        paddingHorizontal: 16,
        color: 'black',
        width: inputWidth,
        textAlign:'center',
        alignSelf:'center'
    },
    background: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        width: '100%'
    },
    button: {
        marginHorizontal:30,
        backgroundColor: '#007AAF',
        borderRadius:20,
        height: 52,
        width: '80%',
        alignItems:'center',
        justifyContent:'center',
        marginTop:30
    }

});