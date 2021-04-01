import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import * as firebase from 'firebase';
import { LinearGradient } from 'expo-linear-gradient';

export default class ResetPassword extends React.Component {
    state = {
        email: "",
        displayName:"",
        uid:""
    }

    componentDidMount() {
        
    }

    resetPassword = () => {
        firebase.auth().sendPasswordResetEmail(this.state.email)
        .then(() => {
            Alert.alert(
                "Password reset",
                "Reset email has been sent.",
                [
                    {
                        text:'close',
                        style:'cancel'
                    }
                ]
            )
        }, (error) => {
            
        });
    }

    backToLogin = () => {
        this.props.navigation.navigate('Login')
    }

    render() {
        return(
            <KeyboardAvoidingView style={styles.container}>
                    <View style={{marginHorizontal:32, borderWidth:1, borderRadius:60, padding:80, }}>
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.header}>Enter Email</Text>
                            <View style={{alignItems:'center'}}>
                                <TextInput style={styles.input} 
                                    placeholder='Email'
                                    onChangeText={email => this.setState({email})} 
                                    value={this.state.email}></TextInput>

                                <TouchableOpacity style={styles.button} onPress={this.resetPassword}>
                                    <Text style={{color:'white', fontSize: 20, fontWeight:'bold', textAlign:'center'}}>Send Reset Email</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.backToLogin}><Text style={{color:'#007AFF', fontSize:13, marginTop: 15, padding:20}}>Back to Login</Text></TouchableOpacity>
                            </View>
                    </View>
            </KeyboardAvoidingView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 25,
        marginTop: 5,
        color:'black',
        textAlign:'center'
    },
    title: {
        fontWeight: "bold",
        fontSize: 30,
        color: "#007AAF",
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
        color: 'black',
        width:'100%',
        textAlign:'center'
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
        width: '100%',
        alignItems:'center',
        justifyContent:'center',
        marginTop:30
    }
})
