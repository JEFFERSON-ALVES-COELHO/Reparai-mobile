import { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

export default function HomeScreen() {

    // Estado para controlar a quantidade de ocorrências
    const [ocorrencias, setOcorrencias] = useState(0);

    // Estado para mostrar/ocultar informações
    const [mostrarInfo, setMostrarInfo] = useState(false);

    // Adiciona uma ocorrência
    function adicionarOcorrencia() {
        setOcorrencias(ocorrencias + 1);
    }

    return (
        <ScrollView style={styles.container}>

            {/* CABEÇALHO */}
            <View style={styles.header}>
                <Text style={styles.title}>Reparai</Text>

                <Text style={styles.subtitle}>
                    Ajude a melhorar sua cidade
                </Text>
            </View>

            {/* CARD DE BOAS-VINDAS */}
            <View style={styles.welcomeCard}>
                <Text style={styles.welcomeTitle}>
                    Olá! 👋
                </Text>

                <Text style={styles.welcomeText}>
                    Identificou um problema na sua cidade?
                    Registre uma ocorrência pelo Reparai.
                </Text>
            </View>

            {/* CARDS DE INFORMAÇÕES */}
            <Text style={styles.sectionTitle}>
                Resumo
            </Text>

            <View style={styles.cardsContainer}>

                <View style={styles.card}>
                    <Text style={styles.cardNumber}>
                        {ocorrencias}
                    </Text>

                    <Text style={styles.cardText}>
                        Ocorrências
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardNumber}>
                        0
                    </Text>

                    <Text style={styles.cardText}>
                        Resolvidas
                    </Text>
                </View>

            </View>

            {/* BOTÃO DE INTERAÇÃO */}
            <TouchableOpacity
                style={styles.button}
                onPress={adicionarOcorrencia}
            >
                <Text style={styles.buttonText}>
                    + Registrar ocorrência
                </Text>
            </TouchableOpacity>

            {/* BOTÃO PARA MOSTRAR INFORMAÇÕES */}
            <TouchableOpacity
                style={styles.infoButton}
                onPress={() => setMostrarInfo(!mostrarInfo)}
            >
                <Text style={styles.infoButtonText}>
                    {mostrarInfo
                        ? 'Ocultar informações'
                        : 'Como funciona o Reparai?'}
                </Text>
            </TouchableOpacity>

            {/* INFORMAÇÕES EXTRAS */}
            {mostrarInfo && (
                <View style={styles.infoCard}>

                    <Text style={styles.infoTitle}>
                        Como funciona?
                    </Text>

                    <Text style={styles.infoText}>
                        1. Identifique um problema urbano.
                    </Text>

                    <Text style={styles.infoText}>
                        2. Registre a ocorrência.
                    </Text>

                    <Text style={styles.infoText}>
                        3. Informe o local e a categoria.
                    </Text>

                    <Text style={styles.infoText}>
                        4. Acompanhe o andamento da solicitação.
                    </Text>

                </View>
            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },

    header: {
        backgroundColor: '#1976D2',
        padding: 25,
        paddingTop: 50,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
    },

    subtitle: {
        color: '#E3F2FD',
        fontSize: 16,
        marginTop: 5,
    },

    welcomeCard: {
        backgroundColor: '#FFFFFF',
        margin: 20,
        padding: 20,
        borderRadius: 15,
        elevation: 3,
    },

    welcomeTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222222',
    },

    welcomeText: {
        fontSize: 15,
        color: '#666666',
        lineHeight: 22,
        marginTop: 8,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222222',
        marginHorizontal: 20,
        marginBottom: 12,
    },

    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
    },

    card: {
        backgroundColor: '#FFFFFF',
        width: '47%',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 3,
    },

    cardNumber: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1976D2',
    },

    cardText: {
        fontSize: 14,
        color: '#666666',
        marginTop: 5,
    },

    button: {
        backgroundColor: '#1976D2',
        marginHorizontal: 20,
        marginTop: 25,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    infoButton: {
        margin: 20,
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1976D2',
        alignItems: 'center',
    },

    infoButtonText: {
        color: '#1976D2',
        fontSize: 15,
        fontWeight: 'bold',
    },

    infoCard: {
        backgroundColor: '#E3F2FD',
        marginHorizontal: 20,
        marginBottom: 30,
        padding: 20,
        borderRadius: 15,
    },

    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1565C0',
        marginBottom: 10,
    },

    infoText: {
        fontSize: 14,
        color: '#444444',
        marginBottom: 8,
    },

});
