import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@toDos";

export default function Todo() {
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  useEffect(async () => {
    loadToDos();
  }, []);

  const saveTodos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if (s) {
        setToDos(JSON.parse(s));
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
    const newToDos = { ...toDos, [Date.now()]: { text } };
    setToDos(newToDos);
    await saveTodos(newToDos);
    setText("");
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
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 5%;
  margin-bottom: 15px;
`;
const TodoList = styled.Text`
  font-size: 16px;
`;
