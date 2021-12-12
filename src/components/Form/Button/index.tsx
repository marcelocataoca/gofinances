import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";

import { Container, Title } from "./styles";

interface Props extends RectButtonProps {
  title: string;
  onPress: () => void;
}
//onPress enviado por param para resolver conflito e usar o ReactHookForm para cuidar do form
export function Button({ title, onPress, ...rest }: Props) {
  return (
    <Container onPress={onPress} {...rest}>
      <Title>{title}</Title>
    </Container>
  );
}
