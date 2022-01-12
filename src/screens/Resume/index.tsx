import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryPie } from "victory-native"; 

import { HistoryCard } from "../../components/HistoryCard";

import { Container, Content, Header, Title, ChartContainer, MonthSelect, MonthSelectButton, MonthSelectIcon, Month} from "./styles";
import { categories } from "../../utils/categories";
import { RFValue } from "react-native-responsive-fontsize";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTheme } from "styled-components";

interface TransactionData {
    type: "positive" | "negative";
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormated: string;
    color: string;
    percent: string;
}

export function Resume() {
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
        []
    );

    const theme = useTheme();

    async function loadData() {
        const dataKey = "@gofinances:transactions";
        const response = await AsyncStorage.getItem(dataKey); //recupera os dados do storage
        const currentResponse = response ? JSON.parse(response) : []; //pega os dados da nova transct

        const expensives = currentResponse?.filter(
            (expensive: TransactionData) => expensive?.type === "negative"
        );

        const expensivesTotal = expensives.reduce((acc: number, expensive: TransactionData)=> {
            return acc + Number(expensive.amount);
        }, 0)

        console.log(expensivesTotal)

        const totalByCategory: CategoryData[] = [];

        categories.forEach((category) => {
            let categorySum = 0;

            expensives.forEach((expensive: TransactionData) => {
                if (expensive.category === category.key) {
                    categorySum += Number(expensive.amount);
                }
            });
            if (categorySum > 0) {
                const totalFormated = categorySum.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                });

                const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    total: categorySum,
                    totalFormated,
                    color: category.color,
                    percent
                });
            }
        });
        setTotalByCategories(totalByCategory);
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
            <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingBottom: useBottomTabBarHeight(),  
                }}
            >
                <MonthSelect>
                    <MonthSelectButton>
                        <MonthSelectIcon name="chevron-left"/>
                    </MonthSelectButton>
                    <Month>Maio</Month>
                    <MonthSelectButton>
                        <MonthSelectIcon name="chevron-right"/>
                    </MonthSelectButton>
                </MonthSelect>

                <ChartContainer>
                    <VictoryPie
                        data={totalByCategories}
                        colorScale={totalByCategories.map(category => category.color)}
                        style={{
                            labels: { fontSize: RFValue(18), fontWeight: 'bold', fill: theme.colors.shape }
                        }}
                        labelRadius={50}
                        x="percent"
                        y="total"
                    /> 
                </ChartContainer>
                {totalByCategories.map((item) => (
                    <HistoryCard
                        key={item.key}
                        title={item.name}
                        amount={item.totalFormated}
                        color={item.color}
                    />
                ))}
            </Content>
          
        </Container>
    );
}
