import React, { useState, useEffect } from "react";
import { Alert, useColorScheme, StatusBar } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styled from "styled-components/native";
import time from "../time";
import { darkTheme, lightTheme } from "../styled";

const STORAGE_KEY = "@toDos";
const NAME_KEY = "@name";
export let diaryList = {};

export default function Todo() {
  // Dark Mode Verification
  const isDark = useColorScheme() === "dark";

  // Variables
  let itemList = {};
  let finalList = {};
  let getWorks;

  // States for setting a schedule
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const [user, setUser] = useState("");

  // State of a schedule in progress (done = false)
  const [toDos, setToDos] = useState({});

  // useEffect
  useEffect(async () => {
    loadUserName();
    loadToDos();
    await diaryCreator();
  }, [done]);

  // Functions
  const onChange = (payLoad) => setText(payLoad);
  const addTodo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: {
        text,
        done,
        key: Date.now(),
        date: new Date().toLocaleDateString(),
      },
    };
    const toDoArr = Object.keys(newToDos);
    if (toDoArr.length >= 7) {
      setText("");
      return Alert.alert("하루 6가지 일만 등록할 수 있어요!");
    }
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const dateVerification = (item) => {
    for (let i = 0; i < item.length; i++) {
      if (item[i].date < new Date().toLocaleDateString()) {
        if (item[i].done === false) {
          item[i].date = new Date().toLocaleDateString();
          itemList = { [item[i].key]: item[i] };
          Object.assign(finalList, itemList);
          getWorks = {};
        }
      }
    }
  };
  const diaryCreator = async () => {
    const getWorks = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));
    const item = Object.keys(getWorks).map((key) => getWorks[key]);
    for (let i = 0; i < item.length; i++) {
      if (item[i].date <= new Date().toLocaleDateString()) {
        itemList = { [item[i].key]: item[i] };
        Object.assign(diaryList, itemList);
      }
    }
  };

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    try {
      getWorks = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));
      if (getWorks) {
        const item = Object.keys(getWorks).map((key) => getWorks[key]);
        dateVerification(item);
        Object.assign(getWorks, finalList);
        setToDos(getWorks);
        saveToDos(getWorks);
      }
    } catch (error) {
      console.log(error);
    }
    if (getWorks && Object.keys(getWorks).length !== 6) {
      return Alert.alert(
        `${6 - Object.keys(getWorks).length}개의 일정을 추가할 수 있습니다. 😄`
      );
    }
  };
  const handleDone = async (key) => {
    const newToDos = { ...toDos };
    const item = newToDos[key];
    item.done = !item.done;
    setToDos(newToDos);
    await saveToDos(newToDos);
  };
  const loadUserName = async () => {
    const userName = await AsyncStorage.getItem(NAME_KEY);
    setUser(userName);
  };

  return (
    <ToDoSection>
      <StatusBar barStyle={"default"} />
      <UserInfoContainer>
        <Message>{time}</Message>
        <Message>안녕하세요 {user}님!</Message>
      </UserInfoContainer>
      <InputContainer>
        <TextInput
          style={{
            width: "80%",
            fontSize: 16,
            padding: 10,
            borderRadius: 50,
            backgroundColor: isDark ? "#fff" : "#fafafa",
            color: "#000",
            textAlign: "center",
          }}
          placeholder="일정을 입력해주세요 (최대 25자)"
          placeholderTextColor="#373737"
          value={text}
          onChangeText={onChange}
          onSubmitEditing={addTodo}
          maxLength={25}
        />
      </InputContainer>

      <TodoContainer>
        {Object.keys(toDos).map((key) => (
          <ToDoBox key={key}>
            <TodoList
              style={{
                color: toDos[key].done
                  ? "#373737"
                  : isDark
                  ? darkTheme.textColor
                  : lightTheme.textColor,
                textDecorationLine: toDos[key].done ? "line-through" : null,
              }}
            >
              {toDos[key].text}
            </TodoList>
            <Btn onPress={() => handleDone(key)}>
              <Feather
                name="check"
                size={24}
                color={toDos[key].done ? "red" : isDark ? "#aaa" : "#000"}
              />
            </Btn>
          </ToDoBox>
        ))}
      </TodoContainer>
      <BottomContainer />
    </ToDoSection>
  );
}

const ToDoSection = styled.View`
  flex: 1;
`;

const InputContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const TodoContainer = styled.View`
  flex: 4;
  justify-content: center;
`;
const ToDoBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 70px;
  margin-bottom: 3px;
`;
const TodoList = styled.Text`
  font-size: 18px;
  color: ${(props) => props.theme.textColor};
`;
const UserInfoContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const Message = styled.Text`
  text-align: center;
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
`;
const Btn = styled.TouchableOpacity``;
const BottomContainer = styled.View`
  flex: 1;
`;
