import React, {useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Image,
  Alert,
  BackHandler,
} from 'react-native';
import {Icon} from 'native-base';
import NewPlan from './NewPlan';
import YourPlan from './YourPlan';
import Profile from './Profile';
import Blogs from './Blogs';
import Hotels from './Hotels';
import Places from './Places';
import PostABlog from './PostABlog';
import SavedPlans from './SavedPlans';
import MyBlogs from './MyBlogs';
import MyPlans from './MyPlans';
import Plan from './Plan';
import ResetPassword from './ResetPwd';
import {DrawerActions} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import GallerySwiper from 'react-native-gallery-swiper';

import auth from '@react-native-firebase/auth';
import {PRIMARY_COLOR, SECONDARY_COLOR, ASSET_COLOR} from '../utils/colors';

function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.half1}>
        <View style={styles.image}>
          <GallerySwiper
            style={{backgroundColor: SECONDARY_COLOR}}
            images={[
              {
                url:
                  'https://insider.pk/wp-content/uploads/2015/04/1-Lake-Saif-ul-Malook.jpg',
              },
              {
                url:
                  'https://insider.pk/wp-content/uploads/2015/04/2.-Concordia.jpg',
              },
              {
                url:
                  'https://insider.pk/wp-content/uploads/2015/04/Deosai_Plateau_2-1024x768.jpg',
              },
              {
                url:
                  'https://insider.pk/wp-content/uploads/2015/04/4.-Kalash-Valley.jpg',
              },
              {
                url:
                  'https://insider.pk/wp-content/uploads/2015/04/7.-Badshahi-mosque.jpg',
              },
              {
                url:
                  'https://insider.pk/wp-content/uploads/2015/04/01-Rohtas-Fort.jpg',
              },
              {
                url:
                  'https://insider.pk/wp-content/uploads/2015/04/9.-Hingol-National-park.jpg',
              },
              {
                url:
                  'https://insider.pk/wp-content/uploads/2015/04/10.-Wagah-border.jpg',
              },
              {
                url:
                  'https://insider.pk/wp-content/uploads/2015/04/11.-taxila-1024x655.jpg',
              },
              {
                url:
                  'https://insider.pk/wp-content/uploads/2015/04/12.-Mazar-e-Quaid-1024x768.jpg',
              },
              {
                url:
                  'https://insider.pk/wp-content/uploads/2015/04/13.-Mohenjo-Daro.jpg',
              },
              {
                url:
                  'https://insider.pk/wp-content/uploads/2015/04/15.-Pir-Sohawa-1024x768.jpg',
              },
            ]}
            initialNumToRender={2}
            sensitiveScroll={false}
          />
        </View>
      </View>
      <View style={styles.half2}>
        <View style={styles.planMargin}>
          <TouchableOpacity onPress={() => navigation.navigate('NewPlan')}>
            <Image style={styles.icon} source={require('../assets/plan.png')} />
          </TouchableOpacity>
          <Text style={styles.options}>Plan a trip</Text>
        </View>
        <View style={styles.hotelMargin}>
          <TouchableOpacity onPress={() => navigation.navigate('Hotels')}>
            <Image
              style={styles.icon}
              source={require('../assets/hotel.png')}
            />
          </TouchableOpacity>
          <Text style={styles.options}>Hotels</Text>
        </View>
      </View>

      <View style={styles.half2}>
        <View style={styles.savedPlansMargin}>
          <TouchableOpacity onPress={() => navigation.navigate('Places')}>
            <Image
              style={styles.icon}
              source={require('../assets/place.png')}
            />
          </TouchableOpacity>
          <Text style={styles.options}>Places</Text>
        </View>
        <View style={styles.blogMargin}>
          <TouchableOpacity onPress={() => navigation.navigate('Blogs')}>
            <Image style={styles.icon} source={require('../assets/blog.png')} />
          </TouchableOpacity>
          <Text style={styles.options}>Blogs</Text>
        </View>
      </View>

      <View>
        <TouchableOpacity onPress={() => navigation.navigate('NewPlan')}>
          <Icon
            type="MaterialIcons"
            style={styles.plusIcon}
            name="add-circle"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Stack = createStackNavigator();

const options = ({navigation}) => ({
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: PRIMARY_COLOR,
  },
  headerTintColor: SECONDARY_COLOR,
  headerTitleStyle: {
    fontWeight: 'bold',
  },

  headerLeft: () => (
    <TouchableOpacity
      style={{marginLeft: 10}}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
      <Icon type="Entypo" name="menu" style={styles.headerIcon} />
    </TouchableOpacity>
  ),

  headerRight: () => (
    <TouchableOpacity
      style={{marginRight: 10}}
      onPress={() =>
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
          {
            text: 'Yes',
            onPress: () =>
              auth()
                .signOut()
                .then(() => {
                  BackHandler.exitApp();
                })
                .catch(function (error) {
                  Alert.alert('Error', error.message);
                }),
            style: 'cancel',
          },
          {text: 'No', onPress: () => console.log('No Pressed')},
        ])
      }>
      <Icon type="Entypo" name="log-out" style={styles.headerIcon} />
    </TouchableOpacity>
  ),
});

