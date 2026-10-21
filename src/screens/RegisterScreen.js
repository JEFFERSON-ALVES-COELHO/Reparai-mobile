
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

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    function handleRegister() {
        setErrorMessage('');
        setSuccessMessage('');

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setErrorMessage('Preencha todos os campos.');
            return;
        }

        const emailNormalizado = email.trim().toLowerCase();
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado);

        if (!emailValido) {
            setErrorMessage('Informe um e-mail válido.');
            return;
        }

        if (password.length < 4) {
            setErrorMessage('A senha deve ter pelo menos 4 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('As senhas não coincidem.');
            return;
        }

        setLoading(true);

        try {
            User.registerLocal(name, emailNormalizado, password);

            setSuccessMessage('Usuário cadastrado com sucesso!');
            setErrorMessage('');

            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            setTimeout(() => {
                navigation.replace('Login', {
                    registeredEmail: emailNormalizado,
                });
            }, 1500);


        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.keyboardArea}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.logo}>RP</Text>
                    <Text style={styles.title}>Criar conta</Text>
                    <Text style={styles.subtitle}>
                        Cadastre-se para acompanhar suas ocorrências no Reparai.
                    </Text>
                </View>

                <View style={styles.form}>
                    <InputField
                        label="Nome completo"
                        value={name}
                        onChangeText={setName}
                        placeholder="Digite seu nome"
                        autoCapitalize="words"
                    />

                    <InputField
                        label="E-mail"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Digite seu e-mail"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <InputField
                        label="Senha"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Mínimo de 4 caracteres"
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    <InputField
                        label="Confirmar senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Digite a senha novamente"
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    {errorMessage ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>
                                {errorMessage}
                            </Text>
                        </View>
                    ) : null}

                    {successMessage ? (
                        <Text style={styles.successText}>
                            {successMessage}
                        </Text>
                    ) : null}

                    <PrimaryButton
                        title={loading ? 'Cadastrando...' : 'Cadastrar'}
                        onPress={handleRegister}
                    />

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.linkText}>
                            Já tem conta? Entrar
                        </Text>
                    </TouchableOpacity>
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
        gap: 28,
    },
    header: {
        alignItems: 'center',
        gap: 6,
    },
    logo: {
        color: colors.primary,
        fontSize: 54,
        fontWeight: '800',
    },
    title: {
        color: colors.text,
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
    },
    subtitle: {
        color: colors.textLight,
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
    },
    form: {
        gap: 16,
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
    successText: {
        color: '#218838',
        textAlign: 'center',
        fontWeight: '600',
    },
    linkText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
    },
});
