import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${({theme}) => theme.colors.background}; //utilizando as cores do theme.ts
`;

export const Text = styled.Text `
    font-size: 24;              
    font-weight: bold;
    color: ${({theme}) => theme.colors.title};
`;