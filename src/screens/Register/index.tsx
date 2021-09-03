import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
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

interface FormData {
    name: string;
    amount: string;
}

const shema = Yup.object().shape({
    name: Yup.string().required("Nome é obrigatório"),
    amount: Yup.number()
        .typeError("Informe um valor numérico")
        .positive("O valor não pode ser negativo"),
});

export function Register() {
    const [transactionType, setTransactionType] = useState("");
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const dataKey = "@gofinances:transactions";

    const [category, setCategory] = useState({
        key: "category",
        name: "Categoria",
    });
    // formState -> captura os erros que o yup encontrou
    //desestruturação do useForm
    const {
        control, //regisrar os inputs do form
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(shema),
    });

    function handleTransactionsTypeSelect(type: "up" | "down") {
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
        const data = {
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key,
        };

        try {
            await AsyncStorage.setItem(dataKey, JSON.stringify(data));
        } catch (error) {
            console.log(error);
            Alert.alert("Não foi possivel alterar");
        }
    }

    useEffect(() => {
        async function loadData() {
            const data = await AsyncStorage.getItem(dataKey);
            console.log(JSON.parse(data!));
        }
        loadData();
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
                                    handleTransactionsTypeSelect("up")
                                }
                                isActive={transactionType === "up"}
                            />
                            <TransactionTypeButton
                                type="down"
                                title="Outcome"
                                onPress={() =>
                                    handleTransactionsTypeSelect("down")
                                }
                                isActive={transactionType === "down"}
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
