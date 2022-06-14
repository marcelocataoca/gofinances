import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import uuid from "react-native-uuid";
import { InputForm } from "../../components/Form/InputForm";
import { Button } from "../../components/Form/Button";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes,
} from "./styles";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { CategorySelect } from "../CategorySelect";
import { useAuth } from "../../hooks/auth";

interface FormData {
    name: string;
    amount: string;
}

type NavigationProps = {
    navigate: (screen: string) => void;
};

const shema = Yup.object().shape({
    name: Yup.string().required("Nome é obrigatório"),
    amount: Yup.number()
        .typeError("Informe um valor numérico")
        .positive("O valor não pode ser negativo")
        .required("Valor é obrigatório"),
});

export function Register() {
    const [transactionType, setTransactionType] = useState("");
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const {user} = useAuth();

    const [category, setCategory] = useState({
        key: "category",
        name: "Categoria",
    });
    const navigation = useNavigation<NavigationProps>();

    // formState -> captura os erros que o yup encontrou
    //desestruturação do useForm
    const {
        control, //regisrar os inputs do form
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(shema),
    });

    function handleTransactionsTypeSelect(type: "positive" | "negative") {
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    }

    async function handleRegister(form: FormData) {
        if (!transactionType)
            return Alert.alert("Selecione o tipo da transação");
        if (category.key === "category")
            return Alert.alert("Selecione a categoria");

        const newTransaction = {
            id: String(uuid.v4()), //v4 devolve um hash
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date(),
        };

        try {
            const dataKey = `@gofinances:transactions_user:${user.id}`;
            const data = await AsyncStorage.getItem(dataKey); //recupera os dados do storage
            const currentData = data ? JSON.parse(data) : []; //pega os dados da nova transct

            const dataFormatted = [...currentData, newTransaction];
            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

            reset();
            setTransactionType("");
            setCategory({
                key: "category",
                name: "Categoria",
            });

            navigation.navigate("Listagem");
        } catch (error) {
            console.log(error);
            Alert.alert("Não foi possivel alterar");
        }
    }

    useEffect(() => {
        const dataKey = "@gofinances:transactions";
        async function loadData() {
            //useEffect não é asincrono
            const data = await AsyncStorage.getItem(dataKey);
        }
        loadData();
        // async function removeAll() {
        //     await AsyncStorage.removeItem(dataKey);
        // }
        // removeAll();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>
                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />
                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
                        />
                        <TransactionsTypes>
                            <TransactionTypeButton
                                type="up"
                                title="Income"
                                onPress={() =>
                                    handleTransactionsTypeSelect("positive")
                                }
                                isActive={transactionType === "positive"}
                            />
                            <TransactionTypeButton
                                type="down"
                                title="Outcome"
                                onPress={() =>
                                    handleTransactionsTypeSelect("negative")
                                }
                                isActive={transactionType === "negative"}
                            />
                        </TransactionsTypes>
                        <CategorySelectButton
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal}
                        />
                    </Fields>
                    <Button
                        title="Enviar"
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>
                <Modal visible={categoryModalOpen}>
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    );
}
