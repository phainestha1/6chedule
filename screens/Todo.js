import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, useColorScheme } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import calendar from "../time";

const STORAGE_KEY = "@toDos";
const NAME_KEY = "@name";

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
          placeholder="일정을 입력해주세요"
          placeholderTextColor="#373737"
          value={text}
          onChangeText={onChange}
          onSubmitEditing={addTodo}
        />
      </InputContainer>
      <UserInfoContainer>
        <Message>안녕하세요 {user}님!</Message>
        <Message>{calendar}</Message>
      </UserInfoContainer>
      <TodoContainer>
        {Object.keys(toDos).map((key) => (
          <ToDoBox key={key}>
            <TodoList>{toDos[key].text}</TodoList>
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
  flex: 5;
  align-items: center;
`;
const ToDoBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 30%;
  height: 5%;
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
