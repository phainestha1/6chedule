import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Todo from "../screens/Todo";
import Diary from "../screens/Diary";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, useColorScheme } from "react-native";

const Tab = createBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerRight: () => (
        <TouchableOpacity onPress={() => console.log("hello")}>
          <Feather
            name="user"
            size={24}
            color="black"
            style={{ paddingRight: 12 }}
          />
        </TouchableOpacity>
      ),
    }}
  >
    <Tab.Screen name="할 일" component={Todo} />
    <Tab.Screen name="다이어리" component={Diary} />
  </Tab.Navigator>
);

export default Tabs;
