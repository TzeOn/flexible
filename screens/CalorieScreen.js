import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, StatusBar, Dimensions, ScrollView } from 'react-native';
import * as firebase from 'firebase';
import {LinearGradient} from 'expo-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const cardHeight = Dimensions.get('window').height * 0.15;
const cardWidth = Dimensions.get('window').width * 0.95;

export default class CalorieScreen extends React.Component {
    state = {
        email: "",
        displayName: "",
        uid: "",
        weight:"",
        height:"",
        age:"",
        gender:"",
        activityLevel:"",
        date: new Date().toDateString(),
        calories:"700",
        dailyGoal:'',
        weeklyGoal:"",
        weeklyCalories:"",
        protein:"",
        fill:""

    }

    componentDidMount() {
        const { email, displayName, uid } = firebase.auth().currentUser;
        this.setState({ email, displayName, uid});

        // Listens to the database and retrieves required values, then appends these values to the corresponding state
        // Data is returned as a snapshot, all child nodes of 'Users/uid' are returned
        // child nodes are filtered using if statements where the states are set using the value of each child snapshot
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
            if(childSnapshot.key == 'dailyGoal'){
                this.setState({dailyGoal: childSnapshot.val()})
            }
            if(childSnapshot.key == 'weeklyGoal'){
                this.setState({weeklyGoal: childSnapshot.val()})
            }
            if(childSnapshot.key == 'goalWeight'){
                this.setState({goalWeight: childSnapshot.val()})
            }
        })
        });      
    }

    signOut = () => {
        firebase.auth().signOut();
    };

    getFill = () => {
        var cal = parseInt(this.state.calories, 10);
        var max = parseInt(this.state.dailyGoal, 10);
        let res = (cal/max) * 100;

        // only setState if real number, and state is currently empty
        // Will only set the state once when the page renders
        if(res.toString() != 'NaN' && this.state.fill == ""){
            this.setState({fill: res});
        }
    };

    getRemainingDay = () => {
        var max = parseInt(this.state.dailyGoal, 10);
        var cal = parseInt(this.state.calories, 10);

        var res = max - cal
        return Math.round(res);
    };

    getRemainingWeekly = () => {
        var max = parseInt(this.state.weeklyGoal, 10);
        var cal = parseInt(this.state.calories, 10);

        var res = max - cal
        return Math.round(res);
    };

    getProtein = () => {
        var w = parseInt(this.state.weight, 10);
        var p = w * 1.6;

        return Math.round(p);
    };

    render() {
        this.getFill()
        return (
            <View style={{flex:1}}>
                <LinearGradient colors={['rgba(17, 236, 193, 0.8)', 'transparent']} style={styles.background}>
                    <View style={styles.card}>
                        <Text style={styles.header}>Tracking</Text>
                    </View>
                    <View style={{flex:1, borderBottomColor:'black', borderBottomWidth:1, paddingBottom:70}}>
                        <Text style={{fontSize:22, paddingBottom:15, textAlign:'center', fontWeight:'bold'}}>{this.state.date}</Text>
                        <View style={{flexDirection:'row', flex:1, width:'100%'}}>
                            <View style={{flexDirection:'column', flex:0.33}}>
                                <Text style={{textAlign:'center', fontSize:20, borderBottomColor:'white', borderBottomWidth:1,}}>Goal</Text>
                                <Text style={{textAlign:'center', fontSize:25}}>{Math.round(this.state.dailyGoal, 10)}</Text>

                                <Text></Text>
                                <Text></Text>
                                <Text></Text>
                                
                                <Text style={{textAlign:'center', fontSize:20, borderBottomColor:'white', borderBottomWidth:1, textAlignVertical:'bottom'}}>Weekly</Text>
                                <Text style={{textAlign:'center', fontSize:20, textAlignVertical:'bottom'}}>{Math.round(this.state.weeklyGoal,10)}</Text>
                            </View>

                        <AnimatedCircularProgress
                        size={180}
                        width={5}
                        fill={this.state.fill}
                        rotation={360}
                        tintColor="#00e0ff"
                        backgroundColor="#fff">
                            {
                                (fill) => (
                                    <Text style={{color:'#009b00', fontSize:40}}> {this.state.calories}</Text>
                                )
                            }
                        </AnimatedCircularProgress>
                            <View style={{flexDirection:'column', flex:0.33}}>
                                <Text style={{fontSize:16, textAlign:'center', borderBottomColor:'white', borderBottomWidth:1}}>Remaining</Text>
                                <Text style={{textAlign:'center', fontSize:25}}>{this.getRemainingDay()}</Text>

                                <Text></Text>
                                <Text></Text>
                                <Text></Text>
                                
                                <Text style={{textAlign:'center', fontSize:14, borderBottomColor:'white', borderBottomWidth:1}}>Weekly Remaining</Text>
                                <Text style={{textAlign:'center', fontSize:20,}}>{this.getRemainingWeekly()}</Text>
                            </View>

                        </View>
                    </View>

                    <View style={{flex:1, flexDirection:'row', width:'85%', borderBottomColor:'grey', borderBottomWidth:1}}>
                        <View style={{flex:0.33, flexDirection:'column'}}>
                            <Text></Text>
                            <Text style={{paddingTop:10, fontSize:20, fontWeight:'bold', textAlign:'left'}}>Protein</Text>
                            <Text style={{paddingTop:10, fontSize:20, fontWeight:'bold', textAlign:'left'}}>Carbs</Text>
                            <Text style={{paddingTop:10, fontSize:20, fontWeight:'bold', textAlign:'left'}}>Fat</Text>
                        </View>         
                        <View style={{flex:0.33, flexDirection:'column'}}>
                            <Text style={{paddingTop:10, fontSize:14, fontWeight:'bold', textAlign:'center'}}>Current</Text>
                            <Text style={{fontSize:20, fontWeight:'bold', textAlign:'center', color:'#009b00'}}>X</Text>
                            <Text style={{paddingTop:10, fontSize:20, fontWeight:'bold', textAlign:'center', color:'#009b00'}}>X</Text>
                            <Text style={{paddingTop:10, fontSize:20, fontWeight:'bold', textAlign:'center', color:'#009b00'}}>X</Text>
                        </View>  
                        <View style={{flex:0.33, flexDirection:'column'}}>
                            <Text style={{paddingTop:10, fontSize:14, fontWeight:'bold', textAlign:'center'}}>Goal</Text>
                            <Text style={{fontSize:20, fontWeight:'bold', textAlign:'center'}}>{this.getProtein()}</Text>
                            <Text style={{paddingTop:10, fontSize:20, fontWeight:'bold', textAlign:'center'}}>Y</Text>
                            <Text style={{paddingTop:10, fontSize:20, fontWeight:'bold', textAlign:'center'}}>Y</Text>
                        
                        </View>             
                    </View>
                    
                    <View style={{flex:1}}>
                        <Text style={{textAlign:'center', fontSize:20, fontWeight:'bold', paddingBottom:10}}> Personal Goals </Text>
                        <View style={{flexDirection:'row', width:'85%'}}>
                            <View style={{flex:0.5, flexDirection:'column'}}>
                                <Text style={{textAlign:'center', fontSize:16}}>Goal Weight</Text>
                                <Text style={{textAlign:'center', color:'#009b00', fontSize:20}}>{this.state.goalWeight}kg</Text>
                            </View>

                            <View style={{flex:0.5, flexDirection:'column'}}>
                                <Text style={{textAlign:'center', fontSize:16}}>Weeks Remaining</Text>
                                <Text style={{textAlign:'center', fontSize:20}}>Y</Text>
                            </View>

                        </View>

                        <View style={{flex:1, paddingTop:20}}>
                            <Text style={{textAlign:'center', fontSize:10, color:'blue'}}>{this.state.uid}</Text>
                        </View>
                    </View>

                </LinearGradient>
            </View>
        );
    }
}

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
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#BAB7C3',
        color: '#fff',
        textAlign:'center'
    },
    header: {
        fontWeight: "bold",
        fontSize: 30,
        color: "black", 
    },
    card: {
        marginTop: StatusBar.currentHeight,
        backgroundColor: '#f9f1f1',
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
        borderColor:'grey'       
    },
});
