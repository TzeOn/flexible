import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, Platform, Dimensions, FlatList, Modal, Alert } from 'react-native';
import * as firebase from 'firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const cardHeight = Dimensions.get('window').height * 0.10;
const cardWidth = Dimensions.get('window').width * 0.95;
const modalHeight = Dimensions.get('window').height * 0.85;
const modalWidth = Dimensions.get('window').width * 0.7;

// This page checks whether the user logging in is a new or previous user to navigate them to the correct page
export default class ExerciseScreen extends React.Component {

    // Holding the current user's email, name and user ID
    state = {
        email: "",
        displayName: "",
        uid: "",
        modalVisible:false,
        modalVisible2:false,
        modalVisible3:false,
        programList:{},
        myPrograms:[],
        currentSplit:"",
        pName: "",
        splits:[],
        selectedProgram:"",
        addedProgramme:{},
        index:0,
        currentProgramme:[],
        listVisible: false,
        selectedDescription:""



    }

    async componentDidMount() {
        const { email, displayName, uid } = firebase.auth().currentUser;
        this.setState({ email, displayName, uid});

        await firebase.database().ref('Users/Programs/').once('value', (snapshot) => {
            this.setState({programList: snapshot.val()})
            //console.log(this.state.programList)
            snapshot.forEach((program) => {
                // Whole program object
                program.forEach((split) => {
                   // console.log(split.key)  // A and B, and description
                   // Next child to access exercises for each day i.e. 1, 2, 3 + complete flag
                   // Key = name, description, and splits
                })
            })
            //console.log(this.state.programList)
            var myjson = JSON.stringify(this.state.programList)
            
            //firebase.database().ref('Users/' + uid + '/programmes/').set(randoObj)
        })

        
        firebase.database().ref('Users/' + uid + '/programmes/').once('value', (snapshot) => {
            if(snapshot != null){
                this.setState({myPrograms: snapshot.val()})
            }
        })

    }

    refreshList = () => {
        var userID = this.state.uid
        firebase.database().ref('Users/' + userID + '/programmes/').once('value', (snapshot) => {
            if(snapshot != null){
                this.setState({myPrograms: snapshot.val()})
            }
        })
    }

    setModalVisible = (visible) => {
        this.setState({modalVisible: visible});
    }

    setModalVisible2 = (visible) => {
        this.setState({modalVisible2: visible})
    }

    setModalVisible3 = (visible) => {
        this.setState({modalVisible3: visible})
    }

    confirmJoin = (item) => {
        Alert.alert(
            "Confirm",
            "Please confirm you would like to join this program.",
            [
                {
                    text:'Cancel',
                    style:'cancel'
                },
                {
                    text:'Join',
                    onPress:() => this.addProgram(item) 
                }
            ]
        )
        this.setModalVisible(!this.state.modalVisible);
    }

    addProgram = async(item) => {
        //console.log(item)
        var userID = this.state.uid
        
        await firebase.database().ref('Users/Programs/').once('value', (snapshot) => {
            //this.setState({addedProgramme: snapshot})
            snapshot.forEach((programme) => {
                //console.log(programme.key)
                if(programme.key == item){
                    this.setState({addedProgramme: programme.val()})
                    this.setState({pName: programme.key.toString()})
                    
                }
            })
        })
        var pName = this.state.pName;
        firebase.database().ref('Users/' + userID + '/programmes/' + pName).update(this.state.addedProgramme)
        this.refreshList()
        
        
        
        //firebase.database().ref('Users/' + userID + '/programs/').push().update()
    }

    getProgram = async(item) => {
        // get program from firebase with the item name 
        this.setState({selectedProgram: item.name})
        this.setState({selectedDescription: item.description})
        //console.log(item.A)

        await Object.keys(item.days).map(([key, value])=>{
            this.state.splits.push(key)
        })
        await this.setState({index:0})

        Object.entries(item.days).map(([key, value]) => {
            if(key == this.state.splits[this.state.index]){
                this.setState({currentProgramme: value})
                console.log(value)
            }
            console.log(key)
        })
        this.setState({listVisible:true})
        this.setModalVisible2(!this.state.modalVisible2)
    }

    getNext = async() => {
        var len = await this.state.splits.length - 1;
        var i = await this.state.index + 1;

        if(i>len){
            await this.setState({index:0})
        } else {
            await this.setState({index:i})
        }
        this.getCurrent()
    }

    getPrev = async() => {
        var len = this.state.splits.length - 1;
        var i = this.state.index - 1;

        if(i<0){
            await this.setState({index:len})
        } else {
            await this.setState({index:i})
        }
        this.getCurrent()
    }

    getCurrent = () => {
        Object.entries(this.state.myPrograms).map(([key, value]) => {
            Object.entries(value).map(([key, value2])=> {                
                Object.entries(value2).map(([key, value3])=>{
                    if(key == this.state.splits[this.state.index]){
                        this.setState({currentProgramme:value3})
                    }
                })
            })
        })
    }

    getDescription = (item) => {
        console.log(item.exercise)
        
    }

