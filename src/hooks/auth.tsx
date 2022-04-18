import  React, { createContext, ReactNode, useContext } from "react";
import { SignIn } from "../screens/SignIn";

interface AuthProviderProps{
  children: ReactNode;
}

interface IAuthContextData{
  user: string;
}


const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({children}: AuthProviderProps){
  return(
    <AuthContext.Provider value={{user:"Flabio"}}>
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