
import { useState, useCallback, useEffect } from 'react';

import {
    View,
    Text,
    TextInput,
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
    const [busca, setBusca] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('Todos');
    const [filtroCategoria, setFiltroCategoria] = useState('Todas');

    const statusDisponiveis = [
        'Todos',
        'Enviada',
        'Em análise',
        'Em execução',
        'Resolvida',
    ];

    const categoriasDisponiveis = [
        'Todas',
        'Buraco na via',
        'Iluminação pública',
        'Lixo irregular',
        'Sinalização',
        'Calçada',
        'Outros',
    ];

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
    }, [route.params?.user?.id]);

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
        (item) => (item.status || 'Enviada') === 'Resolvida'
    ).length;

    // Remove acentos e ignora maiúsculas/minúsculas na pesquisa.
    function normalizarTexto(valor) {
        return String(valor || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }

    // Aplica pesquisa, status e categoria sem alterar a lista original.
    const ocorrenciasFiltradas = listaOcorrencias.filter((item) => {
        const termoBusca = normalizarTexto(busca);

        const correspondeBusca =
            normalizarTexto(item.titulo).includes(termoBusca) ||
            normalizarTexto(item.endereco).includes(termoBusca);

        const correspondeStatus =
            filtroStatus === 'Todos' ||
            (item.status || 'Enviada') === filtroStatus;

        const correspondeCategoria =
            filtroCategoria === 'Todas' ||
            item.categoria === filtroCategoria;

        return correspondeBusca && correspondeStatus && correspondeCategoria;
    });

    function limparFiltros() {
        setBusca('');
        setFiltroStatus('Todos');
        setFiltroCategoria('Todas');
    }

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

                {/* PESQUISA */}
                <TextInput
                    style={styles.searchInput}
                    value={busca}
                    onChangeText={setBusca}
                    placeholder="Pesquisar por título ou endereço..."
                    placeholderTextColor="#888888"
                    returnKeyType="search"
                    accessibilityLabel="Pesquisar ocorrências por título ou endereço"
                />

                {/* FILTRO POR STATUS */}
                <Text style={styles.filterLabel}>Filtrar por status</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContainer}
                >
                    {statusDisponiveis.map((status) => (
                        <TouchableOpacity
                            key={status}
                            style={[
                                styles.filterChip,
                                filtroStatus === status && styles.filterChipActive,
                            ]}
                            onPress={() => setFiltroStatus(status)}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    filtroStatus === status && styles.filterChipTextActive,
                                ]}
                            >
                                {status}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* FILTRO POR CATEGORIA */}
                <Text style={styles.filterLabel}>Filtrar por categoria</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContainer}
                >
                    {categoriasDisponiveis.map((categoria) => (
                        <TouchableOpacity
                            key={categoria}
                            style={[
                                styles.filterChip,
                                filtroCategoria === categoria && styles.filterChipActive,
                            ]}
                            onPress={() => setFiltroCategoria(categoria)}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    filtroCategoria === categoria && styles.filterChipTextActive,
                                ]}
                            >
                                {categoria}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {!carregando && listaOcorrencias.length > 0 && (
                    <Text style={styles.resultsCount}>
                        {ocorrenciasFiltradas.length}{' '}
                        {ocorrenciasFiltradas.length === 1
                            ? 'ocorrência encontrada'
                            : 'ocorrências encontradas'}
                    </Text>
                )}

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
                ) : ocorrenciasFiltradas.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>
                            Nenhuma ocorrência encontrada
                        </Text>
                        <Text style={styles.emptyText}>
                            Tente alterar a pesquisa ou os filtros selecionados.
                        </Text>
                        <TouchableOpacity
                            style={styles.clearFiltersButton}
                            onPress={limparFiltros}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.clearFiltersButtonText}>
                                Limpar pesquisa e filtros
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    ocorrenciasFiltradas.map((item) => (
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
        backgroundColor: '#F3F6FA',
    },
    content: {
        paddingBottom: 36,
    },
    header: {
        backgroundColor: '#123B63',
        paddingHorizontal: 22,
        paddingTop: 54,
        paddingBottom: 30,
        borderBottomLeftRadius: 26,
        borderBottomRightRadius: 26,
    },
    greeting: {
        color: '#D9E9F7',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 18,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    headerTextContainer: { flex: 1 },
    title: {
        color: '#FFFFFF',
        fontSize: 34,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
    subtitle: {
        color: '#C6D9EA',
        fontSize: 14,
        marginTop: 5,
    },
    logoutButton: {
        backgroundColor: 'rgba(255,255,255,0.14)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.28)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
    welcomeCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginTop: -1,
        marginBottom: 24,
        padding: 20,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E4EAF0',
        elevation: 2,
        shadowColor: '#16324F',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    welcomeTitle: {
        fontSize: 19,
        fontWeight: '800',
        color: '#123B63',
    },
    welcomeText: {
        fontSize: 14,
        color: '#607386',
        lineHeight: 22,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: '800',
        color: '#172B3A',
        marginHorizontal: 20,
        marginBottom: 13,
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        gap: 12,
    },
    card: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        paddingVertical: 18,
        paddingHorizontal: 14,
        borderRadius: 17,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#E4EAF0',
        elevation: 2,
        shadowColor: '#16324F',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },
    cardNumber: {
        fontSize: 30,
        fontWeight: '800',
        color: '#1769AA',
    },
    cardText: {
        fontSize: 13,
        color: '#607386',
        marginTop: 5,
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#1769AA',
        marginHorizontal: 20,
        marginTop: 22,
        minHeight: 54,
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#1769AA',
        shadowOpacity: 0.2,
        shadowRadius: 7,
        shadowOffset: { width: 0, height: 3 },
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
    searchInput: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginTop: 4,
        marginBottom: 17,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#DCE5ED',
        color: '#172B3A',
        fontSize: 14,
    },
    filterLabel: {
        marginHorizontal: 20,
        marginBottom: 9,
        color: '#405568',
        fontSize: 13,
        fontWeight: '700',
    },
    filtersContainer: {
        paddingHorizontal: 20,
        paddingBottom: 15,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#C9D8E5',
        backgroundColor: '#FFFFFF',
    },
    filterChipActive: {
        backgroundColor: '#1769AA',
        borderColor: '#1769AA',
    },
    filterChipText: {
        color: '#466176',
        fontSize: 12,
        fontWeight: '700',
    },
    filterChipTextActive: { color: '#FFFFFF' },
    resultsCount: {
        marginHorizontal: 20,
        marginBottom: 12,
        color: '#718396',
        fontSize: 12,
        fontWeight: '600',
    },
    clearFiltersButton: {
        marginTop: 15,
        paddingHorizontal: 17,
        paddingVertical: 12,
        backgroundColor: '#1769AA',
        borderRadius: 11,
    },
    clearFiltersButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
    },
    reportsSection: { marginTop: 27 },
    emptyCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E4EAF0',
    },
    emptyTitle: {
        color: '#243B4D',
        fontSize: 15,
        fontWeight: '800',
        textAlign: 'center',
    },
    emptyText: {
        color: '#718396',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 21,
    },
    reportCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginBottom: 13,
        padding: 17,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E4EAF0',
        elevation: 2,
        shadowColor: '#16324F',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },
    reportTitle: {
        color: '#172B3A',
        fontSize: 16,
        fontWeight: '800',
    },
    reportCategory: {
        color: '#1769AA',
        fontSize: 12,
        marginTop: 6,
        fontWeight: '800',
    },
    reportDescription: {
        color: '#607386',
        fontSize: 13,
        lineHeight: 20,
        marginTop: 9,
    },
    reportAddress: {
        color: '#718396',
        fontSize: 12,
        marginTop: 11,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        marginTop: 13,
    },
    reportStatus: {
        fontSize: 11,
        fontWeight: '800',
    },
    detailsHint: {
        color: '#1769AA',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 14,
    },
    infoButton: {
        marginHorizontal: 20,
        marginTop: 22,
        padding: 15,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#C9D8E5',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    infoButtonText: {
        color: '#1769AA',
        fontSize: 13,
        fontWeight: '800',
    },
    infoCard: {
        backgroundColor: '#E8F1F8',
        marginHorizontal: 20,
        marginTop: 12,
        marginBottom: 20,
        padding: 19,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#D4E3EF',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#123B63',
        marginBottom: 11,
    },
    infoText: {
        fontSize: 13,
        color: '#405568',
        marginBottom: 8,
        lineHeight: 20,
    },
});
