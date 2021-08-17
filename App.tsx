/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MemberList from './src/screens/MemberList';
import ProfilePhotos from './src/screens/ProfilePhotos';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const Stack = createNativeStackNavigator()

const App: () => React.Node = () => {
  return (
    <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Member">
        <Stack.Screen name="Member" component={MemberList} />
        <Stack.Screen name="ProfilePhotos" component={ProfilePhotos} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;
