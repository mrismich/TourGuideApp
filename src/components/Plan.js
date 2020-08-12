import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {Icon} from 'native-base';
import {PRIMARY_COLOR} from '../utils/colors';

class Plan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchedPlace: props.route.params.plan.searchedPlace,
      distanceFromSelectedPlace:
        props.route.params.plan.distanceFromSelectedPlace,
      durationFromSelectedPlace:
        props.route.params.plan.durationFromSelectedPlace,
      nearbyRestaurantsOfPlace:
        props.route.params.plan.nearbyRestaurantsOfPlace,
    };
  }
  render() {
    const {
      searchedPlace,
      distanceFromSelectedPlace,
      durationFromSelectedPlace,
      nearbyRestaurantsOfPlace,
    } = this.state;
    return (
      <View style={styles.container}>
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
          <Icon
            type="MaterialIcons"
            name="location-on"
            style={{fontSize: 12}}
          />
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
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default Plan;
