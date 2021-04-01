import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, FlatList, Platform, Dimensions, StatusBar, Modal, Alert } from 'react-native';
import * as firebase from 'firebase';
import {LinearGradient} from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const cardHeight = Dimensions.get('window').height * 0.10;
const cardWidth = Dimensions.get('window').width * 0.95;
const modalHeight = Dimensions.get('window').height * 0.85;
const modalCard = Dimensions.get('window').width * 0.85;

// This page checks whether the user logging in is a new or previous user to navigate them to the correct page
export default class RecipeScreen extends React.Component {

    // Holding the current user's email, name and user ID
    state = {
        email: "",
        displayName: "",
        uid: "",
        calories:0,
        foodList:[],
        foodName:"",
        foodWeight:0,
        foodProtein:0,
        modalVisible:false,
        recipeName:"",
        recipeWeight:0,
        recipeCalories:0,
        recipeProtein:0,
        search:"",
        servingCalories:0,
        servingProtein:0,
        servingWeight:0,
        recipeList:[]
        
    }

    componentDidMount() {
        const { email, displayName, uid } = firebase.auth().currentUser;
        this.setState({ email, displayName, uid});

        firebase.database().ref('Users/' + uid + '/recipes/').once('value', (snapshot) => {
            this.setState({recipeList:snapshot.val()})
        })
    }

    setModalVisible = (visible) => {
        this.setState({modalVisible: visible});
    }

    fetchRecipes = () => {
        var userID = this.state.uid;

        firebase.database().ref('Users/' + userID + '/recipes/').once('value', (snapshot) => {
            this.setState({recipeList:snapshot.val()})
        })
    }

    findFood = async() => {
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
            .then(response => response.json())
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

    updateList = () => {
        let actualCalories = 0;
        let actualProtein = 0;

        // If weight = 0, then fetch single serving amounts
        if(this.state.foodWeight == 0){
            actualCalories = Math.round(this.state.servingCalories)
            actualProtein = Math.round(this.state.servingProtein)
            this.setState({foodWeight:this.state.servingWeight})
        } else {
            actualCalories = Math.round((this.state.servingCalories / this.state.servingWeight) * this.state.foodWeight)
            actualProtein = Math.round((this.state.servingProtein / this.state.servingWeight) * this.state.foodWeight)
        }

        // Create object using the fetched data
        let ingredientObj = {
            name: this.state.foodName,
            calories: actualCalories,
            protein: actualProtein,
            weight: this.state.foodWeight
        }

        // Copy the foodList array into a new temp array, then push new object into the temp array
        let tempArray = this.state.foodList.slice()
        tempArray.push(ingredientObj)

        // Update the foodList array with new object, then reset ingredient fields
        this.setState({
            foodList: tempArray,
            foodName:"",
            servingCalories:0,
            servingProtein:0,
            servingWeight:0,
            search:"",
            foodWeight:0
        })
    }

    addIngredient = async() => {
        await this.findFood();
        this.updateList();
    }

    addRecipe = async() => {
        var promises = []; //Store all promises 
        var recipeName = this.state.recipeName;
        var recipeWeight = this.state.recipeWeight;
        if(this.state.recipeWeight == 0){
            recipeWeight = "1 Serving"
        }      
        var recipeCalories = 0;
        var recipeProtein = 0;
        var userID = this.state.uid;

        Object.entries(this.state.foodList).map(([key, value])=> {
            promises.push(recipeCalories += value.calories)
            promises.push(recipeProtein += value.protein)
        })
        await Promise.all(promises)  

        // Object of new recipe
        let updates = {
            'recipeName':recipeName,
            'recipeWeight':recipeWeight,
            'recipeCalories': recipeCalories,
            'recipeProtein': recipeProtein
        }

        // Add recipe to firebase
        firebase.database().ref('Users/' + userID + '/recipes/').push().update(updates)

        this.fetchRecipes();
        this.setModalVisible(!this.state.modalVisible);
    }

    deleteRecipe = async (item) => {
        var userID = this.state.uid;
        var ref = firebase.database().ref('Users/' + userID + '/recipes/');
        var postID;
        
        await ref.once('value', (snapshot) => {
            snapshot.forEach((child) => {
                if(child.val().recipeName == item){
                    postID = child.key
                    firebase.database().ref('Users/' + userID + '/recipes/' + postID).remove();
                }
            })        
        })
        await this.fetchRecipes();    
    }

    getRecipe = async(item) => {
        await this.setState({
            recipeName: item.recipeName,
            recipeCalories: item.recipeCalories,
            recipeProtein: item.recipeProtein,
            recipeWeight: item.recipeWeight
        })
        console.log(item.recipeName)
    }

    clearIngredients = () => {
        this.setState({
            foodList:[],
            recipeName:""
        })
    }

    confirm = () => {
        Alert.alert(
            "Close",
            "Current recipe will not be saved \n\nDo you still wish to close?",
            [
                {
                    text: "Close",
                    onPress:() => (this.setModalVisible(!this.state.modalVisible), this.clearIngredients()), //Also clear current ingredients list
                    style: 'cancel'
                },
                {
                    text:"Cancel",
                    style:'cancel'
                }
            ]
        )
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
                                <Text style={{fontSize:25, textAlign:'center', fontWeight:'bold', borderBottomWidth:1, marginBottom:20}}>Add new recipe</Text>
                            </View>
                            
                            <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:20, textAlign:'left', flex:.4}}>Name: </Text>
                                <View style={{borderWidth:1, borderRadius:10, flex:1}}>                                        
                                    <TextInput style={{fontSize:15, width:'100%', textAlign:'center', }} 
                                    placeholder="" 
                                    onChangeText={recipeName => this.setState({recipeName})} value={this.state.recipeName}></TextInput>                                        
                                </View>
                                                            