function HomeSreen_StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={options} />
    </Stack.Navigator>
  );
}

function NewPlan_StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Plan a Trip" component={NewPlan} options={options} />

      <Stack.Screen name="Your Plan" component={YourPlan} options={options} />

      <Stack.Screen
        name="Saved Plans"
        component={SavedPlans}
        options={options}
      />
    </Stack.Navigator>
  );
}

function Profile_StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} options={options} />
      <Stack.Screen
        name="Reset Password"
        component={ResetPassword}
        options={options}
      />
    </Stack.Navigator>
  );
}

function Blogs_StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Blogs" component={Blogs} options={options} />
      <Stack.Screen
        name="Post A Blog"
        component={PostABlog}
        options={options}
      />
      <Stack.Screen name="My Blogs" component={MyBlogs} options={options} />
    </Stack.Navigator>
  );
}

function Hotels_StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Hotels" component={Hotels} options={options} />
    </Stack.Navigator>
  );
}
function MyPlans_StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="My Plans" component={MyPlans} options={options} />
      <Stack.Screen name="Plan" component={Plan} options={options} />
    </Stack.Navigator>
  );
}

function Places_StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Visitable Places"
        component={Places}
        options={options}
      />
    </Stack.Navigator>
  );
}

const Drawer = createDrawerNavigator();

function Home() {
  // const backAction = () => {
  //   Alert.alert('Confirm Exit', 'Are you sure you want to exit?', [
  //     {text: 'Yes', onPress: () => BackHandler.exitApp()},
  //     {
  //       text: 'No',
  //       onPress: () => null,
  //       style: 'cancel',
  //     },
  //   ]);
  //   return true;
  // };

  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', backAction);

  //   return () =>
  //     BackHandler.removeEventListener('hardwareBackPress', backAction);
  // }, []);

  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerStyle={{
          backgroundColor: PRIMARY_COLOR,
          width: 270,
        }}
        drawerContentOptions={{
          activeBackgroundColor: SECONDARY_COLOR,
          activeTintColor: ASSET_COLOR,
          inactiveTintColor: SECONDARY_COLOR,
          labelStyle: {fontSize: 15, fontWeight: 'bold'},
        }}
        drawerType="front"
        backBehavior="initialRoute">
        <Drawer.Screen
          name="Home"
          component={HomeSreen_StackNavigator}
          options={{
            drawerIcon: ({color}) => (
              <Icon
                type="Entypo"
                name="home"
                size={20}
                style={{color: color}}
              />
            ),
            drawerLabel: 'Home',
          }}
        />

        <Drawer.Screen
          name="NewPlan"
          component={NewPlan_StackNavigator}
          options={{
            drawerIcon: ({color}) => (
              <Icon
                type="FontAwesome"
                name="plane"
                size={20}
                style={{color: color}}
              />
            ),
            drawerLabel: 'New Plan',
          }}
        />
        <Drawer.Screen
          name="MyPlans"
          component={MyPlans_StackNavigator}
          options={{
            drawerIcon: ({color}) => (
              <Icon
                type="FontAwesome"
                name="plane"
                size={20}
                style={{color: color}}
              />
            ),
            drawerLabel: 'My Plans',
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={Profile_StackNavigator}
          options={{
            drawerIcon: ({color}) => (
              <Icon
                type="FontAwesome"
                name="user"
                size={20}
                style={{color: color}}
              />
            ),
            drawerLabel: 'Profile',
          }}
        />

        <Drawer.Screen
          name="Blogs"
          component={Blogs_StackNavigator}
          options={{
            drawerIcon: ({color}) => (
              <Icon
                type="FontAwesome5"
                name="blog"
                size={20}
                style={{color: color}}
              />
            ),
            drawerLabel: 'Blogs',
          }}
        />
        <Drawer.Screen
          name="Hotels"
          component={Hotels_StackNavigator}
          options={{
            drawerIcon: ({color}) => (
              <Icon
                type="FontAwesome"
                name="hotel"
                size={20}
                style={{color: color}}
              />
            ),
            drawerLabel: 'Hotels',
          }}
        />

        <Drawer.Screen
          name="Places"
          component={Places_StackNavigator}
          options={{
            drawerIcon: ({color}) => (
              <Icon
                type="MaterialIcons"
                name="place"
                size={20}
                style={{color: color}}
              />
            ),
            drawerLabel: 'Places',
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: SECONDARY_COLOR,
  },
  headerIcon: {
    color: SECONDARY_COLOR,
    fontSize: 25,
  },
  half1: {
    flex: 2,
    alignItems: 'center',
  },

  half2: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },

  options: {
    textAlign: 'center',
    fontSize: 15,
  },

  image: {
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
    justifyContent: 'center',
  },

  icon: {
    width: 75,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },

  planMargin: {
    marginLeft: -10,
  },

  hotelMargin: {
    marginLeft: 50,
  },

  savedPlansMargin: {
    marginLeft: -10,
    marginTop: -70,
  },

  blogMargin: {
    marginLeft: 50,
    marginTop: -70,
  },

  plusIcon: {
    marginLeft: 270,
    marginBottom: 25,
    marginTop: -30,
    fontSize: 60,
    color: PRIMARY_COLOR,
  },
});

export default Home;
