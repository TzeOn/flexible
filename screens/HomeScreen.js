import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';

export default class HomeScreen extends React.Component {
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? "Auth" : "App")
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{fontSize:20, fontWeight:'600'}}>Loading...</Text>
                <ActivityIndicator size='large'></ActivityIndicator>
            </View>
        )
    }
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems: 'center'
    }
})