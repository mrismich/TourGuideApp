import React from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Container, Header, Content, Accordion, Icon  } from "native-base";

const ref = firestore().collection('users');

class SavedPlans extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataArray: [],
            plans: []
        };
    }

    async getSavedPlans() {
        // var user = firebase.auth().currentUser;
        var user = auth().currentUser;
        await ref.doc(user.email).collection('Saved Plans').get().then((querySnapshot) => {
            const savedPlans = [];
            querySnapshot.forEach((doc) => {

                savedPlans.push({ name: doc.id, area: doc.data().Area, city: doc.data().City, plan: doc.data().Plan, navigation: this.props.navigation })
            })

            this.setState({ dataArray: savedPlans });
        })
    }

    componentDidMount() {
        this.getSavedPlans();

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
            <View style={{ backgroundColor: "#e3f1f1", padding: 10 }}>
                <Text style={styles.description, styles.bold}>Area: </Text>
                <Text style={styles.description}>{item.area} </Text>

                <Text style={styles.description, styles.bold}>City: </Text>
                <Text style={styles.description}>{item.city} </Text>

                <Text style={styles.description, styles.bold}>Plan: </Text>
                <Text style={styles.description}>{item.plan} </Text>

                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]}
                        onPress={() => item.navigation.navigate('Your Plan', {
                            Area: item.area,
                            City: item.city,
                            Plan: item.plan
                        })}>

                        <Text style={styles.loginText}>View Plan</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]}
                        onPress={() => {
                            // var user = firebase.auth().currentUser;
                            var user = auth().currentUser;
                            ref.doc(user.email).collection('Saved Plans').doc(item.name).delete();
                            Alert.alert("Success", "This plan has been deleted.");
                            item.navigation.navigate("Plan a Trip")
                        }}>

                        <Text style={styles.loginText}>Delete Plan</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.title}>
                    <Text style={styles.titleText}>Your Saved Plans are: </Text>
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

                <View style={styles.back}>
                    <TouchableOpacity style={[styles.buttonContainer2, styles.buttonColor]}
                        onPress={() => this.props.navigation.navigate('Plan a Trip')}>
                        <Text style={[styles.loginText, {fontSize: 17}]}>Make a new Plan</Text>
                    </TouchableOpacity>
                </View>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#A9DFBF',
    },

    back: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 100,
        alignItems: "center",
    },

    saved: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 7,
    },

    list: {
        flex: 8
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

    buttonContainer: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        width: 100,
        borderRadius: 30,
        backgroundColor: "#e3f1f1",
        padding: 10
    },

    buttonContainer2: {
        height: 35,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        width: 150,
        borderRadius: 10
    },

    loginButton: {
        backgroundColor: "black",
    },

    buttonColor: {
        backgroundColor: "#24a0ed"
    },

    loginText: {
        color: 'white',
    },

    title: {
        flex: 1,
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


});

export default SavedPlans