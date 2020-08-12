import 'react-native-gesture-handler';
import React, {Component, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import GallerySwiper from 'react-native-gallery-swiper';
import {Container, Header, Content, Accordion, Icon} from 'native-base';
import RNPickerSelect from 'react-native-picker-select';
import {PRIMARY_COLOR, SECONDARY_COLOR, ASSET_COLOR} from '../utils/colors';
import Loading from './Loading';
const ref = firestore().collection('Area');

class Hotels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Area: [],
      City: [],
      dataArray: [],
      selectedArea: '',
      selectedCity: '',
      loading: false,
    };
  }

  async getAllHotels() {
    this.setState({loading: true});
    await ref.get().then((querySnapshot) => {
      const temp = [];
      querySnapshot.forEach(async (doc1) => {
        await ref
          .doc(doc1.id)
          .collection('City')
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach(async (doc2) => {
              await ref
                .doc(doc1.id)
                .collection('City')
                .doc(doc2.id)
                .collection('Hotels')
                .get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    const swiperimg = [];
                    for (let i = 0; i < doc.data().image.length; i++) {
                      swiperimg.push({
                        url: doc.data().image[i],
                        dimensions: {width: 250, height: 200},
                      });
                    }
                    temp.push({
                      name: doc.id,
                      description: doc.data().Description,
                      price: doc.data().Price,
                      swiper: swiperimg,
                    });
                  });
                  this.setState({dataArray: temp, loading: false});
                });
            });
          });
      });
    });
  }

  async loadAreas() {
    await ref.get().then((querySnapshot) => {
      const tempDoc = [];
      querySnapshot.forEach((doc) => {
        tempDoc.push({label: doc.id, value: doc.id});
      });
      this.setState({Area: tempDoc});
    });
  }

  async LoadCities(area) {
    await ref
      .doc(area)
      .collection('City')
      .get()
      .then((querySnapshot) => {
        const cities = [];
        querySnapshot.forEach((doc) => {
          cities.push({label: doc.id, value: doc.id});
        });

        this.setState({City: cities});
      });
  }

  async filteredHotels(area, city) {
    this.setState({loading:true})
    await ref
      .doc(area)
      .collection('City')
      .doc(city)
      .collection('Hotels')
      .get()
      .then((querySnapshot) => {
        const filteredHotels = [];
        querySnapshot.forEach((doc) => {
          const swiperimg = [];
          for (let i = 0; i < doc.data().image.length; i++) {
            swiperimg.push({url: doc.data().image[i]});
          }

          filteredHotels.push({
            name: doc.id,
            description: doc.data().Description,
            price: doc.data().Price,
            swiper: swiperimg,
          });
        });

        this.setState({dataArray: filteredHotels, loading:false});
      });
  }

  componentDidMount() {
    this.getAllHotels();
    this.loadAreas();
  }

  _renderHeader(item, expanded) {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
          paddingVertical: 2,
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 3,
          backgroundColor: PRIMARY_COLOR,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Image
            style={{height: 70, width: 70}}
            resizeMode="contain"
            source={{uri: item.swiper[0].url}}
          />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
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
        <Text style={(styles.description, styles.bold)}>Images: </Text>
        <View>
          <GallerySwiper
            style={styles.backgroundColor}
            images={item.swiper}
            sensitiveScroll={false}
          />
        </View>
        <Text style={(styles.description, styles.bold)}>Description: </Text>
        <Text style={styles.description}>{item.description} </Text>

        <Text style={(styles.description, styles.bold)}>Price: </Text>
        <Text style={styles.description}>{item.price} </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.filter}>
          <View style={styles.area}>
            <RNPickerSelect
              placeholder={{
                label: 'Area',
                value: null,
                color: 'red',
              }}
              style={pickerStyles1}
              onValueChange={(value) =>
                this.LoadCities(value) && this.setState({selectedArea: value})
              }
              useNativeAndroidPickerStyle={false}
              items={this.state.Area}
              Icon={() => {
                return (
                  <Icon
                    type="AntDesign"
                    name="caretdown"
                    style={{fontSize: 15}}
                  />
                );
              }}
            />
          </View>
          <View style={styles.city}>
            <RNPickerSelect
              placeholder={{
                label: 'City',
                value: null,
                color: 'red',
              }}
              style={pickerStyles1}
              onValueChange={(value) => this.setState({selectedCity: value})}
              useNativeAndroidPickerStyle={false}
              items={this.state.City}
              Icon={() => {
                return (
                  <Icon
                    type="AntDesign"
                    name="caretdown"
                    style={{fontSize: 15}}
                  />
                );
              }}
            />
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              style={[styles.buttonContainer, styles.filterButton]}
              onPress={() => {
                if (
                  this.state.selectedArea == '' ||
                  this.state.selectedCity == ''
                ) {
                  Alert.alert('Alert', 'Select both Area and City.');
                } else {
                  this.filteredHotels(
                    this.state.selectedArea,
                    this.state.selectedCity,
                  );
                }
              }}>
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.list}>
          <Loading loading={this.state.loading} />
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
      </View>
    );
  }
}

const pickerStyles1 = {
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'black',
    color: 'black',
    paddingRight: 30,
    width: 130,
  },

  iconContainer: {
    top: 15,
    right: 10,
  },

  placeholder: {
    color: 'black',
    fontSize: 13,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: SECONDARY_COLOR,
  },

  filter: {
    flex: 1,
    flexDirection: 'row',
  },

  list: {
    flex: 9,
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
    width: 250,
    height: 200,
  },

  area: {
    flex: 4,
    justifyContent: 'center',
    marginLeft: 10,
  },

  city: {
    flex: 4,
    justifyContent: 'center',
  },

  button: {
    flex: 2,
    justifyContent: 'center',
    marginRight: 10,
  },
  buttonContainer: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderRadius: 30,
  },

  filterButton: {
    backgroundColor: 'black',
  },

  filterText: {
    color: 'white',
  },
});

export default Hotels;
