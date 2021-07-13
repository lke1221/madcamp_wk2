import { TestScheduler } from "jest";
import React from "react";
import { Text } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";

import AuthScreen from './AuthScreen';
import AddAuction from './AddAuction';
import HomeScreen from "./HomeScreen";
import SettingScreen from "./SettingScreen";
import SomethingScreen from "./SomethingScreen";
import ProfileScreen from "./ProfileScreen";
import DetailScreen from "./DetailScreen";

const HomeStack = createStackNavigator(
  {
    HomeScreen,
    AddAuction,
    DetailScreen
  },
  // if you need.
  // recommend custom header
  {
    defaultNavigationOptions: ({ navigation }) => ({
      title: "Home",
    }),
  }
);

const SettingStack = createStackNavigator(
  {
    SettingScreen,
    SomethingScreen,
    ProfileScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      title: "Setting",
    }),
    initialRouteName: "SettingScreen",
  }
);

const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeStack,
    Setting: SettingStack,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let icon = "▲";

        if (routeName === "Home") {
          icon = "🌈";
        } else if (routeName === "Setting") {
          icon = "🌙";
        }

        // can use react-native-vector-icons
        // <Icon name={iconName} size={iconSize} color={iconColor} />
        return (
          <Text style={{ color: (focused && "#46c3ad") || "#888" }}>
            {icon}
          </Text>
        );
      },
    }),
    lazy: false,
    tabBarOptions: {
      activeTintColor: "#46c3ad",
      inactiveTintColor: "#888",
    },
  }
);

const AppStack = createStackNavigator({
    AuthScreen: {
        screen: AuthScreen,
        navigationOptions: ({navigation}) => ({
            headerShown: false,
            //title: "Authentification",
        })
    },
    //AuthScreen : AuthScreen,
    TabNavigator: {
        screen: TabNavigator,
        navigationOptions: ({ navigation }) => ({
            headerShown: false,
        }),
    },
});

export default createAppContainer(AppStack);