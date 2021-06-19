import 'styled-components';
import theme from './theme'

//Acrescentar no thema default o theme.ts criando 
declare module 'styled-components'{
    //tipando o tema
    type ThemeType = typeof theme

    export interface DefaultTheme extends ThemeType {}
}