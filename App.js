import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { createBottomTabNavigator, BottomTabBar, tabBarComponent } from 'react-navigation-tabs';
import * as React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import LoginScreen from './screens/LoginScreen.js';
import RegisterScreen from './screens/RegisterScreen.js';
import DashboardScreen from './screens/DashboardScreen.js';
import * as firebase from 'firebase';
import { firebaseConfig } from './config.js';
import HomeScreen from './screens/HomeScreen.js';
import ResetPassword from './screens/ResetPassword.js';
import NewUserScreen from './screens/NewUserScreen.js';
import AuthHomeScreen from './screens/AuthHomeScreen.js';
import ExerciseScreen from './screens/ExerciseScreen.js';
import FoodLogScreen from './screens/FoodLogScreen.js';
import ProfileScreen from './screens/ProfileScreen.js';
import RecipeScreen from './screens/RecipeScreen.js';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

//firebase.initializeApp(firebaseConfig);
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app();
}
var database = firebase.database();

const TabNavigator = createBottomTabNavigator({
  Auth: {
    screen: AuthHomeScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="home" color={'black'} size={30} />
      )
    },
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="account" color={'black'} size={30} />
      )
    },
  },
  FoodLog: {
    screen: FoodLogScreen,
    navigationOptions: {
      tabBarLabel: 'Food Log',
      tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="book-outline" color={'black'} size={30} />
      )
    },  
  }, 
  Recipes: {
    screen: RecipeScreen,
    navigationOptions: {
      tabBarLabel: 'Recipes',
      tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="noodles" color={'black'} size={30} />
      )
    },
  },
  Exercise: {
    screen: ExerciseScreen,
    navigationOptions: {
      tabBarLabel: 'Exercise',
      tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="dumbbell" color={'black'} size={30} />
      )
    },  
  }, 
  },
  {
    initialRouteName: 'Auth',
    // tabBarComponent: (props) => (
    //   <TabBarComponent {...props} style={{ borderTopColor: 'black', borderColor:'black' }} />
    // ),
    // tabBarOptions: {
    //   activeTintColor: '#11ECC1',
    //   labelStyle: {
    //     fontSize: 16,
    //   },
    //   style: {
        
    //   }
    // }
  }
)

const AppNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    Register: RegisterScreen,
    Reset: ResetPassword
  },
  {
    headerMode: 'none'
  },
  {
    initialRouteName: 'Login'
  },
);

const AuthNavigator = createStackNavigator(
  {
    Dashboard: DashboardScreen,
    NewUser: NewUserScreen,
    AuthHome: AuthHomeScreen,
  },
  {
    headerMode: 'none'
  },
  {
    initialRouteName:'Dashboard'
  }
)

export default createAppContainer(
  createSwitchNavigator(
    {
      Home: HomeScreen,
      App: AppNavigator,
      //Auth: AuthNavigator,
      Tabs: TabNavigator,
    },
    {
      initialRouteName: 'Home',
      
    },
    
    
  )
);