    listShowing = () => {
        this.setState({listVisible:true})
    }

    confirmIncrease = () => {
        Alert.alert(
            "Confirm",
            "Confirm that you have successfully completed all exercises this session and would like to increase the load",
            [
                {
                    text:'Cancel',
                    style:'cancel'
                },
                {
                    text:"Confirm",
                    onPress:() => this.increaseLoad()
                }
            ]
        )
    }
    increaseLoad = async() => {
        var split = this.state.splits[this.state.index]
        var userID = this.state.uid
        var programme = this.state.selectedProgram
        var ref = firebase.database().ref('Users/' + userID + '/programmes/' + programme + '/days/' + split)
        
        await ref.once('value', (snapshot) => {
            snapshot.forEach((lift)=> {
                if(lift.key != 'complete'){
                    console.log(lift.key)
                    var key = lift.key
                lift.forEach((item)=>{
                    if(item.key == 'liftWeight'){
                        console.log(item.val())
                        var increase = item.val() + 2.5
                        firebase.database().ref('Users/' + userID + '/programmes/' + programme + '/days/' + split +'/'+ key).update({'liftWeight':increase})                      
                    }
                })
                }
            })
        })
        await this.refreshList()
        await this.getCurrent()
        this.getNext()
    }

    // UI render
    render() {
        const { modalVisible, modalVisible2, modalVisible3 } = this.state;
        return (
            <View style={{flex:1, alignContent:'center'}}>

                {/* Find programs modal */}
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
                            <Text style={{fontSize:25, textAlign:'center', fontWeight:'bold', borderBottomWidth:1, marginBottom:20}}>Find Program</Text>
                        </View>

                        <FlatList 
                        data={Object.keys(this.state.programList)}
                        extraData={Object.keys(this.state.programList)}
                        renderItem={( {item }) => (
                            
                            <TouchableOpacity onPress={() => this.confirmJoin(item)}>
                            <View style={{flex:1, borderWidth:1, marginBottom:10, borderRadius:10, borderColor:'grey', padding:6, backgroundColor:'#f6f8fa', width: modalWidth}}>                 
                                <Text style={{flex:.9, fontSize:22,fontWeight:'bold', textAlign:'center', color:'#007AAF'}}>{this.state.programList[item].name}</Text>
                                <View style={{borderWidth:1, borderColor:'#007AAF', borderRadius:20}}>
                                    <Text style={{fontSize:18, textAlign:'center', fontWeight:'bold'}}>Description</Text>
                                    <Text style={{fontSize:16, textAlign:'center'}}>{this.state.programList[item].description}</Text>
                                </View>
                            </View>
                            </TouchableOpacity>
                        )}                               
                        keyExtracter={({item, index}) => index.toString()}                    
                    />
                        
                        
                    
                        <View style={{flex:1,justifyContent:'flex-end', width:'100%', alignSelf:'center'}}>
                            <TouchableOpacity style={styles.button} onPress={() => (this.setModalVisible(!modalVisible))}>
                                <Text style={{fontWeight:'bold', fontSize:20, color:'white', textAlign:'center'}}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                </Modal>


                {/* My programs Modal */}
                <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible2}
                onRequestClose={() => {
                    this.setModalVisible2(!modalVisible2);
                }}
                >
                    <View>
                    <View style={styles.modalView}>
                        <View style={{width:'100%'}}>
                            <Text style={{fontSize:25, textAlign:'center', fontWeight:'bold', borderBottomWidth:1, marginBottom:20}}>My Programs</Text>
                        </View>

                        {this.state.myPrograms == null && (                              
                                    <Text style={{textAlign:'center', textAlignVertical:'center', fontSize:30, color:'#007AFF'}}>No programs added yet</Text>                            
                                )}
                        
                        {this.state.myPrograms != null && (
                        <FlatList 
                        data={Object.keys(this.state.myPrograms)}
                        extraData={Object.keys(this.state.myPrograms)}
                        renderItem={( {item }) => (
                            
                            <TouchableOpacity onPress={() => this.getProgram(this.state.myPrograms[item])}>
                            <View style={{flex:1, borderWidth:1, marginBottom:10, borderRadius:5, padding:6, backgroundColor:'#f6f8fa', width: modalWidth}}>                 
                                <Text style={{flex:.9, fontSize:22,fontWeight:'bold', textAlign:'center', color:'#007AAF'}}>{this.state.myPrograms[item].name}</Text>
                                <View style={{borderWidth:1, borderColor:'#007AAF', borderRadius:20}}>
                                    <Text style={{fontSize:18, textAlign:'center', fontWeight:'bold'}}>Description</Text>
                                    <Text style={{fontSize:16, textAlign:'center'}}>{this.state.myPrograms[item].description}</Text>
                                </View>
                            </View>
                            </TouchableOpacity>
                        )}                               
                        keyExtracter={({item, index}) => index.toString()}                    
                        />
                        )}
                        
                        
                    
                        <View style={{flex:1,justifyContent:'flex-end', width:'100%', alignSelf:'center'}}>
                            <TouchableOpacity style={styles.button} onPress={() => (this.setModalVisible2(!modalVisible2))}>
                                <Text style={{fontWeight:'bold', fontSize:20, color:'white', textAlign:'center'}}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                </Modal>

                {/* Programme description modal */}
                <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible3}
                onRequestClose={() => {
                    this.setModalVisible3(!modalVisible3);
                }}
                >
                    <View>
                    <View style={styles.modalView}>
                        <View style={{width:'100%'}}>
                            <Text style={{fontSize:25, textAlign:'center', fontWeight:'bold', borderBottomWidth:1, marginBottom:20}}>{this.state.selectedProgram}</Text>
                        </View>
                        <View>
                            <Text style={{textAlign:'center', fontSize:25}}>{this.state.selectedDescription}</Text>
                        </View>
                        
                    
                        <View style={{flex:1,justifyContent:'flex-end', width:'100%', alignSelf:'center'}}>
                            <TouchableOpacity style={styles.button} onPress={() => (this.setModalVisible3(!modalVisible3))}>
                                <Text style={{fontWeight:'bold', fontSize:20, color:'white', textAlign:'center'}}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                </Modal>

