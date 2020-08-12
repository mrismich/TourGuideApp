import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Container, Header, Content, Accordion, Icon, Animated } from "native-base";

const ref = firestore().collection('Area');

class YourPlan extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      area: props.route.params.Area,
      city: props.route.params.City,
      plan: props.route.params.Plan,
      dataArray: [],
      places: []
    };
  }

  async PlacesToVisit() {
    const doc = await ref.doc(this.state.area).collection('City').
      doc(this.state.city).collection('Plans').doc(this.state.plan).get();

    this.setState({ places: doc.data().PlacesToVisit });

  }

  async savePlan() {

    // var user = firebase.auth().currentUser;
    var user= auth().currentUser;
    const db = firestore().collection('users').doc(user.email).collection('Saved Plans');


    await db.doc(this.state.area + " " + this.state.city + " " + this.state.plan).set({
      Area: this.state.area,
      City: this.state.city,
      Plan: this.state.plan
    });
  }

  async plannedPlaces() {
    this.PlacesToVisit();

    await ref.doc(this.state.area).collection('City').doc(this.state.city).collection('Places').get().then((querySnapshot) => {
      const plannedPlaces = [];
      querySnapshot.forEach((doc) => {
        for (let i = 0; i < this.state.places.length; i++) {
          if (doc.data().Name == this.state.places[i]) {
            plannedPlaces.push({ name: doc.data().Name, description: doc.data().Description, static: doc.data().image[0] })
          }
        }
      })

      this.setState({ dataArray: plannedPlaces });

    })
  }

  componentDidMount() {
    this.plannedPlaces();
  }
  
  _renderHeader(item, expanded) {
    return (
      <View style={{
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#7adea2"
      }}>
        <Text style={{ fontWeight: "600" }}>
          {" "}{item.name}
        </Text>

        {expanded
          ? <Icon style={{ fontSize: 18 }} name="remove-circle" />
          : <Icon style={{ fontSize: 18 }} name="add-circle" />}
      </View>
    );
  }
  _renderContent(item) {
    return (
      <View>
        <Text style={styles.description, styles.bold}>Image: </Text>
        <View style={styles.backgroundColor}>
          <Image
            style={styles.tinyLogo}
            source={{ uri: item.static }}
          />
        </View>
        <Text style={styles.description, styles.bold}>Description: </Text>
        <Text style={styles.description}>{item.description} </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.title}>
          <Text style={styles.titleText}>In the {this.state.plan}, the Places you can visit in {this.state.city} that is in the {this.state.area} Area are: </Text>
        </View>


        <View style={styles.list}>
          <Container>
            <Content padder style={{ backgroundColor: "#A9DFBF" }}>
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

        <View style={styles.savePlan}>
            <TouchableOpacity style={[styles.buttonContainer1, styles.saveButtonColor]}
              onPress={() => {
                // var user = firebase.auth().currentUser;
                var user = auth().currentUser;
                firestore().collection('users').doc(user.email).collection('Saved Plans').
                  doc(this.state.area + " " + this.state.city + " " + this.state.plan).get().
                  then(documentSnapshot => {
                    documentSnapshot.exists;
                    if (documentSnapshot.exists) {
                      Alert.alert("Alert", "This plan already exists.")
                    }
                    else {
                      this.savePlan();
                      Alert.alert("Success", "Plan has been saved successfully.")
                    }
                  });
              }}>
              <Text style={styles.buttonText}>Save this Plan</Text>
            </TouchableOpacity>
          </View>

        <View style={styles.buttons}>
          <View style={styles.newPlan}>
            <TouchableOpacity style={[styles.buttonContainer2, styles.buttonColor]}
              onPress={() => this.props.navigation.navigate('Plan a Trip')}>
              <Text style={styles.buttonText}>Make a new Plan</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.savedPlans}>
            <TouchableOpacity style={[styles.buttonContainer2, styles.buttonColor]}
              onPress={() => 
              {
                this.props.navigation.navigate('Saved Plans');
              }
                
            }>
              <Text style={styles.buttonText}>View Saved Plans</Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#A9DFBF',
  },

  title: {
    flex: 2,
    alignItems: "center"
  },

  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginRight: 30,
    marginLeft: 30,
    color: 'red',
    fontStyle: 'italic'
  },

  list: {
    flex: 6,
  },

  savePlan: {
    flex: 1,
    alignItems: "center"
  },

  buttons: {
    flex: 1,
    flexDirection: "row",
    alignContent: 'center'
  },

  newPlan: {
    flex: 3,
    alignItems: "center"
  },

  savedPlans: {
    flex: 3,
    alignItems: "center"
  },

  description: {
    backgroundColor: "#e3f1f1",
    padding: 10,
    fontStyle: "italic",
  },

  bold: {
    backgroundColor: "#e3f1f1",
    padding: 10,
    fontStyle: "italic",
    fontWeight: "bold"
  },

  backgroundColor: {
    backgroundColor: "#e3f1f1",
    alignItems: 'center'
  },

  tinyLogo: {
    width: 270,
    height: 200,
  },

  filterText: {
    color: 'black',
  },

  buttonContainer1: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: 150,
    borderRadius: 30,
  },

  buttonContainer2: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: 130,
    borderRadius: 10,
  },

  buttonColor: {
    backgroundColor: "#24a0ed",
  },

  saveButtonColor: {
    backgroundColor: "black",
  },

  buttonText: {
    color: 'white'
  },

  buttonContainer2: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: 130,
    borderRadius: 10,
  },

  buttonColor: {
    backgroundColor: "#24a0ed",
  },

  saveButtonColor: {
    backgroundColor: "black",
  },

  buttonText: {
    color: 'white'
  },

});

export default YourPlan;