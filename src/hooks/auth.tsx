import  React, { createContext, ReactNode, useContext } from "react";
import { SignIn } from "../screens/SignIn";
import * as AuthSession from 'expo-auth-session';

interface AuthProviderProps{
  children: ReactNode;
}

interface User{
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData{
  user: User;
  signInWithGoogle(): Promise<void>;
}


const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({children}: AuthProviderProps){
  const user = {
    id: '121314',
    name: 'Vanderson',
    email: 'vand@som.com',
  }

  //centralizar a autenticação
  async function signInWithGoogle() {
    try {
      const CLIENT_ID = '249257828324-teil8n673ah6kl0dp9bb61lit2bos958.apps.googleusercontent.com';
      const REDIRECT_URI = 'https://auth.expo.io/@marcelokenjicataoca/gofinances';
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
      
      const response = await AuthSession.startAsync({ authUrl });
      console.log(response);
      
    } catch (error: any) {
      throw new Error(error);
    }
  }

  return(
    <AuthContext.Provider value={{user, signInWithGoogle}}>
      {children}
    </AuthContext.Provider>
  )
}


//transformando o contexto em um hook customizado
function useAuth(){
  const context = useContext(AuthContext)
  return context;
}

export {AuthProvider, useAuth}