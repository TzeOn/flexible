import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Alert, ScrollView, StatusBar, Platform } from 'react-native';
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
        activityLevel:"",
        goalWeight:""
    }

    componentDidMount() {
        const { email, displayName, uid } = firebase.auth().currentUser;
        this.setState({ email, displayName, uid});
    }

    // Pushes form data to the firebase database 
    submit = () => {
        if(this.state.age == '' || this.state.weight == '' || this.state.height == '' || this.state.activityLevel == '' || this.state.gender == '' || this.state.goalWeight == ''){
            Alert.alert('Please complete the form');
            return;
        }
        var total = this.calculateTDEE();

        let userID = this.state.uid;
        const updates = {
            "name": this.state.displayName,
            "email": this.state.email,
            "age": this.state.age,
            "weight": this.state.weight,
            "height": this.state.height,
            "gender": this.state.gender,
            "activity": this.state.activityLevel,
            "goalWeight": this.state.goalWeight,
            "TDEE": Math.round(total),
        }       
        //console.log(updates);
        firebase.database().ref(`Users/`+userID).set(updates);
        this.props.navigation.navigate('CalorieScreen');      
    }

    calculateTDEE = () => {
        var w = parseInt(this.state.weight, 10);
        var h = parseInt(this.state.height, 10);
        var a = parseInt(this.state.age, 10);
        var aL = parseInt(this.state.activityLevel, 10);

        if(this.state.gender == 'Male'){
            var bmr = (w * 10) + (h * 6.25) - (a * 5) + 5
        } if(this.state.gender == 'Female'){
            var bmr = (w * 10) + (h * 6.25) - (a * 5) - 161
        }

        return bmr * aL;
    }

    signOut = () => {
        firebase.auth().signOut();
    };

    render() {
        return (
            
            <KeyboardAvoidingView style={styles.container} behavior={Platform.select({android: undefined, ios: 'padding'})}>
            <LinearGradient colors={['rgba(17, 236, 193, 0.8)', 'transparent']} style={styles.background}>
            <View style={{marginHorizontal: 32}}>
                <ScrollView showsVerticalScrollIndicator={false}>

                <Text style={{fontSize:30, textAlign:'center', fontWeight:'bold', paddingBottom:20}}>Enter Fitness Details</Text>
                <Text style={styles.header}> Weight (kg) </Text>
                <TextInput style={styles.input} placeholder="Weight" onChangeText={weight => this.setState({weight})} value={this.state.weight}></TextInput>

                <Text style={styles.header}> Age </Text>
                <TextInput style={styles.input} placeholder="Age" onChangeText={age => this.setState({age})} value={this.state.age}></TextInput>

                <Text style={styles.header}> Height </Text>
                <TextInput style={styles.input} placeholder="Height" onChangeText={height => this.setState({height})} value={this.state.height}></TextInput>

                <Text style={styles.header}>Activity Level</Text>
                <Picker
                selectedValue={this.state.activityLevel}
                style={{height: 50, width:200, color:'black'}}
                onValueChange={(itemValue, itemIndex) =>
                    this.setState({activityLevel: itemValue})
                }>
                <Picker.Item label="Select activity level" value="" />
                <Picker.Item label="Sedentary" value="1.2" />
                <Picker.Item label="Lightly Active" value="1.375" />
                <Picker.Item label="Moderately Active" value="1.55" />
                <Picker.Item label="Very Active" value="1.725" />
                <Picker.Item label="Extremely Active" value="1.9" />
                </Picker>

                <Text style={styles.header}>Gender</Text>
                <Picker
                selectedValue={this.state.gender}
                style={{height: 50, width: 200, color:'black'}}
                onValueChange={(itemValue, itemIndex) =>
                    this.setState({gender: itemValue})
                }> 
                <Picker.Item label="Select gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                </Picker>

                <Text style={styles.header}> Goal Weight </Text>
                <TextInput style={styles.input} placeholder="Goal Weight" onChangeText={goalWeight => this.setState({goalWeight})} value={this.state.goalWeight}></TextInput>

                <View style={{alignItems:'center'}}>
                    <TouchableOpacity onPress={this.submit} style={styles.button}>
                        <Text style={{color:'black', textAlign:'center', fontWeight:'bold', fontSize:20}}> Proceed </Text>
                        
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.signOut} style={styles.button}>
                        <Text style={{color:'red', textAlign:'center', fontWeight:'bold', fontSize:20}}> Log Out </Text>
                        
                    </TouchableOpacity>
                </View>
                </ScrollView>
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
        color:'black',
        
    },
    input: {
        marginTop: 3,
        height: 50,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'black',
        borderRadius:30,
        paddingHorizontal: 16,
        color: '#000'
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
        width: '100%',
        paddingTop: StatusBar.currentHeight,
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
