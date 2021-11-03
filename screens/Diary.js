import React from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

const Diary = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <DiaryMessage>Coming Soon!</DiaryMessage>
  </View>
);

const DiaryMessage = styled.Text`
  color: ${(props) => props.theme.textColor};
`;

export default Diary;
