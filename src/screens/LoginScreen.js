// src/screens/LoginScreen.js 
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { User } from '../models/User';
import { colors } from '../styles/colors';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    function handleLogin() {
        // TRATAMENTO DE EXCEÇÃO (try/catch) 
        try {
            // Limpa mensagens de erro anteriores 
            setErrorMessage('');

            // Consulta o SQLite (SELECT ... WHERE email = ? AND password = ?).
            // Lança erro se as credenciais não existirem.
            const userInstance = User.authenticateLocal(email, password);

            navigation.replace('Home', { user: userInstance.toObject() });
        } catch (error) {
            // Captura o erro disparado pelo 'throw new Error' e atualiza o estado visual 
            setErrorMessage(error.message);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.keyboardArea}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.logo}>RP</Text>
                    <Text style={styles.title}>Bem-vindo ao Reparai</Text>
                    <Text style={styles.subtitle}>Entre para acompanhar suas ocorrências.</Text>
                </View>

                <View style={styles.form}>
                    <InputField
                        label="E-mail"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="digite seu email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <InputField
                        label="Senha"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Digite sua senha"
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    {/* Exibição condicional do feedback de erro para o usuário */}
                    {errorMessage ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </View>
                    ) : null}

                    <PrimaryButton title="Entrar" onPress={handleLogin} />

                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
                    </TouchableOpacity>

                    <Text style={styles.hint}>
                        Acesso de teste: aluno@senac.com | senha: 1234
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
        gap: 36,
    },
    header: {
        alignItems: 'center',
        gap: 1,
    },
    logo: {
        color: colors.primary,
        fontSize: 58,
        fontWeight: '800',
    },
    title: {
        color: colors.text,
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
    },
    subtitle: {
        maxWidth: 320,
        color: colors.textLight,
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
    },
    form: {
        gap: 18,
    },
    errorContainer: {
        backgroundColor: '#FFEBEB',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.error,
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    linkText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
    },
    hint: {
        color: colors.textLight,
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'center',
    },
});