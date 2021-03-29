import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, StatusBar, Platform, Dimensions, Modal, FlatList } from 'react-native';
import * as firebase from 'firebase';
import {LinearGradient} from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const cardHeight = Dimensions.get('window').height * 0.10;
const cardWidth = Dimensions.get('window').width * 0.95;
const modalHeight = Dimensions.get('window').height * 0.85;

export default class FoodLogScreen extends React.Component {


    state = {
        email: "",
        displayName: "",
        uid: "",
        date: new Date().toDateString(),
        listData:[],
        calories:0,
        modalVisible:false,
        search:"",
        foodName:"",
        foodCal:0,
        foodProtein:0,
        foodWeight:0,
        servingWeight:0,
        servingProtein:0,
        servingCalories:0,
        reset:false,
        currentDay:0,
        total:0,
        totalWeek:0,
        test:[],
        refresh:false
    }

    async componentDidMount() {
        const { email, displayName, uid } = firebase.auth().currentUser;
        this.setState({ email, displayName, uid});

        // Gets the current day of the week as a number 1-7
        var newDate = new Date();
        var newDay = newDate.getDay();
        this.setState({currentDay: newDay}); 

        var ref = firebase.database().ref('Users/' + uid + '/week/' + newDay);
        await ref.once('value', (snapshot) => {
            var total=0;
            this.setState({listData:snapshot.val()})
            snapshot.forEach((child) => {
                child.forEach((item) => {
                    if(item.key == 'calories'){
                        total += item.val();
                    }
                })
            })
            this.setState({calories:total});
        });    
    }

    fetchList = async () => {
        var userID = this.state.uid;
        var day = this.state.currentDay;

        var ref = firebase.database().ref('Users/' + userID + '/week/' + day);
        await ref.once('value', (snapshot) => {
            var total=0;
            this.setState({listData:snapshot.val()})
            snapshot.forEach((child) => {
                child.forEach((item) => {
                    if(item.key == 'calories'){
                        total += item.val()
                    }
                })
            })
            this.setState({calories:total})
        })
    }

    setModalVisible = (visible) => {
        this.setState({modalVisible: visible});
    }

    getDate = () => {
        let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
        let newDate = date + month + year
        return newDate
    }

