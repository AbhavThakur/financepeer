import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import Home from '../screens/Home';
import UploadFileScreen from '../screens/UploadFileScreen';
import FilesListingScreen from '../screens/FileListingScreen';

const Stack = createStackNavigator();

function AppStack() {
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '840739221854-89rrhdassahimi2i6gpnrngbvo4vpo62.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });

    console.log('authnavigation');
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="UploadFileScreen"
        component={UploadFileScreen}
        options={{title: 'Upload File'}}
      />
      <Stack.Screen
        name="FilesListingScreen"
        component={FilesListingScreen}
        options={{title: 'Uploaded File'}}
      />
    </Stack.Navigator>
  );
}

export default AppStack;
