import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Text,
  Alert,
  ActivityIndicator
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {PRIMARY_COLOR, SECONDARY_COLOR} from '../utils/colors';

function Forgotpassword({navigation}) {
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [loading, setLoading] = useState(false);

  // Reauthenticates the current user
  const reauthenticate = (currentPassword) => {
    let user = auth().currentUser;
    let cred = auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  };

  // Changes user password
  onChangePasswordPress = () => {
    if (currentPwd.length !== 0 && newPwd.length !== 0) {
      setLoading(true);
      reauthenticate(currentPwd)
        .then(() => {
          let user = auth().currentUser;
          user
            .updatePassword(newPwd)
            .then(() => {
              setLoading(false);
              Alert.alert('Success', 'Password changed');
              navigation.goBack();
            })
            .catch((error) => {
              setLoading(false);
              Alert.alert('Error', error.message);
            });
        })
        .catch((error) => {
          setLoading(false);
          Alert.alert('Error', error.message);
          console.log(error.message);
        });
    } else {
      Alert.alert('Error', 'Empty not allow');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="Current Password"
          value={currentPwd}
          secureTextEntry={true}
          underlineColorAndroid="transparent"
          onChangeText={setCurrentPwd}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="New Password"
          secureTextEntry={true}
          value={newPwd}
          underlineColorAndroid="transparent"
          onChangeText={setNewPwd}
        />
      </View>

      <TouchableOpacity
        disabled={loading}
        style={[styles.buttonContainer, styles.loginButton]}
        onPress={onChangePasswordPress}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" animating={loading} />
        ) : (
          <Text style={styles.loginText}>Change Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: SECONDARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: 300,
    borderRadius: 30,
  },

  loginButton: {
    backgroundColor: PRIMARY_COLOR,
  },

  loginText: {
    color: 'white',
  },
});

export default Forgotpassword;