                <View style={styles.card}>
                    {this.state.selectedProgram == "" && 
                    (<Text style={{fontSize:35, fontWeight:'bold', color:'#007AFF', textAlign:'center', paddingBottom:10}}> Exercises </Text>)}
                    {this.state.selectedProgram != "" && 
                    (<Text style={{fontSize:35, fontWeight:'bold', color:'#007AFF', textAlign:'center', paddingBottom:10}}> {this.state.selectedProgram} </Text>)}
                    
                </View>
                <View style={{flexDirection:'row', width:cardWidth, alignSelf:'center', justifyContent:'space-evenly'}}>
                    <TouchableOpacity 
                    onPress={() => this.setModalVisible2(true)}
                    style={{flex:.45, backgroundColor:'#007AFF', borderRadius:10, height:30, justifyContent:'center'}}>
                        <Text style={{textAlign:'center', fontSize:16, color:'#f6f8fa', textAlignVertical:'center', fontWeight:'bold'}}>My Programs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={() => this.setModalVisible(true)}
                    style={{flex:.45, backgroundColor:'#007AFF', borderRadius:10, height:30, justifyContent:'center'}}>
                        <Text style={{textAlign:'center', fontSize:16, color:'#f6f8fa', textAlignVertical:'center', fontWeight:'bold'}}>Find Programs</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row', width:cardWidth, borderWidth:1, padding:6, marginTop:4, borderRadius:10, backgroundColor:'#f6f8fa', alignSelf:'center'}}>
                    <TouchableOpacity onPress={() => this.getPrev()} style={{flex:.2}}>
                        <Text style={{textAlign:'right'}}>
                        <MaterialCommunityIcons name="arrow-left-bold" color={'black'} size={30} />
                        </Text>                           
                    </TouchableOpacity>

                    <Text style={{flex:.60, textAlign:'center', fontSize:25, fontWeight:'bold'}}>{this.state.splits[this.state.index]}</Text>

                    <TouchableOpacity onPress={() => this.getNext()} style={{flex:.2,}}>
                        <Text style={{textAlign:'left'}}>
                        <MaterialCommunityIcons name="arrow-right-bold" color={'black'} size={30} />
                        </Text> 
                    </TouchableOpacity>
                </View>
                <View style={{flex:.05}}>
                    {this.state.currentProgramme != "" && (
                        <Text onPress={() => this.setModalVisible3(true)} style={{fontSize:20, color:'#007AAF', textAlign:'center'}}>Program Description</Text>
                    )}
                    
                </View>

                <View style={{flex:1}}>
                    <FlatList 
                    data={Object.keys(this.state.currentProgramme)}
                    extraData={Object.keys(this.state.currentProgramme)}
                    renderItem={( {item} ) => (
                        <View style={{flex:1}}>
                            {this.state.currentProgramme[item].exercise != null && (
                                <View style={{flex:1, borderTopWidth:1, borderBottomWidth:1, margin:20}}>
                                    <Text style={{fontSize:30, textAlign:'center'}}>{this.state.currentProgramme[item].exercise}</Text>
                                    <Text style={{fontSize:20, textAlign:'center'}}>{this.state.currentProgramme[item].reps} x {this.state.currentProgramme[item].reps} at {this.state.currentProgramme[item].liftWeight}kg</Text>
                                </View>   
                                 
                            )}
                        </View>                       
                    )}                    
                    />
                    
                </View>
                <View style={{flex:.2, justifyContent:'flex-end'}}>
                    {this.state.listVisible == true && (
                        <TouchableOpacity style={{alignSelf:'center'}} onPress={() => this.confirmIncrease()}>
                        <MaterialCommunityIcons name="check-circle-outline" color={'#34C759'} size={90} />
                        </TouchableOpacity>
                    )}
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
        backgroundColor: '#007AFF',
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
        alignSelf:'center'  ,
           
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
});