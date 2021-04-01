import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Alert, ScrollView, StatusBar, Platform, Dimensions } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import * as firebase from 'firebase';
import {LinearGradient} from 'expo-linear-gradient';

const trueWidth = Dimensions.get('window').width;
const inputWidth = Dimensions.get('window').width * .7;
const pickerWidth = Dimensions.get('window').width * 5;

export default class NewUserScreen extends React.Component {
    state = {
        email: "",
        displayName: "",
        uid: "",
        weight:0,
        height:0,
        gender:"",
        age:0,
        activityLevel:0,
        goalWeight:0
    }

    componentDidMount() {
        const { email, displayName, uid } = firebase.auth().currentUser;
        this.setState({ email, displayName, uid});
    }

    // Pushes form data to the firebase database 
    submit = async() => {
        if(this.state.age == '' || this.state.weight == '' || this.state.height == '' || this.state.activityLevel == '' || this.state.gender == '' || this.state.goalWeight == ''){
            Alert.alert('Please complete the form');
            return;
        }
        var total = await this.calculateTDEE();
        var dGoal = total - 600
        var wGoal = dGoal * 7;
        let userID = this.state.uid;
        const updates = {
            "displayName": this.state.displayName,
            "email": this.state.email,
            "age": this.state.age,
            "weight": this.state.weight,
            "height": this.state.height,
            "gender": this.state.gender,
            "activity": this.state.activityLevel,
            "goalWeight": this.state.goalWeight,
            "TDEE": Math.round(total),
            "dailyGoal": Math.round(dGoal),
            "weeklyGoal": Math.round(wGoal)
        }       
        //console.log(updates);
        firebase.database().ref(`Users/`+userID).update(updates);
        this.props.navigation.navigate('Tabs');      
    }

    calculateTDEE = () => {
        var w = this.state.weight;
        var h = this.state.height;
        var a = this.state.age;
        var aL = this.state.activityLevel;

        if(this.state.gender == 'Male'){
            var bmr = (w * 10) + (h * 6.25) - (a * 5) + 5
        } if(this.state.gender == 'Female'){
            var bmr = (w * 10) + (h * 6.25) - (a * 5) - 161
        }

        var tdee = bmr * aL;
        return tdee;
    }

    signOut = () => {
        firebase.auth().signOut();
    };

    render() {
        return (
            
            <KeyboardAvoidingView style={styles.container} behavior={Platform.select({android: undefined, ios: 'padding'})}>
            
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{flex:.5, paddingTop:StatusBar.currentHeight, backgroundColor:'#007AAF', width: trueWidth, borderBottomLeftRadius:30, borderBottomRightRadius:30, justifyContent:'center'}}>
                    <Text style={{fontSize:50, color:'white', textAlign:'center', paddingBottom:20, alignSelf:'center'}}>Enter Details</Text>
                </View>
                <View style={{marginHorizontal: 32, flex:1, alignContent:'center'}}>
 
                <Text style={styles.header}> Weight (kg) </Text>
                <TextInput style={styles.input} placeholder="Weight" onChangeText={weight => this.setState({weight})} value={this.state.weight}></TextInput>

                <Text style={styles.header}> Age </Text>
                <TextInput style={styles.input} placeholder="Age" onChangeText={age => this.setState({age})} value={this.state.age}></TextInput>

                <Text style={styles.header}> Height </Text>
                <TextInput style={styles.input} placeholder="Height" onChangeText={height => this.setState({height})} value={this.state.height}></TextInput>

                <Text style={styles.header}>Activity Level</Text>
                <Picker
                selectedValue={this.state.activityLevel}
                style={{height: 50, width:300, color:'black', alignSelf:'center'}}
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
                style={{height: 50, width: 300, color:'black', alignSelf:'center'}}
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
                        <Text style={{color:'white', textAlign:'center', fontWeight:'bold', fontSize:20}}> Proceed </Text>
                        
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.signOut} style={styles.button}>
                        <Text style={{color:'orange', textAlign:'center', fontWeight:'bold', fontSize:20}}> Log Out </Text>
                        
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
    },
    header: {
        fontWeight: "800",
        fontSize: 25,
        marginTop: 5,
        color:'black', 
        alignSelf:'center'
    },
    input: {
        marginTop: 3,
        height: 50,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'black',
        borderRadius:30,
        paddingHorizontal: 16,
        color: 'black',
        alignSelf:'center',
        width: inputWidth
        
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
