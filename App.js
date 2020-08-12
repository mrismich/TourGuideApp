import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'react-native';
import Splash from './src/components/Splash';
import Login from './src/components/Login';
import SignUp from './src/components/SignUp';
import Home from './src/components/Home';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {PRIMARY_COLOR, SECONDARY_COLOR} from './src/utils/colors';
const Stack = createStackNavigator();

function App() {
  return (
    <>
      <StatusBar backgroundColor="#24292f" barStyle="light-content" />
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              title: 'Login',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: PRIMARY_COLOR,
              },
              headerTintColor: SECONDARY_COLOR,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />

          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{
              title: 'Sign Up',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: PRIMARY_COLOR,
              },
              headerTintColor: SECONDARY_COLOR,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />

          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;
