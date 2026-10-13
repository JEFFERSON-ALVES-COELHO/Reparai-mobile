// InputField.js
// Campo de entrada reutilizavel para formularios.
//
// Este componente junta label + TextInput em um unico bloco.
// Assim, a tela de Login pode criar campos diferentes sem duplicar estrutura.

import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../styles/colors';

export default function InputField({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
}) {
    // Props recebidas:
    // - label: texto acima do campo.
    // - value: valor atual do campo, controlado pela tela que usa o componente.
    // - onChangeText: funcao chamada sempre que o usuario digita.
    // - placeholder: texto de ajuda exibido quando o campo esta vazio.
    // - secureTextEntry: oculta o texto, util para senhas.
    // - keyboardType: escolhe o tipo de teclado no celular.
    // - autoCapitalize: controla letras maiusculas automaticas.
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                // value liga o campo ao estado criado na tela.
                value={value}
                // onChangeText atualiza o estado a cada caractere digitado.
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textLight}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                style={styles.input}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // O campo ocupa toda a largura disponivel do formulario.
        width: '100%',
        // Espaco entre o label e o TextInput.
        gap: 8,
    },
    label: {
        // Label com cor principal de texto e peso medio.
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        // Altura minima confortavel para toque e digitacao.
        minHeight: 52,
        // Borda fina ao redor do campo.
        borderWidth: 1,
        borderColor: colors.border,
        // Bordas arredondadas para combinar com o botao.
        borderRadius: 14,
        // Fundo branco para destacar o campo sobre o fundo da tela.
        backgroundColor: colors.surface,
        // Cor do texto digitado.
        color: colors.text,
        fontSize: 16,
        // Espaco interno para o texto nao encostar na borda.
        paddingHorizontal: 16,
    },
});
