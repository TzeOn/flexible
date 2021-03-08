import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import * as firebase from 'firebase';
import { LinearGradient } from 'expo-linear-gradient';

export default class ResetPassword extends React.Component {
    state = {
        email: ""
    }

    resetPassword = () => {
        firebase.auth().sendPasswordResetEmail(this.state.email)
        .then(() => {

        }, (error) => {

        });
    }

    backToLogin = () => {
        this.props.navigation.navigate('Login')
    }

    render() {
        return(
            <KeyboardAvoidingView style={styles.container}>
                <LinearGradient colors={['rgba(17, 236, 193, 0.8)', 'transparent']} style={styles.background}>
                    <View style={{marginHorizontal:32}}>
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.header}>Enter Email</Text>
                            <View style={{alignItems:'center'}}>
                                <TextInput style={styles.input} 
                                    onChangeText={email => this.setState({email})} 
                                    value={this.state.email}></TextInput>

                                <TouchableOpacity style={styles.button} onPress={this.resetPassword}>
                                    <Text style={{color:'black', fontSize: 20, fontWeight:'bold', textAlign:'center'}}>Send Reset Email</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.backToLogin}><Text style={{color:'white', fontSize:13, marginTop: 15}}>Back to Login</Text></TouchableOpacity>
                            </View>
                    </View>
                </LinearGradient>
            </KeyboardAvoidingView>
        )
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
        marginTop: 5,
        color:'white',
        
    },
    title: {
        fontWeight: "800",
        fontSize: 30,
        color: "white",
        marginTop: 5,
        marginBottom: 20
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
        width: '100%',
        alignItems:'center',
        justifyContent:'center',
        marginTop:30
    }
})
