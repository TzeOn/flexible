import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import * as firebase from 'firebase';

export default class LoginScreen extends React.Component {
    state = {
        email: "",
        password:"",
        errorMessage: null
    }

    doLogin = () => {
        
        const { email, password } = this.state;

        firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(error => this.setState({ errorMessage: error.message }));
    }

    resetPassword = () => {
        this.props.navigation.navigate('Reset')
    }
    
    register = () => {
        this.props.navigation.navigate("Register")
    }
    
    render() {
        return (
            // This is the overall screen view
            <KeyboardAvoidingView style={styles.container}>
                <LinearGradient colors={['rgba(17, 236, 193, 0.8)', 'transparent']} style={styles.background}>                
                    <Text style={styles.header}> Log in to your account </Text>
                    
                    <View>
                        {this.state.errorMessage && <Text style={{color:'red', fontSize:16}}>{this.state.errorMessage}</Text>}
                    </View>

                <View style={{marginHorizontal: 32}}>
                    <Text style={styles.subheader}> Email Address </Text>
                    <TextInput style={styles.input} placeholder="Email" onChangeText={email => this.setState({email})} value={this.state.email}></TextInput>

                    <Text style={styles.subheader}> Password </Text>
                    <TextInput style={styles.input} secureTextEntry placeholder="Password" onChangeText={password => this.setState({password})} value={this.state.password}></TextInput>

                    <View style={{alignItems:'center'}}>
                        <TouchableOpacity onPress={this.doLogin} style={styles.button}>
                            <Text style={{color:'black', textAlign:'center', fontWeight:'bold', fontSize:20}}> Login </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.register}>
                            <Text style={{marginTop: 10, color:'black',fontSize: 13, textAlign:'center'}}>Don't have an account? <Text style={{color:'#1232ff'}}>Sign Up</Text></Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.resetPassword}>
                            <Text style={{marginTop: 20, color:'black',fontSize: 13, textAlign:'center'}}>Forgotten your password? <Text style={{color:'#1232ff'}}>Reset Here</Text></Text>
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
        fontSize: 35,
        color: "black",
        marginBottom:50,       
    },

    subheader: {
        fontWeight: "800",
        fontSize: 25,
        color: "#514E5A",
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