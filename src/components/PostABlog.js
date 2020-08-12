import React, {useState} from 'react';
import 'react-native-gesture-handler';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Icon} from 'native-base';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import {PRIMARY_COLOR, SECONDARY_COLOR, ASSET_COLOR} from '../utils/colors';

function PostABlog({navigation}) {
  const [placeName, setPlaceName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [dbURL, setDbURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState('');

  const convertToSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  };
  const handleName = (text) => {
    let slug = convertToSlug(text.trim());
    setPlaceName(text);
    setSlug(`${slug}-${new Date().getTime()}`);
  };

  const selectImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};
        setImage(source);
      }
    });
  };

  async function uploadImage() {
    const {uri} = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

    const task = storage().ref(`/blog/${filename}`).putFile(uploadUri);

    try {
      await task;
    } catch (e) {
      Alert.alert('Error', e);
    }

    const ref = storage().ref(`/blog/${filename}`);

    const url = await ref.getDownloadURL();

    setDbURL(url.toString());
    return url;
  }

  async function uploadBlog() {
    setLoading(true);
    await uploadImage().then(async (url) => {
      var user = auth().currentUser;
      let post = {
        title: placeName,
        slug: slug,
        description: description,
        thumbnail: url,
        createdAt: new Date().getTime(),
        createdBy: user.email,
      };
      firestore()
        .collection('BLOG')
        .doc(slug)
        .set(post)
        .then(() => {
          setLoading(false);
          setPlaceName('');
          setDescription('');
          setImage(null);
          setDbURL('');
        });

      Alert.alert(
        'Blog uploaded!',
        'Your blog has been uploaded successfully!',
      );
    });
    setLoading(false);
  }

  return (
    <ScrollView style={{backgroundColor: SECONDARY_COLOR}}>
      <SafeAreaView style={styles.container}>
        <View style={styles.back}>
          <Icon type="FontAwesome5" name="arrow-circle-left" size={25} />
          <TouchableOpacity onPress={() => navigation.navigate('Blogs')}>
            <Text style={styles.saved}>Back to Blogs Screen</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.withoutBoder}>
          <TouchableOpacity onPress={selectImage}>
            <Text style={styles.images}>Add Image</Text>
          </TouchableOpacity>
          <Icon type="Entypo" name="image" size={20} />
        </View>

        <View>
          {image !== null ? (
            <Image source={{uri: image.uri}} style={styles.imageBox} />
          ) : null}
        </View>

        <View style={styles.input1}>
          <TextInput
            style={styles.textinput1}
            placeholder="Place name"
            keyboardType="default"
            value={placeName}
            underlineColorAndroid="transparent"
            onChangeText={handleName}
          />
        </View>

        <View style={styles.input2}>
          <TextInput
            style={styles.textinput2}
            placeholder="Add description"
            keyboardType="default"
            value={description}
            underlineColorAndroid="transparent"
            multiline={true}
            onChangeText={setDescription}
          />
        </View>

        <View>
          <TouchableOpacity
            disabled={loading}
            style={[styles.buttonContainer, styles.loginButton]}
            onPress={() => uploadBlog()}>
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#FFF"
                animating={loading}
              />
            ) : (
              <Text style={styles.loginText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: SECONDARY_COLOR,
  },

  input1: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 1,
    width: 300,
    height: 45,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'flex-start',
  },

  input2: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 1,
    width: 300,
    height: 200,
    marginBottom: 20,
    alignItems: 'flex-start',
  },

  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 300,
    borderRadius: 30,
  },

  loginButton: {
    backgroundColor: 'black',
  },

  loginText: {
    color: 'white',
  },

  withoutBoder: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  back: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 10,
    marginRight: 120,
  },

  images: {
    fontSize: 17,
    marginRight: 20,
  },

  saved: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 7,
    textDecorationLine: 'underline',
  },

  textinput1: {
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
  },

  textinput2: {
    textAlignVertical: 'top',
    marginLeft: 16,
    marginTop: 5,
    borderBottomColor: '#FFFFFF',
  },

  imageBox: {
    width: 250,
    height: 200,
    alignItems: 'center',
  },
});

export default PostABlog;
