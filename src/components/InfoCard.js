// src/components/InfoCard.js 
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';

export default function InfoCard({ cardModel }) {
    // PROGRAMAÇÃO DEFENSIVA / TRATAMENTO DE ERRO EM UI: 
    // Evita o crash caso o componente seja renderizado sem um cardModel válido 
    if (!cardModel || typeof cardModel.getIcon !== 'function') {
        return (
            <View style={styles.cardError}>
                <Text style={styles.errorText}>Dados do card indisponiveis</Text>
            </View>
        );
    }

    try {
        return (
            <View style={styles.card}>
                <Text style={styles.icon}>{cardModel.getIcon()}</Text>
                <Text style={styles.value}>{cardModel.getFormattedValue()}</Text>
                <Text style={styles.title}>{cardModel.getTitle()}</Text>
            </View>
        );
    } catch (error) {
        // Fallback visual caso algum método polimórfico falhe internamente 
        return (
            <View style={styles.cardError}>
                <Text style={styles.errorText}>Erro ao carregar card</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 16,
        backgroundColor: colors.surface,
        padding: 16,
        gap: 6,
    },
    cardError: {
        flex: 1,
        borderRadius: 16,
        backgroundColor: '#FFF0F0',
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    value: {
        color: colors.text,
        fontSize: 20,
        fontWeight: '800',
    },
    title: {
        color: colors.textLight,
        fontSize: 12,
    },
    errorText: {
        color: colors.error,
        fontSize: 12,
        fontWeight: '600',
    },
});
