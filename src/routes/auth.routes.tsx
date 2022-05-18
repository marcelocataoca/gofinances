import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {SignIn} from '../screens/SignIn';
const { Navigator, Screen } = createStackNavigator();
const Stack = createNativeStackNavigator();

//construindo a rota publica
export function AuthRoutes(){
  return (
    <Navigator screenOptions={{ headerShown: false }} >
      <Screen 
        name="SignIn"
        component={SignIn}
      />
    </Navigator>
  )
}