import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import LoginScreen from './screens/LoginScreen.js';
import RegisterScreen from './screens/RegisterScreen.js';
import DashboardScreen from './screens/DashboardScreen.js';
import * as firebase from 'firebase';
import { firebaseConfig } from './config.js';
import HomeScreen from './screens/HomeScreen.js';
import ResetPassword from './screens/ResetPassword.js';
import NewUserScreen from './screens/NewUserScreen.js';

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

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
      Auth: AuthNavigator 
    },
    {
      initialRouteName: 'Home'
    }
    
  )
);