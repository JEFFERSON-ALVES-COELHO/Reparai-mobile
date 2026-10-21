
import { useState, useCallback, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { listarOcorrencias } from '../database/database';

export default function HomeScreen({ navigation, route }) {
    const [listaOcorrencias, setListaOcorrencias] = useState([]);
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [carregando, setCarregando] = useState(true);

    const nomeUsuario = route.params?.user?.name || 'Usuário';

    // Carrega as ocorrências salvas no SQLite.
    const carregarOcorrencias = useCallback(() => {
        setCarregando(true);

        try {
            const usuarioId = route.params?.user?.id;
            const ocorrencias = listarOcorrencias(usuarioId);
            setListaOcorrencias(ocorrencias);
        } catch (erro) {
            console.error('Erro ao carregar ocorrências:', erro);

            Alert.alert(
                'Erro',
                'Não foi possível carregar as ocorrências salvas.'
            );
        } finally {
            setCarregando(false);
        }
    }, []);

    // Atualiza a lista sempre que a Home recebe foco.
    useFocusEffect(
        useCallback(() => {
            carregarOcorrencias();
        }, [carregarOcorrencias])
    );

    // Limpa o parâmetro recebido do formulário.
    useEffect(() => {
        if (route.params?.novaOcorrencia) {
            navigation.setParams({
                novaOcorrencia: undefined,
            });
        }
    }, [route.params?.novaOcorrencia?.id, navigation]);

    // Abre o formulário de nova ocorrência.
    function adicionarOcorrencia() {
        navigation.navigate('NewReport', {
            user: route.params?.user,
        });
    }

    // Abre os detalhes da ocorrência selecionada.
    function abrirDetalhes(ocorrencia) {
        navigation.navigate('ReportDetail', {
            ocorrencia,
            user: route.params?.user,
        });
    }

    // Solicita confirmação antes de sair.
    function sairDoAplicativo() {
        Alert.alert(
            'Sair do Reparai',
            'Deseja realmente sair da sua conta?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: () => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    },
                },
            ]
        );
    }

    // Calcula o total de ocorrências resolvidas.
    const ocorrenciasResolvidas = listaOcorrencias.filter(
        (item) => item.status === 'Resolvida'
    ).length;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            {/* CABEÇALHO */}
            <View style={styles.header}>
                {/* SAUDAÇÃO PERSONALIZADA */}
                <Text style={styles.greeting}>
                    Olá, {nomeUsuario}! 👋
                </Text>

                <View style={styles.headerTop}>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.title}>Reparai</Text>

                        <Text style={styles.subtitle}>
                            Ajude a melhorar sua cidade
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={sairDoAplicativo}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.logoutButtonText}>
                            ↪ Sair
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* BOAS-VINDAS */}
            <View style={styles.welcomeCard}>
                <Text style={styles.welcomeTitle}>
                    Bem-vindo ao Reparai!
                </Text>

                <Text style={styles.welcomeText}>
                    Identificou um problema na sua cidade?
                    Registre uma ocorrência pelo Reparai.
                </Text>
            </View>

            {/* RESUMO */}
            <Text style={styles.sectionTitle}>
                Resumo
            </Text>

            <View style={styles.cardsContainer}>
                <View style={styles.card}>
                    <Text style={styles.cardNumber}>
                        {listaOcorrencias.length}
                    </Text>

                    <Text style={styles.cardText}>
                        Ocorrências
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardNumber}>
                        {ocorrenciasResolvidas}
                    </Text>

                    <Text style={styles.cardText}>
                        Resolvidas
                    </Text>
                </View>
            </View>

            {/* BOTÃO DE REGISTRO */}
            <TouchableOpacity
                style={styles.button}
                onPress={adicionarOcorrencia}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>
                    + Registrar ocorrência
                </Text>
            </TouchableOpacity>

            {/* LISTA DE OCORRÊNCIAS */}
            <View style={styles.reportsSection}>
                <Text style={styles.sectionTitle}>
                    Minhas ocorrências
                </Text>

                {carregando ? (
                    <View style={styles.emptyCard}>
                        <ActivityIndicator
                            size="large"
                            color="#1976D2"
                        />

                        <Text style={styles.emptyText}>
                            Carregando ocorrências...
                        </Text>
                    </View>
                ) : listaOcorrencias.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>
                            Nenhuma ocorrência registrada
                        </Text>

                        <Text style={styles.emptyText}>
                            Suas ocorrências aparecerão aqui
                            depois que você realizar um registro.
                        </Text>
                    </View>
                ) : (
                    listaOcorrencias.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.reportCard}
                            activeOpacity={0.8}
                            onPress={() => abrirDetalhes(item)}
                        >
                            <Text style={styles.reportTitle}>
                                {item.titulo}
                            </Text>

                            <Text style={styles.reportCategory}>
                                {item.categoria}
                            </Text>

                            <Text style={styles.reportDescription}>
                                {item.descricao}
                            </Text>

                            <Text style={styles.reportAddress}>
                                📍 {item.endereco}
                            </Text>

                            <View
                                style={[
                                    styles.statusBadge,
                                    {
                                        backgroundColor:
                                            item.status === 'Resolvida'
                                                ? '#E8F5E9'
                                                : item.status === 'Em execução'
                                                    ? '#FFF3E0'
                                                    : item.status === 'Em análise'
                                                        ? '#FFF8E1'
                                                        : '#E3F2FD',
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.reportStatus,
                                        {
                                            color:
                                                item.status === 'Resolvida'
                                                    ? '#2E7D32'
                                                    : item.status === 'Em execução'
                                                        ? '#E65100'
                                                        : item.status === 'Em análise'
                                                            ? '#8D6E00'
                                                            : '#1565C0',
                                        },
                                    ]}
                                >
                                    Status: {item.status || 'Enviada'}
                                </Text>
                            </View>

                            <Text style={styles.detailsHint}>
                                Toque para ver os detalhes →
                            </Text>
                        </TouchableOpacity>
                    ))
                )}
            </View>

            {/* BOTÃO DE INFORMAÇÕES */}
            <TouchableOpacity
                style={styles.infoButton}
                onPress={() => setMostrarInfo(!mostrarInfo)}
                activeOpacity={0.8}
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

    content: {
        paddingBottom: 30,
    },

    header: {
        backgroundColor: '#1976D2',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 25,
    },

    greeting: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 18,
        textAlign: 'left',
    },

    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },

    headerTextContainer: {
        flex: 1,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
    },

    subtitle: {
        color: '#E3F2FD',
        fontSize: 14,
        marginTop: 5,
    },

    logoutButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    logoutButtonText: {
        color: '#1976D2',
        fontSize: 14,
        fontWeight: 'bold',
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
        color: '#1976D2',
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

    reportsSection: {
        marginTop: 25,
    },

    emptyCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },

    emptyTitle: {
        color: '#333333',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    emptyText: {
        color: '#666666',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 21,
    },

    reportCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
    },

    reportTitle: {
        color: '#222222',
        fontSize: 17,
        fontWeight: 'bold',
    },

    reportCategory: {
        color: '#1976D2',
        fontSize: 14,
        marginTop: 6,
        fontWeight: '600',
    },

    reportDescription: {
        color: '#555555',
        fontSize: 14,
        lineHeight: 21,
        marginTop: 8,
    },

    reportAddress: {
        color: '#666666',
        fontSize: 14,
        marginTop: 10,
    },

    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
        marginTop: 12,
    },

    reportStatus: {
        fontSize: 13,
        fontWeight: '700',
    },

    detailsHint: {
        color: '#1976D2',
        fontSize: 13,
        fontWeight: '600',
        marginTop: 14,
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
        marginBottom: 20,
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
        lineHeight: 20,
    },
});
