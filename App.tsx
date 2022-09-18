import "react-native-gesture-handler";
import "intl";
import "intl/locale-data/jsonp/pt-BR";
import React, { useEffect } from "react";
import AppLoading from "expo-app-loading";
import { ThemeProvider } from "styled-components";
import { Routes } from "./src/routes";
import { StatusBar } from "react-native";
import SplashScreen from "react-native-splash-screen";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import theme from "./src/global/styles/theme";
import themeDark from "./src/global/styles/themedark";
import { AuthProvider, useAuth } from "./src/hooks/auth";
import { useColorScheme } from "react-native";


export default function App() {
  
  useEffect(() => {  
    SplashScreen.hide();
  },[]);

  const deviceTheme = useColorScheme();

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
    <ThemeProvider theme={deviceTheme == 'dark' ? themeDark : theme}>
      {/* childrens possuem acesso a todo theme */}
      <StatusBar barStyle="light-content" />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
}
