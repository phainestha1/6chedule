import React from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";
import { diaryList } from "./Todo";

const Diary = () => {
  const item = Object.keys(diaryList).map((key) => diaryList[key]);
  console.log(item);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <DiaryMessage>{item.length}</DiaryMessage>
      <DiaryMessage>{item[0].date}</DiaryMessage>
      <DiaryContainer key={Date.now()}>
        {Object.keys(diaryList).map((key) => (
          <DiaryMessage key={key}>{diaryList[key].text}</DiaryMessage>
        ))}
      </DiaryContainer>
    </View>
  );
};

const DiaryMessage = styled.Text`
  color: ${(props) => props.theme.textColor};
`;
const DiaryContainer = styled.View``;

export default Diary;
