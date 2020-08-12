import React from 'react';
import 'react-native-gesture-handler';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Container, Content, Accordion, Icon} from 'native-base';
import Loading from './Loading';
import {PRIMARY_COLOR, SECONDARY_COLOR, ASSET_COLOR} from '../utils/colors';
const ref = firestore().collection('BLOG');

class MyBlogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataArray: [],
      blogs: [],
      loading: true,
    };
  }

  async getMyBlogs() {
    var user = auth().currentUser;
    await ref.where('createdBy','==',user.email).onSnapshot(async (querySnapshot) => {
      const temp = [];
      await querySnapshot.docs.forEach((doc) => {
        temp.push({
          name: doc.data().title,
          description: doc.data().description,
          image: doc.data().thumbnail,
        });
      });
      this.setState({dataArray: temp, loading: false});
    });
   
    // await ref
    //   .doc(user.email)
    //   .collection('My Blogs')
    //   .get()
    //   .then((querySnapshot) => {
    //     const blogs = [];
    //     querySnapshot.forEach((doc) => {
    //       blogs.push({
    //         name: doc.data().PlaceName,
    //         description: doc.data().Description,
    //         image: doc.data().Image,
    //       });
    //     });

    //     this.setState({dataArray: blogs, loading: false});
    //   });
  }

  componentDidMount() {
    this.getMyBlogs();
  }

  _renderHeader(item, expanded) {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          marginVertical:3,
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: PRIMARY_COLOR,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Image
            style={{height: 70, width: 70}}
            resizeMode="contain"
            source={{uri: item.image}}
          />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              marginTop: 10,
              marginLeft: 5,
              color: SECONDARY_COLOR,
            }}>
            {item.name}
          </Text>
        </View>

        {expanded ? (
          <Icon
            type="MaterialIcons"
            style={{fontSize: 18, color: SECONDARY_COLOR}}
            name="remove-circle"
          />
        ) : (
          <Icon
            type="MaterialIcons"
            style={{fontSize: 18, color: SECONDARY_COLOR}}
            name="add-circle"
          />
        )}
      </View>
    );
  }
  _renderContent(item) {
    return (
      <View>
        <Text style={(styles.description, styles.bold)}>Image: </Text>
        <View style={styles.backgroundColor}>
          <Image style={styles.tinyLogo} source={{uri: item.image}} />
        </View>
        <Text style={(styles.description, styles.bold)}>Place Name: </Text>
        <Text style={styles.description}>{item.name} </Text>

        <Text style={(styles.description, styles.bold)}>Description: </Text>
        <Text style={styles.description}>{item.description} </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Loading loading={this.state.loading} />
        <View style={styles.title}>
          <Text style={styles.titleText}>Your Uploaded Blogs are: </Text>
        </View>

        <View style={styles.list}>
          <Container>
            <Content padder style={{backgroundColor: SECONDARY_COLOR}}>
              <Accordion
                dataArray={this.state.dataArray}
                animation={true}
                expanded={true}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
              />
            </Content>
          </Container>
        </View>

        <View style={styles.back}>
          <TouchableOpacity
            style={[styles.buttonContainer2, styles.buttonColor]}
            onPress={() => this.props.navigation.navigate('Post A Blog')}>
            <Text style={[styles.loginText, {fontSize: 14}]}>
              Post a new Blog
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    flexDirection: 'column',
    backgroundColor: SECONDARY_COLOR,
  },

  back: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  saved: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 7,
  },

  list: {
    flex: 8,
  },

  description: {
    backgroundColor: '#e3f1f1',
    padding: 10,
    fontStyle: 'italic',
  },

  bold: {
    backgroundColor: '#e3f1f1',
    padding: 10,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },

  backgroundColor: {
    backgroundColor: '#e3f1f1',
    alignItems: 'center',
  },

  tinyLogo: {
    width: 270,
    height: 200,
  },

  buttonContainer: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    width: 100,
    borderRadius: 30,
    backgroundColor: '#e3f1f1',
    padding: 10,
  },

  buttonContainer2: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    width: 150,
    borderRadius: 20,
  },

  loginButton: {
    backgroundColor: 'black',
  },

  buttonColor: {
    backgroundColor: PRIMARY_COLOR,
  },

  loginText: {
    color: 'white',
  },

  title: {
    flex: 1,
    alignItems: 'center',
  },

  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginRight: 30,
    marginLeft: 30,
    color: ASSET_COLOR,
    fontStyle: 'italic',
  },
});

export default MyBlogs;