    // Search nutritionix database for desired food item
    findFood = async () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'x-app-id':'eea39983',
                'x-app-key':'58e2f1a83d219ddee4b5489fe15f8517',
                'x-remote-user':'0'
            },
            body: JSON.stringify({
                "query":this.state.search,
                "num_servings":1
            })
        };

        await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setState({foodName:data.foods[0].food_name})
                this.setState({servingCalories:data.foods[0].nf_calories})
                this.setState({servingProtein:data.foods[0].nf_protein})
                this.setState({servingWeight:data.foods[0].serving_weight_grams})              
            })
            .catch((error) => {
                console.log(error);
            })   
  
    }

    update = () => {
        let userID = this.state.uid;
        let currentDate = this.state.currentDay;
        var actualCalories=0;
        var actualProtein=0;
        
        if(this.state.foodWeight == 0){
            actualCalories = Math.round(this.state.servingCalories)
            actualProtein = Math.round(this.state.servingProtein)
            this.setState({foodWeight:this.state.servingWeight})
        } else {
            actualCalories = Math.round((this.state.servingCalories / this.state.servingWeight) * this.state.foodWeight)
            actualProtein = Math.round((this.state.servingProtein / this.state.servingWeight) * this.state.foodWeight)
        }
        

        const updates = {
            'food':this.state.foodName,
            'calories': actualCalories,
            'protein': actualProtein,
            'amount': this.state.foodWeight
        }
        firebase.database().ref(`Users/` + userID + '/week/' + currentDate).push().update(updates);
        this.setState({
            search:"",
            foodWeight:0
        })
    }

    addFood = async () => {
        await this.findFood();
        this.update();
        await this.fetchList();

    
    };

    test = () => {
        this.test1()
        this.test2()
    }

    test1 = () => {
        console.log("test 1");
    }

    test2 = () => {
        console.log("Test 2")
    }

    deleteEntry = async (item) => {
        var day = this.state.currentDay;
        var userID = this.state.uid;
        var ref = firebase.database().ref('Users/' + userID + '/week/' + day);
        var postID;
        
        await ref.once('value', (snapshot) => {
            snapshot.forEach((child) => {
                if(child.val().food == item){
                    postID = child.key
                    firebase.database().ref('Users/' + userID + '/week/' + day + '/' + postID).remove();
                }
            })        
        })
        await this.fetchList();    
    }

    // UI render
    render() {
        const { modalVisible } = this.state;
        return (
            <KeyboardAvoidingView style={styles.container} behavior={Platform.select({android: undefined, ios: 'padding'})}>
                <View style={styles.container}>
                   
                        {/* Modal  */}
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
                                <View style={{width:'100%'}}>
                                    <Text style={{fontSize:25, textAlign:'center', fontWeight:'bold', borderBottomWidth:1, marginBottom:20}}>Update Diary</Text>
                                </View>
                                
                                <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:20, textAlign:'left', flex:.4}}>Food: </Text>
                                    <View style={{borderWidth:1, borderRadius:10, flex:1}}>                                        
                                        <TextInput style={{fontSize:20, width:'100%', textAlign:'center', }} 
                                        placeholder="e.g. chicken breast" 
                                        onChangeText={search => this.setState({search})} value={this.state.search}></TextInput>                                        
                                    </View>
                                                              
                                </View>

                                <View style={{flexDirection:'row', marginTop:20}}>
                                <Text style={{fontSize:20, textAlign:'left', flex:.6}}>Weight (g): </Text>
                                    <View style={{borderWidth:1, borderRadius:10, flex:1}}>                                        
                                        <TextInput style={{fontSize:20, width:'100%', textAlign:'center', }} 
                                        placeholder="e.g. 100" 
                                        onChangeText={foodWeight => this.setState({foodWeight})} value={this.state.foodWeight.toString()}></TextInput>                                        
                                    </View>                            
                                </View>

                                <View style={{flexDirection:'row', marginTop:15}}>
                                    <TouchableOpacity onPress={() => (this.addFood(), this.setModalVisible(!modalVisible))}
                                    style={{backgroundColor:'white', borderRadius:20, flex:1, justifyContent:'center', alignSelf:'flex-start'}}>
                                        <Text style={{fontSize:25, textAlign:'center', fontWeight:'bold'}}>Add</Text>
                                    </TouchableOpacity>                        
                                </View>
                                <Text style={{fontSize:10, paddingTop:10}}>*if weight is 0 then standard serving size is recorded instead*</Text>
                            
                            
                            <View style={{flex:1,justifyContent:'flex-end', width:'60%', alignSelf:'center'}}>
                                <TouchableOpacity style={styles.button} onPress={() => this.setModalVisible(!modalVisible)}>
                                    <Text>Close</Text>
                                </TouchableOpacity>
                            </View>
                            </View>
                        </View>
                        </Modal>

                        {/* Screen title section */}
                        <View style={styles.card}>
                            <Text style={{fontSize:35, fontWeight:'bold', color:'#007AFF', textAlign:'center', paddingBottom:10}}> Food Log </Text>
                        </View>

                        {/* Date section with navigation buttons */}
                        <View style={{flexDirection:'row', width:cardWidth, borderWidth:1, padding:6, marginTop:10, borderRadius:10, backgroundColor:'#f6f8fa'}}>
                            <TouchableOpacity style={{flex:.2}}>
                                <Text style={{textAlign:'right'}}>
                                <MaterialCommunityIcons name="arrow-left-bold" color={'black'} size={30} />
                                </Text>                           
                            </TouchableOpacity>

                            <Text style={{flex:.60, textAlign:'center', fontSize:25, fontWeight:'bold'}}>{this.state.date}</Text>

                            <TouchableOpacity style={{flex:.2,}}>
                                <Text style={{textAlign:'left'}}>
                                <MaterialCommunityIcons name="arrow-right-bold" color={'black'} size={30} />
                                </Text> 
                            </TouchableOpacity>
                        </View>
                                    
                        <View style={{flex:1, width:cardWidth,marginTop:10}}>
                            {this.state.listData == null && (                              
                                <Text style={{textAlign:'center', textAlignVertical:'center', fontSize:30, color:'#007AFF'}}>No meals recorded yet</Text>                            
                            )}

                            {this.state.listData != null && (
                                <FlatList 
                                data={Object.keys(this.state.listData)}
                                extraData={Object.keys(this.state.listData)}
                                renderItem={( {item }) => (
                                    <View style={{flex:1, borderWidth:1, marginBottom:10, borderRadius:5, padding:6, backgroundColor:'#f6f8fa' }}>
                                    <View style={{flexDirection:'row'}}>
                                    <Text style={{flex:.9, fontSize:22,fontWeight:'bold', textAlign:'center'}}>{this.state.listData[item].food}</Text>
                                    <TouchableOpacity style={{flex:0.1, paddingTop:5}}
                                        onPress={() => this.deleteEntry(this.state.listData[item].food)}>
                                        <Text style={{textAlign:'right'}}>
                                        <MaterialCommunityIcons name="delete" color={'red'} size={20} />
                                        </Text>
                                    </TouchableOpacity>
                                    </View>
                                    <View style={{flex:1, flexDirection:'row'}}>
                                        <View style={{flex:0.33}}>
                                         <Text style={{fontSize:20, flex:1, textAlign:'center'}}>Weight:</Text>
                                         <Text style={{fontSize:20, flex:1, textAlign:'center'}}>{this.state.listData[item].amount}g</Text>   
                                        </View>
                                        <View style={{flex:0.33}}>
                                         <Text style={{fontSize:20, flex:1, textAlign:'center'}}>Protein:</Text>
                                         <Text style={{fontSize:20, flex:1, textAlign:'center'}}>{this.state.listData[item].protein}g</Text>   
                                        </View>
                                        <View style={{flex:0.33}}>
                                         <Text style={{fontSize:20, flex:1, textAlign:'center'}}>Calories:</Text>
                                         <Text style={{fontSize:20, flex:1, textAlign:'center'}}>{this.state.listData[item].calories}cal</Text>   
                                        </View>
                            
                                    </View>
                                    </View>
                                )}  
                                
                                keyExtracter={({item, index}) => index.toString()}  
                                                      
                            />
                            )}
                        </View>
                    
                    <View style={{flex:0.1, justifyContent:'flex-end', alignContent:'center'}}>
                        <TouchableOpacity>
                            <Text style={{fontSize:50, textAlign:'center'}} onPress={() => this.setModalVisible(true)}>
                                <MaterialCommunityIcons name="plus-circle" color={'black'} size={60} />
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
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
        width: '100%',
        paddingTop: StatusBar.currentHeight,
    },
    button: {
        backgroundColor: '#fff',
        borderRadius:20,
        height: 52,
        alignItems:'center',
        justifyContent:'center',
        
    },
    rowText: {
        flex:0.33,
        textAlign:'center',
        fontSize:20,
        
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
});