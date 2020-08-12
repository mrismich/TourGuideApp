import React from 'react';
import 'react-native-gesture-handler';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Container, Content, Accordion, Icon} from 'native-base';
import Loading from './Loading';
import {PRIMARY_COLOR, SECONDARY_COLOR, ASSET_COLOR} from '../utils/colors';
const ref = firestore().collection('plans');

class MyPlans extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataArray: [],
      blogs: [],
      loading: true,
    };
  }

  async getMyPlans() {
    var user = auth().currentUser;
    await ref
      .where('createdBy', '==', user.email)
      .onSnapshot(async (querySnapshot) => {
        const temp = [];
        await querySnapshot.docs.forEach((doc) => {
          temp.push(doc.data());
        });
        this.setState({dataArray: temp, loading: false});
      });
  }

  componentDidMount() {
    this.getMyPlans();
  }

  //   _renderItem({item}) {
  //     return (
  //       <TouchableOpacity
  //         onPress={() => this.props.navigation.navigate('Plan')}
  //         style={{
  //           padding: 10,
  //           marginVertical: 3,
  //           justifyContent: 'center',
  //           backgroundColor: PRIMARY_COLOR,
  //         }}>
  //         <Text
  //           style={{
  //             fontWeight: 'bold',
  //             fontSize: 17,
  //             marginLeft: 5,
  //             color: SECONDARY_COLOR,
  //           }}>
  //           {item.searchedPlace.name}
  //         </Text>
  //         <Text
  //           style={{
  //             fontSize: 12,
  //             marginLeft: 5,
  //             color: SECONDARY_COLOR,
  //           }}>
  //           {item.searchedPlace.address}
  //         </Text>
  //       </TouchableOpacity>
  //     );
  //   }

  render() {
    return (
      <View style={styles.container}>
        <Loading loading={this.state.loading} />
        <View style={styles.title}>
          <Text style={styles.titleText}>My Uploaded Plans are: </Text>
        </View>

        <View style={styles.list}>
          <FlatList
            data={this.state.dataArray}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Plan', {plan:item})
                  }
                  style={{
                    padding: 10,
                    marginVertical: 3,
                    justifyContent: 'center',
                    backgroundColor: PRIMARY_COLOR,
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 17,
                      marginLeft: 5,
                      color: SECONDARY_COLOR,
                    }}>
                    {item.searchedPlace.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      marginLeft: 5,
                      color: SECONDARY_COLOR,
                    }}>
                    {item.searchedPlace.address}
                  </Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item, index) => 'TGA' + index}
          />
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

export default MyPlans;
