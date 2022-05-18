import React, { useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { useAuth } from "../../hooks/auth";

import {SignInSocialButton} from '../../components/SignInSocialButton';

import { Container, Header, TitleWrapper, Title, SignInTitle, Footer, FooterWrapper} from './styles';
import { ActivityIndicator, Alert } from "react-native";
import { useTheme } from "styled-components";

export function SignIn(){
  const [isLoading, setIsLoading] = useState(false);
  const {signInWithGoogle} = useAuth();
  const theme = useTheme();
  
  async function handleSignInWithGoogle(){
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível se conectar com a conta Google');
    } finally{
      setIsLoading(false);
    }
  }

  return(
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)}
            height={RFValue(68)}
          />
          <Title>
            Controle suas {'\n'} finanças de forma {'\n'}  muito simples.
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça o seu login com {'\n'} uma das contas abaixo
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
          <SignInSocialButton
            title="Entrar com Apple"
            svg={AppleSvg}
          />
        </FooterWrapper>

        {isLoading && <ActivityIndicator color={theme.colors.shape} 
          style={{marginTop: 18}}
        />}
      </Footer>
    </Container>
  );
}