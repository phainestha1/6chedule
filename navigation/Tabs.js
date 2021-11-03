import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Todo from "../screens/Todo";
import Diary from "../screens/Diary";
import { Feather } from "@expo/vector-icons";
import {
  Alert,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { lightTheme, darkTheme } from "../styled";

const Tab = createBottomTabNavigator();
const NAME_KEY = "@name";

const Tabs = () => {
  const isDark = useColorScheme() === "dark";
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    loadUserName();
  }, []);

  const onChange = (payload) => setName(payload);
  const addName = async () => {
    if (name === "") {
      Alert.alert("이름을 입력해주세요.");
      return;
    }
    await saveName(name);
    setName("");
    setLoading(true);
  };
  const saveName = async (toSave) => {
    try {
      await AsyncStorage.setItem(NAME_KEY, toSave);
    } catch (error) {
      console.log(error);
    }
  };
  const loadUserName = async () => {
    const userName = await AsyncStorage.getItem(NAME_KEY);
    if (userName) {
      setLoading(true);
    }
    return;
  };

  return !loading ? (
    <NameSettingContainer>
      <Greeting>안녕하세요! 처음이시군요?</Greeting>
      <Greeting>당신의 이름을 알려주세요</Greeting>
      <TextInput
        value={name}
        onChangeText={onChange}
        onSubmitEditing={addName}
        placeholder="이름을 입력해주세요 (최대 10자)"
        maxLength={10}
        placeholderTextColor="#aaa"
        style={{
          width: "60%",
          height: 40,
          textAlign: "center",
          backgroundColor: "white",
        }}
      />
    </NameSettingContainer>
  ) : (
    <Tab.Navigator
      sceneContainerStyle={{
        backgroundColor: isDark
          ? darkTheme.backgroundColor
          : lightTheme.backgroundColor,
      }}
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? darkTheme.tabColor : lightTheme.tabColor,
        },
        headerTitleStyle: {
          color: isDark ? darkTheme.tabText : lightTheme.tabText,
        },
        tabBarStyle: {
          backgroundColor: isDark ? darkTheme.tabColor : lightTheme.tabColor,
        },
        tabBarActiveTintColor: isDark ? "#FBC740" : "black",
        tabBarInactiveTintColor: "#aaa",
        // headerRight: () => (
        //   <TouchableOpacity onPress={() => console.log("hello")}>
        //     <Feather
        //       name="user"
        //       size={24}
        //       color={isDark ? darkTheme.tabText : lightTheme.tabText}
        //       style={{ paddingRight: 12 }}
        //     />
        //   </TouchableOpacity>
        // ),
      }}
    >
      <Tab.Screen
        name="할 일"
        component={Todo}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <Ionicons
                name="document-text-outline"
                color={color}
                size={size}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="다이어리"
        component={Diary}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="calendar-sharp" color={color} size={size} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

const NameSettingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.backgroundColor};
`;
const Greeting = styled.Text`
  font-weight: 600;
  margin-bottom: 10px;
  color: ${(props) => props.theme.textColor};
`;

export default Tabs;
