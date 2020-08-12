import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import {Icon} from 'native-base';
import {Ionicon} from 'native-base';
import RNPickerSelect from 'react-native-picker-select';
import firestore from '@react-native-firebase/firestore';
import RNGooglePlaces from 'react-native-google-places';
import auth from '@react-native-firebase/auth';
import {PRIMARY_COLOR, SECONDARY_COLOR, ASSET_COLOR} from '../utils/colors';
import Geolocation from '@react-native-community/geolocation';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

var googleMapsClient = require('react-native-google-maps-services').createClient(
  {
    key: 'AIzaSyBVgcrreZ7Er1uacgwSPlQNrpJw1eN3Fn8',
  },
);

function NewPlan({navigation}) {
  // const ref = firestore().collection('Area');
  // const [Area, setArea] = useState([]);
  // const [City, setCity] = useState([]);
  // const [Plans, setPlans] = useState([]);
  // const [Places, setPlaces] = useState([]);
  // const [SelectedArea, SetSelectedArea] = useState('');
  // const [SelectedCity, SetSelectedCity] = useState('');
  // const [SelectedPlan, SetSelectedPlan] = useState('');
  //
  // async function loadAreas() {
  //     await ref.get().then((querySnapshot) => {
  //         const tempDoc = []
  //         querySnapshot.forEach((doc) => {
  //             tempDoc.push({label: doc.id, value: doc.id})
  //         })
  //         setArea(tempDoc)
  //     })
  // }
  //
  // async function LoadCities(area) {
  //     await ref.doc(area).collection('City').get().then((querySnapshot) => {
  //         const cities = []
  //         querySnapshot.forEach((doc) => {
  //             cities.push({label: doc.id, value: doc.id})
  //         })
  //         setCity(cities)
  //     })
  // }
  //
  // async function LoadPlans(city) {
  //     await ref.doc(SelectedArea).collection('City').doc(city).collection('Plans').get().then((querySnapshot) => {
  //         const plans = []
  //         querySnapshot.forEach((doc) => {
  //             plans.push({label: doc.id, value: doc.id})
  //         })
  //         setPlans(plans)
  //     })
  // }
  //
  // async function PlacesToVisit(plans) {
  //     const doc = await ref.doc(SelectedArea).collection('City').doc(SelectedCity).collection('Plans').doc(plans).get();
  //
  //     setPlaces(doc.data().PlacesToVisit)
  // }
  //
  // useEffect(() => {
  //     loadAreas();
  // });
  //
  // const pickerStyles = {
  //     inputAndroid: {
  //         fontSize: 16,
  //         paddingHorizontal: 10,
  //         paddingVertical: 8,
  //         borderWidth: 0.5,
  //         borderRadius: 30,
  //         borderColor: 'black',
  //         color: 'black',
  //         paddingRight: 30,
  //         width: 200
  //     },
  //
  //     iconContainer: {
  //         top: 15,
  //         right: 10,
  //     },
  //
  //     placeholder: {
  //         color: 'black',
  //         fontSize: 13
  //     }
  // }
  const [searchedPlace, setSearchedPlace] = useState({});
  const [currentLocation, setCurrentLocation] = useState({});
  const [distanceFromSelectedPlace, setDistanceFromSelectedPlace] = useState(
    {},
  );
  const [durationFromSelectedPlace, setDurationFromSelectedPlace] = useState(
    {},
  );
  const [nearbyRestaurantsOfPlace, setNearbyRestaurantsOfPlace] = useState([]);
  const [savingPlan, setSavingPlan] = useState(false);
  const openSearchModal = () => {
    RNGooglePlaces.openAutocompleteModal()
      .then((place) => {
        setSearchedPlace(place);
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
        googleMapsClient.distanceMatrix(
          {
            origins: [
              `${currentLocation.coords.latitude},${currentLocation.coords.longitude}`,
            ],
            destinations: [
              `${place.location.latitude},${place.location.longitude}`,
            ],
          },
          (err, response) => {
            if (!err) {
              let rows = response.json.rows;
              rows.map((r) => {
                let els = r.elements;
                if (els.length > 0) {
                  setDistanceFromSelectedPlace(els[0].distance);
                  setDurationFromSelectedPlace(els[0].duration);
                }
              });
            }
          },
        );
        googleMapsClient.placesNearby(
          {
            language: 'en',
            location: [place.location.latitude, place.location.longitude],
            radius: 10000,
            minprice: 1,
            maxprice: 4,
            type: 'restaurant',
          },
          (err, response) => {
            if (!err) {
              setNearbyRestaurantsOfPlace(response.json.results);
            }
          },
        );
      })
      .catch((error) => console.log(error.message)); // error is a Javascript Error object
  };

  useEffect(() => {
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((status) => {
      if (RESULTS.GRANTED === status) {
        Geolocation.watchPosition((position) => {
          setCurrentLocation(position);
        });
      }
    });
  });

  return (
    <View style={styles.container}>
      {(Object.keys(currentLocation).length === 0 || savingPlan) && (
        <ActivityIndicator
          color={PRIMARY_COLOR}
          size={'large'}
          style={{marginVertical: 10}}
        />
      )}
      <Text style={{fontSize: 11, color: '#777'}}>
        Place ID: {searchedPlace.placeID}
      </Text>
      <Text style={{fontWeight: 'bold', fontSize: 22}}>
        {searchedPlace.name}
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon type="AntDesign" name="star" style={{fontSize: 12}} />
        <Text style={{fontSize: 16}}> {searchedPlace.rating}</Text>
        <Text>, </Text>
        <Icon type="MaterialIcons" name="location-on" style={{fontSize: 12}} />
        <Text style={{fontSize: 14}}>{searchedPlace.address}</Text>
      </View>
      <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 10}}>
        Nearby Hotels / Restaurants
      </Text>
      <FlatList
        data={nearbyRestaurantsOfPlace}
        contentContainerStyle={{
          backgroundColor: '#ccc',
          borderRadius: 5,
          marginTop: 10,
        }}
        renderItem={(item) => {
          let place = item.item;
          return (
            <View
              style={{
                borderRadius: 5,
                padding: 10,
              }}>
              <Text style={{fontSize: 10, color: '#777'}}>
                Place ID: {place.place_id}
              </Text>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>
                {place.name}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon type="AntDesign" name="star" style={{fontSize: 12}} />
                <Text style={{fontSize: 14}}> {place.rating}</Text>
                <Text>, </Text>
                <Icon
                  type="MaterialIcons"
                  name="location-on"
                  style={{fontSize: 12}}
                />
                <Text style={{fontSize: 12}}>{place.vicinity}</Text>
              </View>
            </View>
          );
        }}
        keyExtractor={(item, index) => 'TGA' + index}
      />
      <View
        style={{
          // position: 'absolute',
          // bottom: 0,
          // left: 0,
          // right: 0,
          padding: 10,
          borderTopWidth: 2,
          borderTopColor: PRIMARY_COLOR,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold'}}>
              {distanceFromSelectedPlace.text}
            </Text>
            <Text>Distance</Text>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold'}}>
              {durationFromSelectedPlace.text}
            </Text>
            <Text>Duration</Text>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold'}}>
              {distanceFromSelectedPlace.value / 1000}
            </Text>
            <Text>Travel Cost</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => openSearchModal()}
            style={{
              flex: 1,
              padding: 15,
              backgroundColor: '#777',
              borderRadius: 20,
              marginTop: 20,
              marginRight: 5,
            }}
            disabled={Object.keys(currentLocation).length === 0 || savingPlan}>
            <Text style={{textAlign: 'center', color: 'white'}}>
              Pick a Place
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              let user = auth().currentUser;
              setSavingPlan(true);
              firestore()
                .collection('plans')
                .doc(searchedPlace.placeID)
                .set({
                  searchedPlace,
                  distanceFromSelectedPlace,
                  durationFromSelectedPlace,
                  nearbyRestaurantsOfPlace,
                  createdBy: user.email,
                })
                .then(() => {
                  setSavingPlan(false);
                  Alert.alert(
                    '',
                    'Your plan for "' +
                      searchedPlace.name +
                      '" has been saved successfully.',
                  );
                });
            }}
            style={{
              flex: 1,
              padding: 15,
              backgroundColor: PRIMARY_COLOR,
              borderRadius: 20,
              marginTop: 20,
              marginLeft: 5,
            }}
            disabled={Object.keys(currentLocation).length === 0 || savingPlan}>
            <Text style={{textAlign: 'center', color: 'white'}}>
              Save A Plan
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/*<View style={styles.titleView}>*/}
      {/*    <Text style={styles.title}>Make a plan for your trip</Text>*/}
      {/*</View>*/}

      {/*<View style={styles.boder}>*/}

      {/*    <View style={styles.dropdown}>*/}
      {/*        <Text style={styles.dpText}>Select an Area</Text>*/}
      {/*        <RNPickerSelect*/}
      {/*            placeholder={{*/}
      {/*                label: 'Area',*/}
      {/*                value: null,*/}
      {/*                color: 'red',*/}
      {/*            }}*/}

      {/*            style={pickerStyles}*/}

      {/*            onValueChange={(value) => {*/}
      {/*                LoadCities(value), SetSelectedArea(value)*/}
      {/*            }}*/}
      {/*            useNativeAndroidPickerStyle={false}*/}
      {/*            items={Area}*/}

      {/*            Icon={() => {*/}
      {/*                return <Icon type="AntDesign" name="caretdown" size={15} />;*/}
      {/*            }}*/}
      {/*        />*/}
      {/*    </View>*/}

      {/*    <View style={styles.dropdown}>*/}
      {/*        <Text style={styles.dpText}>Select a City</Text>*/}
      {/*        <RNPickerSelect*/}
      {/*            placeholder={{*/}
      {/*                label: 'City',*/}
      {/*                value: null,*/}
      {/*                color: 'red',*/}
      {/*            }}*/}

      {/*            style={pickerStyles}*/}

      {/*            onValueChange={(value) => {*/}
      {/*                LoadPlans(value), SetSelectedCity(value)*/}
      {/*            }}*/}
      {/*            useNativeAndroidPickerStyle={false}*/}
      {/*            items={City}*/}

      {/*            Icon={() => {*/}
      {/*                return <Icon type="AntDesign" name="caretdown" size={15} />;*/}
      {/*            }}*/}
      {/*        />*/}
      {/*    </View>*/}

      {/*    <View style={styles.dropdown}>*/}
      {/*        <Text style={styles.dpText}>Select a Plan</Text>*/}
      {/*        <RNPickerSelect*/}
      {/*            placeholder={{*/}
      {/*                label: 'Plans',*/}
      {/*                value: null,*/}
      {/*                color: 'red',*/}
      {/*            }}*/}

      {/*            style={pickerStyles}*/}

      {/*            onValueChange={(value) => {*/}
      {/*                PlacesToVisit(value), SetSelectedPlan(value)*/}
      {/*            }}*/}
      {/*            useNativeAndroidPickerStyle={false}*/}
      {/*            items={Plans}*/}

      {/*            Icon={() => {*/}
      {/*                return <Icon type="AntDesign" name="caretdown" size={15} />;*/}
      {/*            }}*/}
      {/*        />*/}
      {/*    </View>*/}
      {/*</View>*/}

      {/*<View style={styles.withoutBoder}>*/}
      {/*    <Icon type="FontAwesome" style={{marginRight: 10}} name="bookmark" size={20} />*/}
      {/*    <TouchableOpacity*/}
      {/*        onPress={() => navigation.navigate('Saved Plans')}>*/}

      {/*        <Text style={styles.saved}>Saved Plans</Text>*/}
      {/*    </TouchableOpacity>*/}
      {/*</View>*/}

      {/*<View>*/}
      {/*    <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]}*/}
      {/*                      onPress={() => {*/}
      {/*                          if (SelectedArea == '' || SetSelectedCity == '' || SelectedPlan == '') {*/}
      {/*                              Alert.alert("Error", "Select all fields.")*/}
      {/*                          } else {*/}
      {/*                              navigation.navigate('Your Plan', {*/}
      {/*                                  Area: SelectedArea,*/}
      {/*                                  City: SelectedCity,*/}
      {/*                                  Plan: SelectedPlan*/}
      {/*                              })*/}

      {/*                              SetSelectedArea('');*/}
      {/*                              SetSelectedCity('');*/}
      {/*                              SetSelectedPlan('');*/}
      {/*                          }*/}
      {/*                      }*/}
      {/*                      }>*/}

      {/*        <Text style={styles.loginText}>Plan</Text>*/}
      {/*    </TouchableOpacity>*/}
      {/*</View>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  // boder: {
  //     flex: 1,
  //     flexDirection: 'column',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //     borderColor: 'black',
  //     borderStyle: 'solid',
  //     borderWidth: 2,
  //     marginBottom: 20,
  //     width: 300,
  // },
  //
  // buttonContainer: {
  //     height: 45,
  //     flexDirection: 'row',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     marginBottom: 10,
  //     width: 300,
  //     borderRadius: 30,
  //     marginBottom: 80
  // },
  //
  // loginButton: {
  //     backgroundColor: "black",
  // },
  //
  // loginText: {
  //     color: 'white',
  // },
  //
  // dropdown: {
  //     alignItems: 'center',
  //     marginBottom: 20,
  //     marginTop: 20
  // },
  //
  // dpText: {
  //     fontSize: 17,
  //     fontWeight: 'bold',
  //     marginBottom: 10
  // },
  //
  // titleView: {
  //     marginTop: 15,
  //     marginBottom: 30,
  //     alignItems: "center"
  // },
  //
  // withoutBoder: {
  //     flexDirection: 'row',
  //     marginTop: 10,
  //     marginBottom: 30,
  //     alignItems: "flex-start",
  //     width: 300
  // },
  //
  // title: {
  //     fontSize: 25,
  //     fontWeight: 'bold',
  //     marginLeft: 7,
  //     fontStyle: 'italic'
  // },
  //
  // saved: {
  //     fontSize: 15,
  //     fontWeight: "bold"
  // }
});

export default NewPlan;