                            </View>

                            <View style={{flexDirection:'row', marginTop:20, borderBottomWidth:1, paddingBottom:10}}>
                            <Text style={{fontSize:12, textAlign:'left', flex:.6}}>Overall Weight (g): </Text>
                                <View style={{borderWidth:1, borderRadius:10, flex:1}}>                                        
                                    <TextInput style={{fontSize:15, width:'100%', textAlign:'center', }} 
                                    placeholder="e.g. 1025" 
                                    onChangeText={recipeWeight => this.setState({recipeWeight})} value={this.state.recipeWeight.toString()}></TextInput>                                        
                                </View>                            
                            </View>
                            <View style={{marginTop:10}}>
                                <Text style={{fontSize:20, fontWeight:'bold', textAlign:'center', marginBottom:5}}>Ingredients</Text>
                            </View>

                            <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:14, textAlign:'left', flex:.4}}>Ingredient: </Text>
                                <View style={{borderWidth:1, borderRadius:10, flex:1}}>                                        
                                    <TextInput style={{fontSize:20, width:'100%', textAlign:'center', }} 
                                    placeholder="e.g. chicken breast" 
                                    onChangeText={search => this.setState({search})} value={this.state.search}></TextInput>                                        
                                </View>
                                                            
                            </View>

                            <View style={{flexDirection:'row', marginTop:20, borderBottomWidth:1}}>
                            <Text style={{fontSize:14, textAlign:'left', flex:.6}}>Weight (g): </Text>
                                <View style={{borderWidth:1, borderRadius:10, flex:1}}>                                        
                                    <TextInput style={{fontSize:20, width:'100%', textAlign:'center', }} 
                                    placeholder="e.g. 200" 
                                    onChangeText={foodWeight => this.setState({foodWeight})} value={this.state.foodWeight.toString()}></TextInput>                                        
                                </View>                            
                            </View>

                            <View style={{flexDirection:'row', marginTop:15}}>
                                <TouchableOpacity onPress={() => this.addIngredient()}
                                style={{backgroundColor:'white', borderRadius:20, flex:1, justifyContent:'center', alignSelf:'flex-start'}}>
                                    <Text style={{fontSize:25, textAlign:'center', fontWeight:'bold'}}>Add Ingredient</Text>
                                </TouchableOpacity>                        
                            </View>
                            <Text style={{fontSize:10, paddingTop:10}}>*if weight is 0 then standard serving size is recorded instead*</Text>
                        
                        <View style={{flex:1, width:modalCard,}}>
                            <Text style={{textAlign:'center', fontSize:18, marginTop:5, borderBottomWidth:1, fontWeight:'bold'}}>Current ingredients:</Text>
                            <FlatList 
                            data={Object.keys(this.state.foodList)}
                            extraData={Object.keys(this.state.foodList)}
                            renderItem={( {item }) => (
                                <View style={{flex:1,flexDirection:'row'}}>
                                <Text style={{flex:.7, fontSize:16, textAlign:'center'}}>{this.state.foodList[item].name}</Text>
                                <Text style={{flex:.3, fontSize:16, textAlign:'center'}}>{this.state.foodList[item].weight}g</Text>
                                </View>
                                )}                               
                            keyExtracter={({item, index}) => index.toString()}                    
                            />
                        </View>
                        
                        <View style={{flex:1,justifyContent:'flex-end', width:'100%', alignSelf:'center'}}>
                            <View style={{flexDirection:'row'}}>
                                <TouchableOpacity style={styles.button} onPress={() => this.confirm()}>
                                    <Text style={{fontWeight:'bold', fontSize:20, color:'white'}}>Close</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.button2} onPress={() => (this.addRecipe(), this.clearIngredients())}>
                                    <Text style={{fontWeight:'bold', fontSize:20, color:'white'}}>Add Recipe</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                        </View>
                    </View>
                    </Modal>

                    {/* Screen title section */}
                    <View style={styles.card}>
                        <Text style={{fontSize:35, fontWeight:'bold', color:'#007AFF', textAlign:'center', paddingBottom:10}}> Recipes </Text>
                    </View>

                    <View style={{flex:1, width:cardWidth,marginTop:10}}>
                            {this.state.recipeList == null && (                              
                                <Text style={{textAlign:'center', textAlignVertical:'center', fontSize:30, color:'#007AFF'}}>Try adding some of your own personal recipes!</Text>                            
                            )}

                            {this.state.recipeList != null && (
                                <FlatList 
                                data={Object.keys(this.state.recipeList)}
                                extraData={Object.keys(this.state.recipeList)}
                                renderItem={( {item }) => (
                                    <View style={{flex:1, borderWidth:1, marginBottom:10, borderRadius:5, padding:6, backgroundColor:'#f6f8fa' }}>
                                    <View style={{flexDirection:'row'}}>
                                    <Text style={{flex:.9, fontSize:22,fontWeight:'bold', textAlign:'center'}}>{this.state.recipeList[item].recipeName}</Text>
                                    <TouchableOpacity style={{flex:0.1, paddingTop:5}}
                                        onPress={() => this.deleteRecipe(this.state.recipeList[item].recipeName)}>
                                            {/* this.deleteEntry(this.state.listData[item].food */}
                                        <Text style={{textAlign:'right'}}>
                                        <MaterialCommunityIcons name="delete" color={'red'} size={20} />
                                        </Text>
                                    </TouchableOpacity>
                                    </View>
                                    <View style={{flex:1, flexDirection:'row'}}>
                                        <View style={{flex:0.33}}>
                                         <Text style={{fontSize:20, flex:1, textAlign:'center'}}>Weight(g):</Text>
                                         <Text style={{fontSize:20, flex:1, textAlign:'center'}}>{this.state.recipeList[item].recipeWeight}</Text>   
                                        </View>
                                        <View style={{flex:0.33}}>
                                         <Text style={{fontSize:20, flex:1, textAlign:'center'}}>Protein:</Text>
                                         <Text style={{fontSize:20, flex:1, textAlign:'center'}}>{this.state.recipeList[item].recipeProtein}g</Text>   
                                        </View>
                                        <View style={{flex:0.33}}>
                                         <Text style={{fontSize:20, flex:1, textAlign:'center'}}>Calories:</Text>
                                         <Text style={{fontSize:20, flex:1, textAlign:'center'}}>{this.state.recipeList[item].recipeCalories}cal</Text>   
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
        width: '100%'
    },
    button: {
        backgroundColor: 'orange',
        borderRadius:20,
        height: 52,
        alignItems:'center',
        justifyContent:'center',
        marginTop:10,
        flex:1,
        marginRight:5
    },
    button2: {
        backgroundColor: '#34C759',
        borderRadius:20,
        height: 52,
        alignItems:'center',
        justifyContent:'center',
        marginTop:10,
        flex:1,
        marginLeft:5,
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