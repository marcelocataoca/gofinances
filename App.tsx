import "react-native-gesture-handler";
import "intl";
import "intl/locale-data/jsonp/pt-BR";
import React from "react";
import AppLoading from "expo-app-loading";
import { ThemeProvider } from "styled-components";
import { Routes } from "./src/routes";
import { StatusBar } from "react-native";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import theme from "./src/global/styles/theme";
import { AuthProvider, useAuth } from "./src/hooks/auth";
import { useColorScheme } from "react-native";


export default function App() {
  const deviceTheme = useColorScheme();
  const getTheme = deviceTheme ? theme[deviceTheme] : theme.dark;
  console.log(theme);
  console.log(getTheme);
  
  
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const {loadUserStorage} = useAuth();
  if (!fontsLoaded || loadUserStorage) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider theme={theme}>
      {/* childrens possuem acesso a todo theme */}
      <StatusBar barStyle="light-content" />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
}
