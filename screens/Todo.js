import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import calender from "../time";

const STORAGE_KEY = "@toDos";

export default function Todo() {
  // Variables
  let itemList = {};
  let finalList = {};

  // States for setting a schedule
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  // State of a schedule in progress (done = false)
  const [toDos, setToDos] = useState({});

  useEffect(async () => {
    loadToDos();
  }, []);

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
          console.log(item[i].date);
          itemList = { [item[i].key]: item[i] };
          Object.assign(finalList, itemList);
        }
      }
    }
  };

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadToDos = async () => {
    try {
      const getWorks = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));
      if (getWorks) {
        const item = Object.keys(getWorks).map((key) => getWorks[key]);
        dateVerification(item);
        Object.assign(getWorks, finalList);
        setToDos(getWorks);
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

  return (
    <>
      <InputContainer>
        <TextInput
          style={styles.textInput}
          placeholder="일정을 입력해주세요"
          value={text}
          onChangeText={onChange}
          onSubmitEditing={addTodo}
        />
      </InputContainer>
      <Today>{calender}</Today>
      <TodoContainer>
        {Object.keys(toDos).map((key) => (
          <ToDoBox key={key}>
            <TodoList>{toDos[key].text}</TodoList>
            <Btn onPress={() => handleDone(key)}>
              <Feather
                name="check"
                size={24}
                color={toDos[key].done ? "red" : "black"}
              />
            </Btn>
          </ToDoBox>
        ))}
      </TodoContainer>
    </>
  );
}

const styles = StyleSheet.create({
  textInput: {
    width: "80%",
    fontSize: 16,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 50,
  },
});

const InputContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: teal;
`;
const TodoContainer = styled.View`
  flex: 10;
  align-items: center;
  margin-top: 20%;
`;
const ToDoBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 30%;
  height: 5%;
  margin-bottom: 15px;
`;
const TodoList = styled.Text`
  font-size: 18px;
`;
const Today = styled.Text`
  text-align: center;
  font-size: 16px;
  margin-top: 5%;
`;
const Btn = styled.TouchableOpacity``;
