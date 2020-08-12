import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Icon} from 'native-base'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RadioForm from 'react-native-simple-radio-button';
import {TextInput} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {CommonActions} from '@react-navigation/native';
import {PRIMARY_COLOR,SECONDARY_COLOR,ASSET_COLOR} from '../utils/colors'

function SignUp({navigation}) {
  const ref = firestore().collection('users');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [passport, setPassport] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [reEnter, setReEnter] = useState('');
  const [loading, setLoading] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();

    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();

    var dateString = day + '-' + (month + 1) + '-' + year;
    setDob(dateString);
  };

  async function create_user() {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async () => {
        await ref
          .doc(email.toLowerCase())
          .set({
            name: fullName,
            email: email.toLowerCase(),
            phone: phone,
            cnic: cnic,
            passport: passport,
            dob: dob,
            gender: gender,
            password: password,
          })
          .then((res) => {
            Alert.alert('You have signed up successfully.');
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Home'}],
              }),
            );
          })
          .catch((error) => {
            Alert.alert('Error', error.message);
          });
        setFullName('');
        setEmail('');
        setPhone('');
        setCnic('');
        setPassport('');
        setDob('');
        setGender('');
        setPassword('');
        setReEnter('');
      })
      .catch((err) => {
        Alert.alert('Error', err.message);
      });
  }
  // Signup
  const _signup = () => {
    if (
      fullName.length === 0 ||
      email.length === 0 ||
      phone.length === 0 ||
      cnic.length === 0 ||
      passport.length === 0 ||
      dob.length === 0 ||
      gender.length === 0 ||
      password.length === 0
    ) {
      Alert.alert('Error', 'All fields required');
    } else if (password != reEnter) {
      Alert.alert('Error', 'Passwords do not match');
    } else {
      setLoading(true);
      ref
        .doc(email)
        .get()
        .then((documentSnapshot) => {
          documentSnapshot.exists;
          if (documentSnapshot.exists) {
            setLoading(false);
            Alert.alert('Error', 'This email already exists.');
          } else {
            create_user();
            setLoading(false);
          }
        });
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logo}>
        <Image style={styles.logoIcon} source={require('../assets/logo.png')} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="Full Name"
          keyboardType="default"
          value={fullName}
          underlineColorAndroid="transparent"
          onChangeText={setFullName}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="Email Address"
          keyboardType="email-address"
          value={email}
          underlineColorAndroid="transparent"
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="Phone No."
          keyboardType="phone-pad"
          value={phone}
          underlineColorAndroid="transparent"
          onChangeText={setPhone}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="CNIC"
          keyboardType="phone-pad"
          value={cnic}
          underlineColorAndroid="transparent"
          onChangeText={setCnic}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="Passport No."
          keyboardType="phone-pad"
          value={passport}
          underlineColorAndroid="transparent"
          onChangeText={setPassport}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="Date of Birth"
          editable={false}
          keyboardType="phone-pad"
          value={dob.toString()}
          underlineColorAndroid="transparent"
          onChangeText={setDob}
        />

        <View style={styles.dob}>
          <TouchableOpacity onPress={showDatePicker}>
            <Icon type="FontAwesome" name="calendar" style={{fontSize:20}} />
          </TouchableOpacity>
          <DateTimePickerModal
            maximumDate={new Date()}
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <RadioForm
          style={styles.radio}
          radio_props={[
            {label: 'Male            ', value: 'male'},
            {label: 'Female', value: 'female'},
          ]}
          initial={'male'}
          formHorizontal={true}
          labelHorizontal={true}
          labelColor={'black'}
          buttonColor={'black'}
          selectedButtonColor={'black'}
          buttonSize={10}
          buttonOuterSize={20}
          animation={true}
          value={gender}
          onPress={(value) => setGender(value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          underlineColorAndroid="transparent"
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="Re-enter Password"
          secureTextEntry={true}
          underlineColorAndroid="transparent"
          value={reEnter}
          onChangeText={setReEnter}
        />
      </View>

      <TouchableOpacity
        disabled={loading}
        style={[styles.buttonContainer, styles.loginButton]}
        onPress={_signup}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" animating={loading} />
        ) : (
          <Text style={styles.loginText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <View>
        <TouchableOpacity
          style={styles.textinformation}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SECONDARY_COLOR,
  },
  inputContainer: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 1,
    width: 250,
    height: 32,
    marginBottom: 10,
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

  buttonContainer: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: 250,
    borderRadius: 30,
  },

  loginButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  logo: {
    marginTop: -10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 10,
  },
  loginText: {
    color: 'white',
  },
  logoIcon: {
    width: 150,
    height: 150,
    justifyContent: 'center',
  },
  link: {
    color: ASSET_COLOR,
    marginTop: 30,
  },

  radio: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
    marginTop: 25,
  },
  date: {
    height: 45,
    marginLeft: 20,
    borderBottomColor: '#FFFFFF',
    flex: 1,
    opacity: 0.4,
  },

  dob: {
    flexDirection: 'row',
    marginRight: 10,
  },
});

export default SignUp;
