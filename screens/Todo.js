import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";

export default function Todo() {
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [done, setDone] = useState(false);

  useEffect(async () => {
    loadToDos();
  }, []);

  const saveTodos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const hours = new Date().getHours();
    try {
      const getWorks = await AsyncStorage.getItem(STORAGE_KEY);
      if (getWorks) {
        if (String(hours) === "00") {
          await AsyncStorage.removeItem(STORAGE_KEY);
          return setToDos({});
        }
        setToDos(JSON.parse(getWorks));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (payLoad) => setText(payLoad);
  const addTodo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = { ...toDos, [Date.now()]: { text, done } };
    const toDoArr = Object.keys(newToDos);
    if (toDoArr.length >= 7) {
      setText("");
      return Alert.alert("하루 6가지 일만 등록할 수 있어요!");
    }
    setToDos(newToDos);
    await saveTodos(newToDos);
    setText("");
  };

  const handleDone = async (key) => {
    const newToDos = { ...toDos };
    newToDos[key].done = !newToDos[key].done;
    setToDos(newToDos);
    await saveTodos(newToDos);
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

      <TodoContainer>
        {Object.keys(toDos).map((key) => (
          <ToDoBox key={key}>
            <Btn onPress={() => handleDone(key)}>
              <Feather
                name="check"
                size={24}
                color={toDos[key].done ? "red" : "black"}
              />
            </Btn>
            <TodoList>{toDos[key].text}</TodoList>
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
  margin-top: 5%;
`;
const ToDoBox = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 5%;
  margin-bottom: 15px;
`;
const TodoList = styled.Text`
  font-size: 16px;
`;
const Btn = styled.TouchableOpacity``;
