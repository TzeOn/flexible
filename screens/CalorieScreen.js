import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, StatusBar, Dimensions, ScrollView, Modal, Alert } from 'react-native';
import * as firebase from 'firebase';
import {LinearGradient} from 'expo-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const cardHeight = Dimensions.get('window').height * 0.15;
const cardWidth = Dimensions.get('window').width * 0.95;
const modalHeight = Dimensions.get('window').height * 0.85;

export default class CalorieScreen extends React.Component {
    state = {
        email: "",
        displayName: "",
        uid: "",
        weight:0,
        height:0,
        age:0,
        gender:"",
        activityLevel:0,
        date: new Date().toDateString(),
        calories:0,
        dailyGoal:'',
        weeklyGoal:"",
        weeklyCalories:"",
        protein:"",
        fill:0,
        TDEE:"",
        deficit:0,
        weeks:0,
        goalWeight:0,
        modalVisible:false,
        reset:false,

    }

    async componentDidMount() {
        const { email, displayName, uid } = firebase.auth().currentUser;
        this.setState({ email, displayName, uid});
        var newDay = new Date().getDay();
        

        var fff = this.getFill()
        // Listens to the database and retrieves required values, then appends these values to the corresponding state
        // Data is returned as a snapshot, all child nodes of 'Users/uid' are returned
        // child nodes are filtered using if statements where the states are set using the value of each child snapshot
        
        var ref = firebase.database().ref('Users/' + uid);
        await ref.once('value', (snapshot) => {
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
            if(childSnapshot.key == 'goalWeight'){
                this.setState({goalWeight: childSnapshot.val()})
            }
            if(childSnapshot.key == 'TDEE'){
                this.setState({TDEE: childSnapshot.val()})
            }
        })
        }); 
        
        var weeklyCaloriesRef = firebase.database().ref('Users/' + uid + '/week/');
        await weeklyCaloriesRef.once('value', (snapshot) => {
            var weekTotal=0;
         
            snapshot.forEach((day) => {
                day.forEach((entry) => {
                    entry.forEach((item) => {
                        if(item.key == 'calories'){
                            weekTotal += item.val()
                        }
                    })
                })
            })
            this.setState({weeklyCalories: weekTotal})           
        })

        var dailyRef = firebase.database().ref('Users/' + uid + '/week/' + newDay);
        await dailyRef.once('value', (snapshot) => {
            var dailyTotal=0;
            var dailyProtein=0;
            snapshot.forEach((entry) => {
                entry.forEach((item) => {
                    if(item.key == 'calories'){
                        dailyTotal += item.val()
                    }
                    if(item.key == 'protein'){
                        dailyProtein += item.val()
                    }
                })
            })
            this.setState({calories:dailyTotal})
            this.setState({protein: dailyProtein})
    
        })
    }

    // Change visibility of modal
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    signOut = () => {
        firebase.auth().signOut();
    };

    getFill = () => {
        var cal = parseInt(this.state.calories, 10);
        var max = parseInt(this.getDailyGoal(), 10);
        let res = (cal/max) * 100;
 
        // only setState if real number, and state is currently empty
        // Will only set the state once when the page renders
        if(res.toString() != 'NaN' && this.state.fill == ""){
            this.setState({fill: res});
        }
    };

    getRemainingDay = () => {
        var max = parseInt(this.getDailyGoal(), 10);
        var cal = parseInt(this.state.calories, 10);

        var res = max - cal
        return Math.round(res);
    };

    getRemainingWeekly = () => {
        var max = parseInt(this.getWeeklyGoal(), 10);
        var cal = parseInt(this.state.weeklyCalories, 10);

        var res = max - cal
        return Math.round(res);
    };

    getDailyGoal = () => {
        let w = parseInt(this.state.weight,10);
        let gw = parseInt(this.state.goalWeight,10);
        let total = parseInt(this.state.TDEE,10);

        if(gw < w){
            return total - 600;
        } if(gw == w){
            return total;
        }else {
            return total + 300;
        } 
    }

    getWeeklyGoal = () => {
        return this.getDailyGoal() * 7;
    }

    getProtein = () => {
        var w = parseInt(this.state.weight, 10);
        var p = w * 1.6;

        return Math.round(p);
    };

    getDeficitDifference = () => {
        var totalTDEE = parseInt(this.state.TDEE, 10) * 7;
        var totalWeek = parseInt(this.getWeeklyGoal(), 10);

        var deficit = totalTDEE - totalWeek;

        var poundsDifference = deficit / 3500;
        var kgDifference = poundsDifference * 0.45359237;
        
        return kgDifference;
    }

    getLossEstimate = () => {
        var loss = 0;
        var weeks = 0;
        var targetLoss = parseInt(this.state.weight,10) - parseInt(this.state.goalWeight,10);
        while(loss < targetLoss){
            var temp = this.getDeficitDifference();
            loss = loss + temp;
            weeks++;
        }
        return weeks;
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

        return bmr * aL;
    }

    update = () => {
        if(this.state.weight == '' || this.state.goalWeight == ''){
            alert('Cannot be null');
            return;
        }
        let total = this.calculateTDEE();
        let userID = this.state.uid;
        const updates = {
            "weight": this.state.weight,
            "goalWeight": this.state.goalWeight,
            "TDEE": total,
        }       

        firebase.database().ref(`Users/`+userID).update(updates);
        Alert.alert("Goals updated");
        this.setModalVisible(!this.state.modalVisible)
    }

    getDate = () => {
        let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
        let newDate = date + month + year

        return newDate
    }


    render() {
       // this.getFill()
        const { modalVisible } = this.state;
        return (        
            <View style={{flex:1}}>
                <LinearGradient colors={['rgba(17, 236, 193, 0.8)', 'transparent']} style={styles.background}>
                <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(!modalVisible);
                    }}
                    >
                    <View>
                        <View style={styles.modalView}>                      
                        <View style={{marginHorizontal: 32}}>

                            <Text style={styles.header}> Weight (kg) </Text>
                            <TextInput style={styles.input} placeholder={this.state.weight.toString()} onChangeText={weight => this.setState({weight})} value={this.state.weight.toString()}></TextInput>

                            <Text style={styles.header}> Goal Weight </Text>
                            <TextInput style={styles.input} placeholder={this.state.goalWeight.toString()} onChangeText={goalWeight => this.setState({goalWeight})} value={this.state.goalWeight.toString()}></TextInput>


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
                    </View>


                    <View style={styles.card}>
                        <Text style={styles.header}>Tracking</Text>
                    </View>
                    <View style={{flex:1, borderBottomColor:'black', borderBottomWidth:1, paddingBottom:10}}>
                        <Text style={{fontSize:22, paddingBottom:15, textAlign:'center', fontWeight:'bold'}}>{this.state.date}</Text>
                        <View style={{flexDirection:'row', flex:1, width:'100%'}}>
                            <View style={{flexDirection:'column', flex:0.33}}>
                                <Text style={{textAlign:'center', fontSize:20, borderBottomColor:'white', borderBottomWidth:1,}}>Goal</Text>
                                <Text style={{textAlign:'center', fontSize:25, color:'#009b00'}}>{Math.round(this.getDailyGoal())}</Text>

                                <Text></Text>
                                <Text></Text>
                                <Text></Text>
                                
                                <Text style={{textAlign:'center', fontSize:20, borderBottomColor:'white', borderBottomWidth:1, textAlignVertical:'bottom'}}>Weekly</Text>
                                <Text style={{textAlign:'center', fontSize:20, textAlignVertical:'bottom', color:'#009b00'}}>{Math.round(this.getWeeklyGoal())}</Text>
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
                                    <Text style={{textAlign:'center',color:'grey', fontSize:40}}> {this.state.calories}</Text>
                                )
                            }
                        </AnimatedCircularProgress>
                            <View style={{flex:1,flexDirection:'column', flex:0.33}}>
                                <Text style={{fontSize:16, textAlign:'center', borderBottomColor:'white', borderBottomWidth:1}}>Remaining</Text>
                                <Text style={{textAlign:'center', fontSize:25, color:'orange'}}>{this.getRemainingDay()}</Text>

                                <Text></Text>
                                <Text></Text>
                                <Text></Text>
                                
                                <Text style={{textAlign:'center', fontSize:14, borderBottomColor:'white', borderBottomWidth:1}}>Weekly Remaining</Text>
                                <Text style={{textAlign:'center', fontSize:20, color:'orange'}}>{this.getRemainingWeekly()}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{flexDirection:'row', width:'85%', borderBottomColor:'grey', borderBottomWidth:1, paddingBottom:15}}>
                        <View style={{flex:0.33, flexDirection:'column'}}>
                            <Text></Text>
                            <Text style={{paddingTop:10, fontSize:20, fontWeight:'bold', textAlign:'left'}}>Protein</Text>
                        </View>         
                        <View style={{flex:0.33, flexDirection:'column'}}>
                            <Text style={{paddingTop:10, fontSize:14, fontWeight:'bold', textAlign:'center'}}>Current</Text>
                            <Text style={{fontSize:20, fontWeight:'bold', textAlign:'center', color:'grey'}}>{this.state.protein}</Text>
                        </View>  
                        <View style={{flex:0.33, flexDirection:'column'}}>
                            <Text style={{paddingTop:10, fontSize:14, fontWeight:'bold', textAlign:'center'}}>Goal</Text>
                            <Text style={{fontSize:20, fontWeight:'bold', textAlign:'center', color:'#009b00'}}>{this.getProtein()}</Text>
                        </View>   
                        <View style={{flex:0.33, flexDirection:'column'}}>
                            <Text style={{paddingTop:10, fontSize:14, fontWeight:'bold', textAlign:'center'}}>Remaining</Text>
                            <Text style={{fontSize:20, fontWeight:'bold', textAlign:'center', color:'orange'}}>{this.getProtein() - this.state.protein}</Text>
                        </View>           
                    </View>
                    
                    <View style={{flex:1}}>
                        <Text style={{textAlign:'center', fontSize:22, fontWeight:'bold', paddingBottom:10}}> Personal Goals </Text>
                        <View style={{flexDirection:'row', width:'85%'}}>
                            <View style={{flex:0.33, flexDirection:'column', borderRightWidth:1}}>
                                <Text style={{textAlign:'center', fontSize:16, borderBottomWidth:1}}>Current {'\n'}Weight</Text>
                                <Text style={{textAlign:'center', color:'grey', fontSize:20}}>{this.state.weight}kg</Text>
                            </View>

                            <View style={{flex:0.33, flexDirection:'column', borderRightWidth:1}}>
                                <Text style={{textAlign:'center', fontSize:16, borderBottomWidth:1}}>Goal {'\n'}Weight</Text>
                                <Text style={{textAlign:'center', color:'#009b00', fontSize:20}}>{this.state.goalWeight}kg</Text>
                            </View>

                            <View style={{flex:0.33, flexDirection:'column'}}>
                                <Text style={{textAlign:'center', fontSize:16, borderBottomWidth:1}}>Weeks to goal weight</Text>
                                <Text style={{textAlign:'center', fontSize:20}}>{this.getLossEstimate()}</Text>
                            </View>

                        </View>

                        <View style={{flex:1, paddingTop:20}}>
                            <Text onPress={() => this.setModalVisible(true)} style={{textAlign:'center', fontSize:10, color:'blue'}}>Edit goals</Text>
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
        marginTop: 3,
        height: 50,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#BAB7C3',
        borderRadius:30,
        paddingHorizontal: 16,
        color: '#000'
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
});
