import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import * as firebase from 'firebase';
import {LinearGradient} from 'expo-linear-gradient';

export default class NewUserScreen extends React.Component {
    state = {
        email: "",
        displayName: "",
        uid: "",
        weight:"",
        height:"",
        gender:"",
        age:"",
        activityLevel:""
    }

    componentDidMount() {
        const { email, displayName, uid } = firebase.auth().currentUser;
        this.setState({ email, displayName, uid});
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container}>
            <LinearGradient colors={['rgba(139, 59, 252, 1)', 'rgba(226,108,234,1)']} style={styles.background}>
            <View style={{marginHorizontal: 32}}>

                <Text style={styles.header}> Weight (kg) </Text>
                <TextInput style={styles.input} placeholder="Weight" onChangeText={weight => this.setState({weight})} value={this.state.weight}></TextInput>

                <Text style={styles.header}> Age </Text>
                <TextInput style={styles.input} placeholder="Age" onChangeText={age => this.setState({age})} value={this.state.age}></TextInput>

                <Text style={styles.header}> Height </Text>
                <TextInput style={styles.input} placeholder="Height" onChangeText={height => this.setState({height})} value={this.state.height}></TextInput>

                <Text style={styles.header}>Activity Level</Text>
                <Picker
                selectedValue={this.state.activityLevel}
                style={{height: 50, width:'100%', color:'#8B3BFC'}}
                onValueChange={(itemValue, itemIndex) =>
                    this.setState({activityLevel: itemValue})
                }>
                <Picker.Item label="Sedentary" value="1.2" />
                <Picker.Item label="Lightly Active" value="1.375" />
                <Picker.Item label="Moderately Active" value="1.55" />
                <Picker.Item label="Very Active" value="1.725" />
                <Picker.Item label="Extremely Active" value="1.9" />
                </Picker>

                <Text style={styles.header}>Gender</Text>
                <Picker
                selectedValue={this.state.gender}
                style={{height: 50, width: '100%', color:'#8B3BFC'}}
                onValueChange={(itemValue, itemIndex) =>
                    this.setState({gender: itemValue})
                }>
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                </Picker>

                <View style={{alignItems:'center'}}>
                    <TouchableOpacity onPress={this.registerUser} style={styles.button}>
                        <Text style={{color:'black', textAlign:'center', fontWeight:'bold', fontSize:20}}> Proceed </Text>
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
