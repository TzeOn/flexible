import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, StatusBar, Dimensions, ScrollView, Modal, Alert } from 'react-native';
import * as firebase from 'firebase';
import {LinearGradient} from 'expo-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {withNavigation} from 'react-navigation';

const cardHeight = Dimensions.get('window').height * 0.10;
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
        dailyGoal:0,
        weeklyGoal:0,
        weeklyCalories:"",
        protein:"",
        fill:0,
        TDEE:"",
        deficit:0,
        weeks:0,
        goalWeight:0,
        modalVisible:false,
        reset:false,
        refresh:false,
        change:false,

    }

    async componentDidMount() {
        const { email, displayName, uid } = firebase.auth().currentUser;
        this.setState({ email, displayName, uid});
        var newDay = new Date().getDay();

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
            if(childSnapshot.key == 'dailyGoal'){
                this.setState({dailyGoal:childSnapshot.val()})
            }
            if(childSnapshot.key == 'weeklyGoal'){
                this.setState({weeklyGoal: childSnapshot.val()})
            }
        })
        }); 
        
        var weeklyCaloriesRef = firebase.database().ref('Users/' + uid + '/week/');
        await weeklyCaloriesRef.on('value', (snapshot) => {
            var weekTotal=0;

            snapshot.forEach((day) => {
                if(day.key == 'reset'){
                    this.setState({reset:day.val()})
                }
                day.forEach((entry) => {
                    if(entry.key == 'change'){
                        this.setState({change:entry.val()})
                        console.log(this.state.change)
                    }
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
        this.getFill()

        // Reset the food log entries at the start of the week
        if(newDay == 0){
            this.setState({reset:true})
            firebase.database().ref('Users/' + uid + '/week/').update({'reset': this.state.reset})
        }
        // If today is Monday and reset:true, remove all week entries and reset the caloric goal
        if(newDay == 1 && this.state.reset){
            //clear entries
            this.setState({reset:false})
            var tdee = this.state.TDEE;
            var resetGoal = tdee - 600;
            firebase.database().ref('Users/' + uid).update({'dailyGoal':resetGoal});
            firebase.database().ref('Users/' + uid + '/week/').remove();
            firebase.database().ref('Users/' + uid + '/week/').update({'reset':this.state.reset})
            console.log("clear entries")
        }

        this.listener();

    }

    // Listener that listens for when this screen is in focus, then re-fetches the calories and protein data from firebase
    listener = async() => {
        this.props.navigation.addListener('didFocus', async() => {
            var total=0;
            var p=0;
            var userID = this.state.uid;
            var day = new Date().getDay();

            await firebase.database().ref('Users/' + userID + '/week/' + day).once('value', (snapshot)=>{
                snapshot.forEach((entry)=>{
                    entry.forEach((item)=>{
                        if(item.key == 'calories'){
                            total += item.val()
                        }
                        if(item.key == 'protein'){
                            p += item.val()
                        }
                    })
                })
                this.setState({calories: total})
                this.setState({protein:p})

                if(this.state.calories > this.state.dailyGoal && !this.state.change){
                    Alert.alert(
                        "Oops...",
                        "You have exceeded your daily caloric goal. However, you may still meet your weekly goal with some changes to the remainder of your week and thus still reach your desired goals. \nWould you like me to make these changes?",
                        [
                            {
                                text:"No",
                                onPress: () => this.noChange(),
                                style:'cancel'
                            },
                            {
                                text:"Yes",
                                onPress:() => this.alterWeek()
                            }
                        ]
                    )
                }
            })
            
        })
    }

    noChange = () => {
        var userID = this.state.uid;
        var day = new Date().getDay();

        this.setState({change:true})
        firebase.database().ref('Users/' + userID + '/week/' + day).update({'change':this.state.change})
    }

    alterWeek = () => {
        var excess = (this.state.dailyGoal - this.state.calories) * -1;
        var day = new Date().getDay();
        var daysLeft = 7 - day;
        var userID = this.state.uid

        var deduct = excess / daysLeft;
        var newGoal = Math.round(this.state.dailyGoal - deduct);
        this.setState({dailyGoal:newGoal});
        firebase.database().ref('Users/' + userID).update({'dailyGoal':newGoal})
        this.setState({change:true})
        firebase.database().ref('Users/' + userID + '/week/' + day).update({'change':true})
    }

    // Change visibility of modal
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    getFill = () => {
        var cal = parseInt(this.state.calories, 10);
        var max = this.state.dailyGoal;
        let res = (cal/max) * 100;
  
        // only setState if real number, and state is currently empty
        // Will only set the state once when the page renders
        if(res.toString() != 'NaN' && this.state.fill == 0){
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
        var max = this.state.weeklyGoal;
        var cal = parseInt(this.state.weeklyCalories, 10);

        var res = max - cal
        return Math.round(res);
    };

    getWeeklyGoal = () => {
        return this.state.dailyGoal * 7;
    }

    getProtein = () => {
        var w = parseInt(this.state.weight, 10);
        var p = w * 1.6;

        return Math.round(p);
    };

    getDeficitDifference = () => {
        var totalTDEE = parseFloat(this.state.TDEE, 10) * 7;
        var totalWeek = parseFloat(this.state.weeklyGoal, 10);

        var deficit = totalTDEE - totalWeek;

        var poundsDifference = deficit / 3500;
        var kgDifference = poundsDifference * 0.45359237;
        
        return kgDifference;
    }

    getLossEstimate = () => {
        var loss = 0;
        var weeks = 0;
        
        var targetLoss = parseFloat(this.state.weight,10) - parseFloat(this.state.goalWeight,10);
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
        let dGoal = Math.round(total - 600);
        let wGoal = dGoal * 7;
        const updates = {
            "weight": this.state.weight,
            "goalWeight": this.state.goalWeight,
            "TDEE": total,
            "dailyGoal": dGoal,
            "weeklyGoal": wGoal
        }       

        firebase.database().ref(`Users/`+userID).update(updates);
        Alert.alert("Goals updated");
        this.setModalVisible(!this.state.modalVisible)
        this.setState({
            dailyGoal:dGoal,
            weeklyGoal:wGoal
        })
    }

    getDate = () => {
        let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
        let newDate = date + month + year

        return newDate
    }


    render() {
        // this.getFill()
        const { calories } = this.state;
        const { modalVisible } = this.state;
        return (        
            <View key ={this.state.calories} style={styles.container}>
                
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
                    <View style={styles.cardContainer}>
                        <Text style={{fontSize:22, paddingBottom:15, textAlign:'center', fontWeight:'bold'}}>{this.state.date}</Text>
                        <View style={{flexDirection:'row', flex:1, width:cardWidth, alignContent:'center'}}>

                            <View style={{flexDirection:'column', flex:0.25,}}>
                                <Text style={{textAlign:'center', fontSize:20,}}>Goal</Text>
                                <Text style={{textAlign:'center', fontSize:25, color:'#34C759', fontWeight:'bold'}}>{this.state.dailyGoal}</Text>

                                <Text></Text>
                                <Text></Text>
                                <Text></Text>
                                
                                <Text style={{textAlign:'center', fontSize:20, textAlignVertical:'bottom'}}>Weekly</Text>
                                <Text style={{textAlign:'center', fontSize:20, textAlignVertical:'bottom', color:'#34C759', fontWeight:'bold'}}>{Math.round(this.state.weeklyGoal)}</Text>
                            </View>

                        <View style={{flex:0.5, alignSelf:'center'}}>
                        <AnimatedCircularProgress
                        size={180}
                        width={5}
                        style={{alignSelf:'center'}}
                        fill={this.state.fill}
                        rotation={360}
                        tintColor="#007AFF"
                        backgroundColor="gray">
                            {
                                (fill) => (
                                    <Text style={{textAlign:'center',color:'black', fontSize:40, fontWeight:'bold'}}> {calories}</Text>
                                )
                            }
                        </AnimatedCircularProgress>
                        </View>
                            <View style={{flexDirection:'column', flex:0.25}}>
                                <Text style={{fontSize:16, textAlign:'center'}}>Remaining</Text>
                                <Text style={{textAlign:'center', fontSize:25, color:'orange', fontWeight:'bold'}}>{this.getRemainingDay()}</Text>

                                <Text></Text>
                                <Text></Text>
                                <Text></Text>
                                
                                <Text style={{textAlign:'center', fontSize:14}}>Weekly Remaining</Text>
                                <Text style={{textAlign:'center', fontSize:20, color:'orange', fontWeight:'bold'}}>{this.getRemainingWeekly()}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{flexDirection:'row', width:cardWidth, borderBottomColor:'grey', borderWidth:1, padding:6, marginTop:10, borderRadius:10, backgroundColor:'#f6f8fa'}}>
                        <View style={{flex:0.33, flexDirection:'column'}}>
                            <Text></Text>
                            <Text style={{paddingTop:10, fontSize:20, fontWeight:'bold', textAlign:'left'}}>Protein</Text>
                        </View>         
                        <View style={{flex:0.33, flexDirection:'column'}}>
                            <Text style={{paddingTop:10, fontSize:14, fontWeight:'bold', textAlign:'center'}}>Current</Text>
                            <Text style={{fontSize:20, fontWeight:'bold', textAlign:'center', color:'grey', fontWeight:'bold'}}>{this.state.protein}</Text>
                        </View>  
                        <View style={{flex:0.33, flexDirection:'column'}}>
                            <Text style={{paddingTop:10, fontSize:14, fontWeight:'bold', textAlign:'center'}}>Goal</Text>
                            <Text style={{fontSize:20, fontWeight:'bold', textAlign:'center', color:'#34C759', fontWeight:'bold'}}>{this.getProtein()}</Text>
                        </View>   
                        <View style={{flex:0.33, flexDirection:'column'}}>
                            <Text style={{paddingTop:10, fontSize:14, fontWeight:'bold', textAlign:'center'}}>Remaining</Text>
                            <Text style={{fontSize:20, fontWeight:'bold', textAlign:'center', color:'orange', fontWeight:'bold'}}>{this.getProtein() - this.state.protein}</Text>
                        </View>           
                    </View>
                    
                    <View style={{flex:1, width:cardWidth, borderBottomColor:'grey', borderWidth:1, padding:6, marginTop:10, borderRadius:10, backgroundColor:'#f6f8fa'}}>
                        <Text style={{textAlign:'center', fontSize:22, fontWeight:'bold', paddingBottom:10}}> Personal Goals </Text>
                        <View style={{flexDirection:'row', width:'85%', alignSelf:'center'}}>
                            <View style={{flex:0.33, flexDirection:'column', borderRightWidth:1}}>
                                <Text style={{textAlign:'center', fontSize:16, borderBottomWidth:1}}>Current {'\n'}Weight</Text>
                                <Text style={{textAlign:'center', color:'grey', fontSize:20, fontWeight:'bold'}}>{this.state.weight}kg</Text>
                            </View>

                            <View style={{flex:0.33, flexDirection:'column', borderRightWidth:1}}>
                                <Text style={{textAlign:'center', fontSize:16, borderBottomWidth:1}}>Goal {'\n'}Weight</Text>
                                <Text style={{textAlign:'center', color:'#34C759', fontSize:20, fontWeight:'bold'}}>{this.state.goalWeight}kg</Text>
                            </View>

                            <View style={{flex:0.33, flexDirection:'column'}}>
                                <Text style={{textAlign:'center', fontSize:16, borderBottomWidth:1}}>Weeks to goal weight</Text>
                                <Text style={{textAlign:'center', fontSize:20, fontWeight:'bold'}}>{this.getLossEstimate()}</Text>
                            </View>

                        </View>

                        <View style={{flex:1, paddingTop:20}}>
                            <Text onPress={() => this.setModalVisible(true)} style={{textAlign:'center', fontSize:10, color:'blue'}}>Edit goals</Text>
                        </View>

                        <View style={{flex:1}}>
                            <Text style={{textAlign:'center', fontSize:20}}>On track to lose: {this.getDeficitDifference().toFixed(2)} kg this week</Text>
                        </View>
                        
                    </View>
                
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
        fontSize: 35,
        color: "#007AFF", 
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
    cardContainer: {
        flex:1, 
        borderBottomColor:'black', 
        borderWidth:1,
        paddingBottom:10, 
        borderRadius:10, 
        width:cardWidth, 
        backgroundColor:'#f6f8fa'
    }
});
