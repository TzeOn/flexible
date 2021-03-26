import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import * as firebase from 'firebase';
import {LinearGradient} from 'expo-linear-gradient';

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
        foodProtein:0
    }

    componentDidMount() {
        const { email, displayName, uid } = firebase.auth().currentUser;
        this.setState({ email, displayName, uid});
    }

    findFood = () => {
        // const nutritionixClient = require("nutritionix");
        // const nutritionix = new nutritionixClient({
        //     appId: 'eea39983',
        //     appKey: '58e2f1a83d219ddee4b5489fe15f8517'
        // })

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'x-app-id':'eea39983',
                'x-app-key':'58e2f1a83d219ddee4b5489fe15f8517',
                'x-remote-user':'0'
            },
            body: JSON.stringify({
                "query":"chicken breast",
                "num_servings":1
            })
        };

        fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', requestOptions)
            .then(response => response.json())
            .then((data) => {
                this.setState({foodName:data.foods[0].food_name})
                this.setState({calories:data.foods[0].nf_calories})
                this.setState({foodWeight:data.foods[0].serving_weight_grams})

                let servingWeight = data.foods[0].serving_weight_grams
                let gramCalorie = this.state.calories / servingWeight
                let hundred = gramCalorie*100

                let foodProtein = Math.round((data.foods[0].nf_protein / servingWeight) * 100)
                //console.log(data.foods[0])
                console.log(this.state.foodName)
                console.log(this.state.calories)
                console.log(this.state.foodWeight)     
                console.log("100 grams of " + this.state.foodName + " is: " + hundred + " calories")  
                console.log("100 grams of " + this.state.foodName + " is: " + foodProtein + " protein")         
            })
            .catch((error) => {
                console.log(error);
            })
        
        
    }


    // UI render
    render() {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['rgba(17, 236, 193, 0.8)', 'transparent']} style={styles.background}>
                <Text>{this.state.calories}Testing</Text>
                <TouchableOpacity onPress={() => this.findFood()} style={styles.button}>
                    <Text>Find food</Text>
                </TouchableOpacity>
                </LinearGradient>
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
        backgroundColor: '#f9f1f1',
        borderRadius:20,
        height: 52,
        width: '80%',
        alignItems:'center',
        justifyContent:'center',
        marginTop:30
    }
});