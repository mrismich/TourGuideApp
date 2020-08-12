import React from 'react';
import 'react-native-gesture-handler';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Container, Content, Accordion, Icon} from 'native-base';
import Loading from './Loading';
import {PRIMARY_COLOR, SECONDARY_COLOR, ASSET_COLOR} from '../utils/colors';
const ref = firestore().collection('users');

class Blogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataArray: [],
      blogs: [],
      loading: false,
    };
  }

  async allBlogs() {
    this.setState({loading: true});
    const ref = firestore().collection('BLOG');
    await ref.onSnapshot(async (querySnapshot) => {
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
    // ref.get().then(async (querySnapshot) => {
    //   const temp = [];
    //   await querySnapshot.forEach(async (doc) => {
    //     temp.push({
    //       name: doc.data().title,
    //       description: doc.data().description,
    //       image: doc.data().thumbnail,
    //     });
    //     this.setState({dataArray: temp, loading: false});
    //   });
    // });
  }

  componentDidMount() {
    this.allBlogs();
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
          <Text style={styles.titleText}>Blogs uploaded by all travelers:</Text>
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
            onPress={() => this.props.navigation.navigate('My Blogs')}>
            <Text style={[styles.loginText, {fontSize: 14}]}>My Blogs</Text>
          </TouchableOpacity>

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
    flexDirection: 'column',
    paddingHorizontal: 20,
    backgroundColor: SECONDARY_COLOR,
  },

  back: {
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
    flex: 1,
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

  buttonContainer2: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
    width: 150,
    borderRadius: 20,
  },

  buttonColor: {
    backgroundColor: PRIMARY_COLOR,
  },

  loginText: {
    color: 'white',
  },

  title: {
    alignItems: 'center',
  },

  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: 'center',
    marginRight: 30,
    marginLeft: 30,
    color: ASSET_COLOR,
    fontStyle: 'italic',
  },
});

export default Blogs;
