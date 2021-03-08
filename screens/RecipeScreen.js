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
        calories:"",
        foodList:[]
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
                "query":"apple",
                "num_servings":1
            })
        };

        fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', requestOptions)
            .then(response => response.json())
            .then((data) => {
                this.setState({calories:data.foods[0].food_name})
                console.log(data.foods)
                console.log(this.state.calories)              
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
                <TouchableOpacity onPress={this.findFood} style={styles.button}>
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
        backgroundColor: '#fff',
        borderRadius:20,
        height: 52,
        width: '80%',
        alignItems:'center',
        justifyContent:'center',
        marginTop:30
    }
});