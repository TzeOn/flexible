import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity,ScrollView, Dimensions, StatusBar, Alert } from 'react-native';
import * as firebase from 'firebase';
import {LinearGradient} from 'expo-linear-gradient';

const cardHeight = Dimensions.get('window').height * 0.15;
const cardWidth = Dimensions.get('window').width * 0.95;
// This page checks whether the user logging in is a new or previous user to navigate them to the correct page
export default class ProfileScreen extends React.Component {

    // Holding the current user's email, name and user ID
    state = {
        email: "",
        displayName: "",
        uid: "",
        weight:"",
        height:"",
        age:"",
        gender:"",
        activityLevel:"",
        
    }

    componentDidMount() {
        const { email, displayName, uid } = firebase.auth().currentUser;
        this.setState({ email, displayName, uid});

        var ref = firebase.database().ref('Users/' + uid);
        ref.once('value', (snapshot) => {
        const data = snapshot.val();
        snapshot.forEach((childSnapshot) => {
            if(childSnapshot.key == 'weight'){
                this.setState({weight: childSnapshot.val()})
            }
            if(childSnapshot.key == 'height'){
                this.setState({height: childSnapshot.val()})
            }
            if(childSnapshot.key == 'age'){
                this.setState({age: childSnapshot.val()})
            }
            if(childSnapshot.key == 'gender'){
                this.setState({gender: childSnapshot.val()})
            }
            if(childSnapshot.key == 'activity'){
                this.setState({activityLevel: childSnapshot.val()})
            }
        })
        });
    }
    
    signOut = () => {
        firebase.auth().signOut();
    };

    confirm = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you wish to sign out of your account?',
            [
                {
                    text:'Cancel',
                    style:'cancel'
                },
                {
                    text:'Sign Out',
                    onPress: () => {firebase.auth().signOut()}
                }
            ]
        )
    }
    
    
    // UI render
    render() {
        return (
            
            //<View style={[styles.container]}>
            <LinearGradient colors={['rgba(17, 236, 193, 0.8)', 'transparent']} style={styles.background}>
                <ScrollView>
                    <View style={{flex:1}}>
                        <View elevation={6} style={styles.card}>
                            <Text style={styles.header}> {this.state.displayName} </Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={{fontSize:30, borderColor:'white', borderBottomWidth:4, borderTopWidth:4, paddingLeft:20}}>Account Details</Text>
                        </View>
                        <View style={styles.rowView}> 
                            <Text style={styles.row1}>Name</Text>
                            <Text style={styles.row2}>{this.state.displayName}</Text>
                        </View>
                        <View style={styles.rowView}> 
                            <Text style={styles.row1}>Email</Text>
                            <Text style={styles.row2}>{this.state.email}</Text>
                        </View>
                        <View style={{flexDirection:'row', flex:1, borderColor:'white', borderBottomWidth:4, borderTopWidth:4}}>
                            <Text style={{flex:.9, fontSize:30, paddingLeft:20, alignSelf:'flex-start'}}>Personal Details</Text>
                            <TouchableOpacity style={{alignSelf:'center', flex:0.1, }}>
                                <Text style={{color:'blue'}}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rowView}> 
                            <Text style={styles.row1}>Gender</Text>
                            <Text style={styles.row2}>{this.state.gender}</Text>
                        </View>
                        <View style={styles.rowView}> 
                            <Text style={styles.row1}>Weight</Text>
                            <Text style={styles.row2}>{this.state.weight} kg</Text>
                        </View>
                        <View style={styles.rowView}> 
                            <Text style={styles.row1}>Height</Text>
                            <Text style={styles.row2}>{this.state.height} cm</Text>
                        </View>
                        <View style={styles.rowView}> 
                            <Text style={styles.row1}>Age</Text>
                            <Text style={styles.row2}>{this.state.age}</Text>
                        </View>
                        <View style={styles.rowView}> 
                            <Text style={styles.row1}>Activity</Text>
                            <Text style={styles.row2}>{this.state.activityLevel}</Text>
                        </View>

                        <View style={{paddingTop:100}}>
                            <TouchableOpacity style={styles.button} onPress={this.confirm}>
                                <Text style={{color:'black', fontSize: 20, alignSelf:'center', textAlign:'center'}}>Sign Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
            //</View>

        );
    }
}

// Page styling components
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // paddingTop: StatusBar.currentHeight,
    },
    background: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        width: '100%',
        
    },
    button: {
        marginHorizontal:30,
        backgroundColor: '#fff',
        borderRadius:20,
        height: 52,
        width: '80%',
        alignSelf:'center',
        marginTop:30,
        justifyContent:'center',
        borderColor:'grey',
        borderWidth:1
    },
    header: {
        fontWeight: "bold",
        fontSize: 30,
        color: "black", 
    },
    subheader: {
        fontWeight: "800",
        fontSize: 25,
        color: "#514E5A",
        marginTop: 5,
        color:'black',
    },
    info: {
        fontWeight: "800",
        fontSize:15,
        color:'black',
        marginTop:5
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
    card: {
        marginTop: StatusBar.currentHeight,
        backgroundColor: '#FFFAF0',
        borderRadius:10,
        width:cardWidth,
        marginRight:5,
        marginLeft:5,
        flex:1,
        height:cardHeight,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:5,
        borderWidth:1,
        borderColor:'grey'       
    },
    rowView: {
        flexDirection:'row',
        flex:1
    },
    row1: {
        fontSize:20, 
        alignSelf:'flex-start', 
        flex:.3,
        marginBottom:5
    },
    row2: {
        fontSize:20,
        alignSelf:'flex-start',
        flex:.8
    }
});