import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, Platform, Dimensions, FlatList } from 'react-native';
import * as firebase from 'firebase';

const cardHeight = Dimensions.get('window').height * 0.10;
const cardWidth = Dimensions.get('window').width * 0.95;
const modalHeight = Dimensions.get('window').height * 0.85;

// This page checks whether the user logging in is a new or previous user to navigate them to the correct page
export default class ExerciseScreen extends React.Component {

    // Holding the current user's email, name and user ID
    state = {
        email: "",
        displayName: "",
        uid: ""
    }

    componentDidMount() {
        const { email, displayName, uid } = firebase.auth().currentUser;
        this.setState({ email, displayName, uid});
    }

    // UI render
    render() {
        return (
            <View style={{flex:1, alignContent:'center'}}>
                <View style={styles.card}>
                    <Text style={{fontSize:35, fontWeight:'bold', color:'#007AFF', textAlign:'center', paddingBottom:10}}> Exercises </Text>
                </View>
                <View style={{flex:1, flexDirection:'row', width:cardWidth, alignSelf:'center', justifyContent:'space-evenly'}}>
                    <TouchableOpacity style={{flex:.45, backgroundColor:'#007AFF', borderRadius:10, height:30, justifyContent:'center'}}>
                        <Text style={{textAlign:'center', fontSize:16, color:'#f6f8fa', textAlignVertical:'center', fontWeight:'bold'}}>My Programs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:.45, backgroundColor:'#007AFF', borderRadius:10, height:30, justifyContent:'center'}}>
                        <Text style={{textAlign:'center', fontSize:16, color:'#f6f8fa', textAlignVertical:'center', fontWeight:'bold'}}>Find Programs</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1}}>

                </View>
            </View>
        );
    }
}

// Page styling components
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
    },
    card: {
        marginTop: StatusBar.currentHeight,
        backgroundColor: '#f6f8fa',
        borderRadius:10,
        width:cardWidth,
        marginRight:5,
        marginLeft:5,
        // flex:1,
        height:cardHeight,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:5,
        borderWidth:1,
        borderColor:'grey',
        alignSelf:'center'     
    },
});