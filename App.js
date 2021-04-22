import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { createBottomTabNavigator, BottomTabBar, tabBarComponent } from 'react-navigation-tabs';
import * as React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import LoginScreen from './screens/LoginScreen.js';
import RegisterScreen from './screens/RegisterScreen.js';
import DashboardScreen from './screens/DashboardScreen.js';
import * as firebase from 'firebase';
import { firebaseConfig } from './config.js';
import HomeScreen from './screens/HomeScreen.js';
import ResetPassword from './screens/ResetPassword.js';
import NewUserScreen from './screens/NewUserScreen.js';
import CalorieScreen from './screens/CalorieScreen.js';
import ExerciseScreen from './screens/ExerciseScreen.js';
import FoodLogScreen from './screens/FoodLogScreen.js';
import ProfileScreen from './screens/ProfileScreen.js';
import RecipeScreen from './screens/RecipeScreen.js';

// Initialise new or existing firebase App
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app();
}
var database = firebase.database();

// The main navigator of the application when the user is logged in
// Tab style navigator where the calories screen is the default home page
const TabNavigator = createBottomTabNavigator({
  Calories: {
    screen: CalorieScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="home" color={'black'} size={30} />
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
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="account" color={'black'} size={30} />
      )
    },
  },
  },
  {
    initialRouteName: 'Calories',
  }
)

// Default app stack when the user is not logged in, contains the login, register and
// password reset screens, default screen is login
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

// Navigator to check for authentication, checks if the user is a new user that has not completed
// the full register process. Directs them to either the main tab navigator or newUser form screen
const AuthNavigator = createStackNavigator(
  {
    Dashboard: DashboardScreen,
    NewUser: NewUserScreen,
    
  },
  {
    headerMode: 'none'
  },
  {
    initialRouteName:'Dashboard'
  }
)

// The overall app container containing all of the separate navigators and screens
// Default home page is the home screen where user authentication takes place
// if the user is logged in they will go to tabs, else
//  they are directed to the default app stack
export default createAppContainer(
  createSwitchNavigator(
    {
      Home: HomeScreen,
      App: AppNavigator,
      Auth: AuthNavigator,
      Tabs: TabNavigator,
    },
    {
      initialRouteName: 'Home',      
    },   
  )
);