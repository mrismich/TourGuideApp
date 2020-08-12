import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Icon} from 'native-base'
import {TextInput} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import {CommonActions} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {PRIMARY_COLOR,SECONDARY_COLOR,ASSET_COLOR} from '../utils/colors'
function Login({navigation}) {
  const ref = firestore().collection('users');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   auth().onAuthStateChanged(function (user) {
  //     if (user) {
  //       navigation.navigate('Home');
  //     } else {
  //       // User is signed out.
  //     }
  //   });
  // });

  async function validate_user() {
    if (email.length === 0 || password.length === 0) {
      Alert.alert('Error', 'All fields required');
    } else {
      setLoading(true);
      auth()
        .signInWithEmailAndPassword(email.toLowerCase(), password)
        .then((user) => {
          setLoading(false);
          if (user) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Home'}],
              }),
            );
          } else {
            Alert.alert('Error', 'Unable to login');
          }
        })
        .catch(function (error) {
          setLoading(false);
          Alert.alert('Error', error.message);
        });

      // ref.doc(email).get().then(documentSnapshot => {
      //   documentSnapshot.exists;
      //   if (documentSnapshot.exists) {
      //     if (documentSnapshot.get('password') != password) {
      //       Alert.alert("Error", "Password is incorrect.");
      //     }
      //     else {
      //       navigation.navigate('Home')
      //     }
      //   }
      //   else {
      //     Alert.alert("Alert", "User does not exist.");
      //   }
      // });
    }
  }

  async function restore_password() {
    if (email == '') {
      Alert.alert('Alert', 'Enter email address.');
    } else {
      var emailAddress = email.toLowerCase();

      auth()
        .sendPasswordResetEmail(emailAddress)
        .then(function () {
          Alert.alert(
            'Alert',
            'A link has been sent to your email address to reset your password.',
          );
        })
        .catch(function (error) {
          Alert.alert('Error', error.message);
        });
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{flex: 1, alignItems: 'center'}}>
        <View style={styles.logo}>
          <Image
            style={styles.logoIcon}
            source={require('../assets/logo.png')}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon type="Entypo" style={styles.icon} name="mail" color={PRIMARY_COLOR} />
          <TextInput
            style={styles.inputs}
            placeholder="Email address"
            keyboardType="email-address"
            value={email}
            underlineColorAndroid="transparent"
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon type="Entypo" style={styles.icon} name="lock" color={PRIMARY_COLOR} />
          <TextInput
            style={styles.inputs}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            underlineColorAndroid="transparent"
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => restore_password()}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={loading}
          style={[styles.buttonContainer, styles.loginButton]}
          onPress={() => validate_user()}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" animating={loading} />
          ) : (
            <Text style={styles.loginText}>Login</Text>
          )}
        </TouchableOpacity>
        <View style={styles.last}>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.link}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: SECONDARY_COLOR,
  },
  inputContainer: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 1,
    width: 300,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center',
  },
  logoIcon: {
    width: 150,
    height: 150,
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: 300,
    borderRadius: 30,
  },

  textinformation: {
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: 10,
  },

  loginButton: {
    backgroundColor: PRIMARY_COLOR,
  },

  logo: {
    marginTop: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 35,
  },

  loginText: {
    color: 'white',
  },

  link: {
    color: ASSET_COLOR,
  },

  icon: {
    marginLeft: 10,
    fontSize:20
  },

  forgot: {
    marginRight: -150,
    marginTop: -40,
    color: PRIMARY_COLOR,
    opacity: 0.5,
  },

  last: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
});

export default Login;
