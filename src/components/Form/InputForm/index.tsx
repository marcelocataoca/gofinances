import React from "react";
import { TextInputProps } from "react-native";
import { Control, Controller } from "react-hook-form";

import { Input } from "../Input";
import { Container } from "./styles";

interface Props extends TextInputProps {
  control: Control;
  name: string;
}
//uso do Controller para altera o state somente no submit e não em todo momento
export function InputForm({ control, name, ...rest }: Props) {
  return (
    <Container>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input onChangeText={onChange} value={value} {...rest} />
        )}
        name={name}
      ></Controller>
    </Container>
  );
}
