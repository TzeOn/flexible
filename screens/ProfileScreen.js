import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity,ScrollView, Dimensions, StatusBar, Alert, Modal, Pressable } from 'react-native';
import * as firebase from 'firebase';
import {LinearGradient} from 'expo-linear-gradient';
import {Picker} from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const cardHeight = Dimensions.get('window').height * 0.15;
const cardWidth = Dimensions.get('window').width * 0.95;
const modalHeight = Dimensions.get('window').height * 0.85

export default class ProfileScreen extends React.Component {

    state = {
        email: "",
        displayName: "",
        uid: "",
        weight:"",
        height:"",
        age:"",
        gender:"",
        activityLevel:"",
        modalVisible: false,
        
    }

    // Fetch user data from firebase when loaded up
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
    
    // Change visibility of modal
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
      }

    // Sign out function
    signOut = () => {
        firebase.auth().signOut();
    };

    // Function to confirm user logout, prompts user with an alert to confirm or cancel
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
    
    // Update the user profile with updated data, recalculate TDEE and goals
    update = () => {
        if(this.state.age == '' || this.state.weight == '' || this.state.height == '' || this.state.activityLevel == '' || this.state.gender == ''){
            alert('Please complete the form');
            return;
        }
        let total = Math.round(this.calculateTDEE());
        let dGoal = Math.round(total - 600);
        let wGoal = Math.round(dGoal *7);
        let userID = this.state.uid;
        const updates = {
            "age": this.state.age,
            "weight": this.state.weight,
            "height": this.state.height,
            "gender": this.state.gender,
            "activity": this.state.activityLevel,
            "TDEE": total,
            "dailyGoal": dGoal,
            "weeklyGoal": wGoal
        }       

        firebase.database().ref(`Users/`+userID).update(updates);
        Alert.alert("Changes successful");
        this.setModalVisible(!this.state.modalVisible)
    }
    
    // Function to calculate TDEE of the user
    calculateTDEE = () => {
        var w = this.state.weight;
        var h = this.state.height;
        var a = this.state.age
        var aL = this.state.activityLevel;

        if(this.state.gender == 'Male'){
            var bmr = (w * 10) + (h * 6.25) - (a * 5) + 5
        } if(this.state.gender == 'Female'){
            var bmr = (w * 10) + (h * 6.25) - (a * 5) - 161
        }

        var tdee = bmr * aL;
        return tdee;
    }

    // Alert popup to confirm that the user wishes to permanently delete their account from firebase
    confirmDelete = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you wish to permanently delete your account?',
            [
                {
                    text:'Cancel',
                    style:'cancel'
                },
                {
                    text:'Delete',
                    onPress: () => {firebase.auth().delete()}
                }
            ]
        )
    }

    // UI render
    render() {
        const { modalVisible } = this.state;
        return (           
            <View style={styles.container}>
                <ScrollView>
                    <View style={{flex:1}}>

                    {/*
                    Code for the popup Modal, contains form which allows user to change their details
                    */}
                    <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(!modalVisible);
                    }}
                    >
                    <View style={{flex:1}}>
                        <View style={styles.modalView}>                      
                        <View style={{marginHorizontal: 32}}>

                            <Text style={styles.header}> Weight (kg) </Text>
                            <TextInput style={styles.input} placeholder={this.state.weight} onChangeText={weight => this.setState({weight})} value={this.state.weight}></TextInput>

                            <Text style={styles.header}> Age </Text>
                            <TextInput style={styles.input} placeholder={this.state.age} onChangeText={age => this.setState({age})} value={this.state.age}></TextInput>

                            <Text style={styles.header}> Height </Text>
                            <TextInput style={styles.input} placeholder={this.state.height} onChangeText={height => this.setState({height})} value={this.state.height}></TextInput>

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


                            <View style={{flexDirection:'row'}}>
                                <TouchableOpacity onPress={this.update} style={styles.buttonRows}>
                                    <Text style={{color:'black', textAlign:'center', fontWeight:'bold', fontSize:20}}> Update </Text>                                 
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setModalVisible(!modalVisible)} style={styles.buttonRows}>
                                    <Text style={{color:'black', textAlign:'center', fontWeight:'bold', fontSize:20}}> Close </Text>                                 
                                </TouchableOpacity>
                            </View>
                        </View>
                        </View>
                    </View>
                    </Modal>

                    {/*
                    Start of Profile screen without the Modal
                    Displays User details
                    */}
                    <View elevation={3} style={styles.card}>
                        <Text style={styles.header}> {this.state.displayName} </Text>
                    </View>
                    <View style={styles.cardContainer}>
                    <View style={{flex:1}}>
                        <Text style={{fontSize:30, paddingLeft:20}}>Account Details</Text>
                    </View>
                    <View style={styles.rowView}> 
                        <Text style={styles.row1}>Name</Text>
                        <Text style={styles.row2}>{this.state.displayName}</Text>
                    </View>
                    <View style={styles.rowView}> 
                        <Text style={styles.row1}>Email</Text>
                        <Text style={styles.row2}>{this.state.email}</Text>
                    </View>
                    </View>

                    <View style={styles.cardContainer}>
                    <View style={{flexDirection:'row', flex:1 }}>
                        <Text style={{flex:.9, fontSize:30, paddingLeft:20, alignSelf:'flex-start'}}>Personal Details</Text>
                        <TouchableOpacity style={{alignSelf:'center', flex:0.1, }} onPress ={() => this.setModalVisible(true)}>
                            <MaterialCommunityIcons  name="pencil" color={'#007AAF'} size={30} />
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
                    </View>
                    <View style={{paddingTop:10}}>
                        <TouchableOpacity style={styles.button2} onPress={() => this.confirmDelete()}>
                            <Text style={{color:'white', fontSize: 20, alignSelf:'center', textAlign:'center', fontWeight:'bold'}}>Delete Account</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{paddingTop:50}}>
                        <TouchableOpacity style={styles.button} onPress={() => this.confirm()}>
                            <Text style={{color:'white', fontSize: 20, alignSelf:'center', textAlign:'center', fontWeight:'bold'}}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                </ScrollView>
            </View>
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
        backgroundColor: '#007AFF',
        borderRadius:20,
        height: 52,
        width: '80%',
        alignSelf:'center',
        marginTop:30,
        justifyContent:'center',
        borderColor:'grey',
        borderWidth:1
    },
    button2: {
        marginHorizontal:30,
        backgroundColor: 'red',
        borderRadius:20,
        height: 32,
        width: '50%',
        alignSelf:'center',
        justifyContent:'center',
        borderColor:'grey',
        borderWidth:1
    },
    header: {
        fontWeight: "bold",
        fontSize: 35,
        color: "#007AFF", 
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
        color: '#000'
    },
    card: {
        marginTop: StatusBar.currentHeight,
        backgroundColor: '#f6f8fa',
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
        marginBottom:5,
        paddingLeft:5
    },
    row2: {
        fontSize:20,
        alignSelf:'flex-start',
        flex:.8
    },
    modalView: {
        margin: 20,
        backgroundColor: "#E0FFF9",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: modalHeight,
      },
    buttonRows: {
        backgroundColor: '#fff',
        borderRadius:20,
        height: 52,
        width: '50%',
        alignSelf:'center',
        marginTop:30,
        justifyContent:'center',
        borderColor:'grey',
        borderWidth:1
    },
    left: {
        left:10
    },
    right: {
        right:10
    },
    cardContainer: {
        flex:1, 
        borderBottomColor:'black', 
        borderWidth:1,
        paddingBottom:10, 
        borderRadius:10, 
        width:cardWidth, 
        backgroundColor:'#f6f8fa',
        alignSelf:'center',
        marginTop:10
    }
});